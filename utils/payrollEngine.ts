import { IPayrollComponent } from '@/models/PayrollConfig';

/**
 * Safely evaluate payroll formulas using mathjs.
 * We import only `evaluate` from mathjs to keep it lightweight.
 * Each component formula is evaluated in order, building on prior results.
 */
let _evaluate: ((expr: string, scope: Record<string, number>) => number) | null = null;

async function getEvaluator() {
  if (!_evaluate) {
    const mathjs = await import('mathjs');
    _evaluate = mathjs.evaluate as any;
  }
  return _evaluate!;
}

export interface ComputedPayslip {
  components: Record<string, number>;
  earningsTotal: number;
  deductionsTotal: number;
  netPay: number;
  errors: string[];
}

export async function computePayslip(
  row: {
    gross?: number;
    ctc?: number;
    daysWorked?: number;
    working_days?: number;
    daysInMonth?: number;
    total_days?: number;
    esic?: string;
    ESIC?: string;
    overtime?: number;
    Overtime?: number;
    incentive?: number;
    Incentive?: number;
    bonus?: number;
    Bonus?: number;
    loan?: number;
    Loan?: number;
    advance_salary?: number;
    'advance salary'?: number;
    Advance_Salary?: number;
    [key: string]: any;
  },
  components: IPayrollComponent[],
  salaryInputMode: 'CTC' | 'GROSS' = 'CTC'
): Promise<ComputedPayslip> {
  const evaluate = await getEvaluator();
  const errors: string[] = [];

  // Validation and Default Handling
  const daysWorked = Math.max(0, Number(row.working_days) || Number(row.daysWorked) || 30);
  const daysInMonth = Math.max(1, Number(row.total_days) || Number(row.daysInMonth) || 30);
  const prorationFactor = daysWorked / daysInMonth;

  // Base input from excel
  const ctc = Math.max(0, Number(row.ctc) || Number(row.gross) || 0);

  // 1. Replace 'Gross Salary' with 'Actual Salary (Uncalculated)'
  const actualSalaryUncalculated = (ctc / daysInMonth) * daysWorked;

  // 2. ESIC Eligibility Check
  // Applicable only if YES and within statutory threshold (21000)
  const esicFlag = String(row.esic || row.ESIC || '').trim().toUpperCase();
  const esicThreshold = 21000;
  const isEsicEligible = (esicFlag === 'YES' && actualSalaryUncalculated <= esicThreshold);
  
  // Default ESIC calculation: 0.75% of actual_salary_uncalculated
  const esicValue = isEsicEligible ? (actualSalaryUncalculated * 0.0075) : 0;

  // 3. PF Eligibility Check — only calculate when pf/PF column = "YES" in CSV
  const pfFlag = String(row.pf || row.PF || '').trim().toUpperCase();
  const isPfEligible = pfFlag === 'YES';

  // Parse additional dynamic components with defaults
  const overtime = Math.max(0, Number(row.overtime) || Number(row.Overtime) || 0);
  const incentive = Math.max(0, Number(row.incentive) || Number(row.Incentive) || 0);
  const bonus = Math.max(0, Number(row.bonus) || Number(row.Bonus) || 0);
  
  const loan = Math.max(0, Number(row.loan) || Number(row.Loan) || 0);
  const advanceSalary = Math.max(0, Number(row.advance_salary) || Number(row['advance salary']) || Number(row.Advance_Salary) || 0);

  // Seed the scope
  const scope: Record<string, number> = {
    ctc: ctc,
    actual_salary_uncalculated: actualSalaryUncalculated,
    gross: actualSalaryUncalculated, // Legacy fallback
    days_worked: daysWorked,
    days_in_month: daysInMonth,
    proration_factor: prorationFactor,
    esic_eligible: isEsicEligible ? 1 : 0,
    esic: esicValue,
    pf_eligible: isPfEligible ? 1 : 0,
    overtime: overtime,
    incentive: incentive,
    bonus: bonus,
    loan: loan,
    advance_salary: advanceSalary,
    earnings_total: 0,
    deductions_total: 0,
  };

  // Build dynamic components if not explicitly provided in config
  const configKeys = new Set(components.map(c => c.key.toLowerCase()));
  const dynamicComponents: IPayrollComponent[] = [];

  const addDynamicComponent = (key: string, label: string, type: 'earning' | 'deduction') => {
    // Add if value is > 0 and not already defined in the config
    const val = scope[key];
    if (!configKeys.has(key) && val > 0) {
      dynamicComponents.push({
        key,
        label,
        type,
        formula: key, // Resolves directly to the variable in scope
        order: 99,    // Evaluate at the end
      });
    }
  };

  addDynamicComponent('overtime', 'Overtime', 'earning');
  addDynamicComponent('incentive', 'Incentive', 'earning');
  addDynamicComponent('bonus', 'Bonus', 'earning');
  addDynamicComponent('esic', 'ESIC', 'deduction');
  addDynamicComponent('loan', 'Loan', 'deduction');
  addDynamicComponent('advance_salary', 'Advance Salary', 'deduction');

  const allComponents = [...components, ...dynamicComponents].sort((a, b) => a.order - b.order);
  
  const earnings = allComponents.filter(c => c.type === 'earning');
  const deductions = allComponents.filter(c => c.type === 'deduction');
  const results = allComponents.filter(c => c.type === 'result');

  let earningsTotal = 0;
  let deductionsTotal = 0;

  // --- PHASE 1: EVALUATE EARNINGS ---
  for (const comp of earnings) {
    try {
      scope.earnings_total = earningsTotal;
      
      // Calculate value using formula
      // Note: 'actual_salary_uncalculated' inherently handles attendance proration.
      const val = Number(evaluate(comp.formula, { ...scope }));
      const rounded = Math.round(val * 100) / 100;
      
      scope[comp.key] = rounded;
      earningsTotal += rounded;
    } catch (err: any) {
      errors.push(`Formula error for "${comp.label}": ${err.message}`);
      scope[comp.key] = 0;
    }
  }

  // --- PHASE 2: EVALUATE DEDUCTIONS ---
  scope.earnings_total = earningsTotal;

  for (const comp of deductions) {
    try {
      scope.deductions_total = deductionsTotal;
      
      let val = Number(evaluate(comp.formula, { ...scope }));
      
      // HARD OVERRIDE: If ESIC and not eligible → force to 0
      if (comp.key.toLowerCase() === 'esic' && !isEsicEligible) {
        val = 0;
      }
      // HARD OVERRIDE: If PF and not eligible → force to 0
      if ((comp.key.toLowerCase() === 'pf' || comp.key.toLowerCase() === 'pf_employee') && !isPfEligible) {
        val = 0;
      }
      
      const rounded = Math.round(val * 100) / 100;
      
      scope[comp.key] = rounded;
      deductionsTotal += rounded;
    } catch (err: any) {
      errors.push(`Formula error for "${comp.label}": ${err.message}`);
      scope[comp.key] = 0;
    }
  }

  // --- PHASE 3: CALCULATE NET PAY & RESULTS ---
  scope.deductions_total = deductionsTotal;
  let netPay = earningsTotal - deductionsTotal;

  for (const comp of results) {
    try {
      const val = Number(evaluate(comp.formula, { ...scope }));
      const rounded = Math.round(val * 100) / 100;
      scope[comp.key] = rounded;
      if (comp.key === 'net_pay') netPay = rounded;
    } catch (err: any) {
      errors.push(`Formula error for "${comp.label}": ${err.message}`);
      scope[comp.key] = 0;
    }
  }

  // Build clean components map containing only the components that were evaluated
  const validKeys = new Set(allComponents.map(c => c.key));
  validKeys.add('actual_salary_uncalculated'); // Required for CSV export transparency

  const computedComponents: Record<string, number> = {};
  
  for (const [k, v] of Object.entries(scope)) {
    if (validKeys.has(k)) {
      computedComponents[k] = v;
    }
  }

  return {
    components: computedComponents,
    earningsTotal: Math.round(earningsTotal * 100) / 100,
    deductionsTotal: Math.round(deductionsTotal * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    errors,
  };
}
