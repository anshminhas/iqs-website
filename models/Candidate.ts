import mongoose, { Schema, Document } from 'mongoose';

export type CandidateStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview Scheduled'
  | 'Shortlisted'
  | 'Selected'
  | 'Rejected'
  | 'Onboarded';

export const CANDIDATE_STATUSES: CandidateStatus[] = [
  'Applied',
  'Screening',
  'Interview Scheduled',
  'Shortlisted',
  'Selected',
  'Rejected',
  'Onboarded',
];

export interface ICandidate extends Document {
  name: string;
  phno: string;
  email: string;
  role: string;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  status: CandidateStatus;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  phno: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'RecruitingCompany', required: true, index: true },
  companyName: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: CANDIDATE_STATUSES,
    default: 'Applied',
    index: true,
  },
  notes: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Candidate ||
  mongoose.model<ICandidate>('Candidate', CandidateSchema);
