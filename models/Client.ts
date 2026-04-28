import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  companyName: string;
  contactEmail: string;
  logoUrl?: string;
  address?: string;
  assignedCategoryIds?: mongoose.Types.ObjectId[];
  assignedAdminIds?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ClientSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  logoUrl: { type: String, required: false },
  address: { type: String, required: false },
  assignedCategoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  assignedAdminIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
