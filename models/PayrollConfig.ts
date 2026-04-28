import mongoose, { Schema, Document } from 'mongoose';

export interface IPayrollComponent {
  key: string;          // e.g. "basic", "hra", "pf"
  label: string;        // e.g. "Basic Salary"
  type: 'earning' | 'deduction' | 'result';
  formula: string;      // mathjs expression e.g. "gross * 0.4"
  order: number;        // evaluation order
}

export interface IPayrollConfig extends Document {
  clientId: mongoose.Types.ObjectId;
  salaryInputMode: 'CTC' | 'GROSS';
  components: IPayrollComponent[];
  version: number;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const PayrollComponentSchema = new Schema({
  key:     { type: String, required: true },
  label:   { type: String, required: true },
  type:    { type: String, enum: ['earning', 'deduction', 'result'], required: true },
  formula: { type: String, required: true },
  order:   { type: Number, default: 0 },
}, { _id: false });

const PayrollConfigSchema: Schema = new Schema({
  clientId:        { type: Schema.Types.ObjectId, ref: 'Client', required: true, unique: true },
  salaryInputMode: { type: String, enum: ['CTC', 'GROSS'], default: 'CTC' },
  components:      [PayrollComponentSchema],
  version:         { type: Number, default: 1 },
  updatedBy:       { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.PayrollConfig ||
  mongoose.model<IPayrollConfig>('PayrollConfig', PayrollConfigSchema);
