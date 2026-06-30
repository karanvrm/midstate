// ─── Shared types for the Tasks / Candidate-pipeline feature ─────────────────

export type CandidateStatus =
  | 'pending'
  | 'interested'
  | 'not_reachable'
  | 'busy'
  | 'not_interested'
  | 'disconnecting'
  | 'poor_comms'
  | 'selected';

export interface Batch {
  id: string;
  title: string;
  jobTitle?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'active' | 'closed';
  assignedTo: string[];
}

export interface Candidate {
  id: string;
  batchId: string;
  assignedTo: string;
  name: string;
  email: string;
  phone: string;
  currentLocation: string;
  preferredLocations: string;
  experience: string;
  qualification: string;
  status: CandidateStatus;
  remarks: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface ParsedXlsx {
  rows: Record<string, string>[];
  columns: string[];
}

export interface CreateBatchPayload {
  title: string;
  candidates: {
    assignedTo: string;
    data: Record<string, string>;
  }[];
}
