import mongoose, { Schema, Document } from 'mongoose';

export interface IPayslipRecord {
  payrollRunId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  gross: number;
  daysWorked: number;
  daysInMonth: number;
  components: Record<string, number>;    // { basic: 12000, hra: 6000, pf: 1440, ... }
  earningsTotal: number;
  deductionsTotal: number;
  netPay: number;
  pdfUrl?: string;
  errors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PayslipRecordSchema: Schema = new Schema({
  payrollRunId:    { type: Schema.Types.ObjectId, ref: 'PayrollRun', required: true },
  clientId:        { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  employeeId:      { type: String, required: true },
  employeeName:    { type: String, required: true },
  department:      { type: String, default: '' },
  designation:     { type: String, default: '' },
  gross:           { type: Number, default: 0 },
  daysWorked:      { type: Number, default: 30 },
  daysInMonth:     { type: Number, default: 30 },
  components:      { type: Schema.Types.Mixed, default: {} },
  earningsTotal:   { type: Number, default: 0 },
  deductionsTotal: { type: Number, default: 0 },
  netPay:          { type: Number, default: 0 },
  pdfUrl:          { type: String },
  errors:          [{ type: String }],
}, { timestamps: true });

PayslipRecordSchema.index({ payrollRunId: 1 });
PayslipRecordSchema.index({ clientId: 1, employeeId: 1 });

export default mongoose.models.PayslipRecord ||
  mongoose.model<IPayslipRecord & Document>('PayslipRecord', PayslipRecordSchema);
