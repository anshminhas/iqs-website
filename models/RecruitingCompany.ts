import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruitingCompany extends Document {
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecruitingCompanySchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  industry: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.RecruitingCompany ||
  mongoose.model<IRecruitingCompany>('RecruitingCompany', RecruitingCompanySchema);
