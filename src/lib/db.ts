import type { Candidate, CandidateStatus, StaffMember } from '@/types/tasks';

// ─── Staff ────────────────────────────────────────────────────────────────────

export async function getAllStaff(): Promise<StaffMember[]> {
  const res = await fetch('/api/owner/staff-members');
  if (!res.ok) throw new Error('Failed to load staff members');
  const data = await res.json();
  return (data.staffMembers ?? []) as StaffMember[];
}

// ─── Batches ─────────────────────────────────────────────────────────────────

/**
 * Creates a new batch and saves all assigned candidates in a single request.
 * Returns the new batch ID.
 */
export async function createBatch(payload: {
  title: string;
  candidates: { assignedTo: string; data: Record<string, string> }[];
}): Promise<string> {
  const res = await fetch('/api/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'Failed to create batch');
  }

  const data = await res.json();
  return (data as { batchId: string }).batchId;
}

// ─── Candidates ───────────────────────────────────────────────────────────────

export async function getAssignedCandidates(taskId?: string): Promise<Candidate[]> {
  const url = taskId ? `/api/candidates?taskId=${encodeURIComponent(taskId)}` : '/api/candidates';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load candidates');
  const data = await res.json();
  return (data.candidates ?? []) as Candidate[];
}

export async function updateCandidateStatus(
  id: string,
  payload: {
    status: CandidateStatus;
    remarks: string;
    selectedCompany?: string;
    selectedPosition?: string;
  }
): Promise<Candidate> {
  const res = await fetch(`/api/candidates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'Failed to update candidate');
  }

  const data = await res.json();
  return data.candidate as Candidate;
}
