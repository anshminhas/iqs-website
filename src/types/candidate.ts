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
