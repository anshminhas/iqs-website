import mongoose, { Schema, Document } from 'mongoose';

export interface IPayrollRun extends Document {
  clientId: mongoose.Types.ObjectId;
  month: string;          // "YYYY-MM"
  status: 'draft' | 'processed' | 'regenerated';
  uploadedBy: mongoose.Types.ObjectId;
  rawFileName: string;
  totalEmployees: number;
  totalGross: number;
  totalNetPay: number;
  totalDeductions: number;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollRunSchema: Schema = new Schema({
  clientId:         { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  month:            { type: String, required: true },       // YYYY-MM
  status:           { type: String, enum: ['draft', 'processed', 'regenerated'], default: 'draft' },
  uploadedBy:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rawFileName:      { type: String, required: true },
  totalEmployees:   { type: Number, default: 0 },
  totalGross:       { type: Number, default: 0 },
  totalNetPay:      { type: Number, default: 0 },
  totalDeductions:  { type: Number, default: 0 },
  processedAt:      { type: Date },
}, { timestamps: true });

// Unique per client + month
PayrollRunSchema.index({ clientId: 1, month: 1 });

export default mongoose.models.PayrollRun ||
  mongoose.model<IPayrollRun>('PayrollRun', PayrollRunSchema);
