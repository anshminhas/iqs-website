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

export interface CandidateItem {
  _id: string;
  name: string;
  phno: string;
  email: string;
  role: string;
  companyId: string;
  companyName: string;
  status: CandidateStatus;
  joiningDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
