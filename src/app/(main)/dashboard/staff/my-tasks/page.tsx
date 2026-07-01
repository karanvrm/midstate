'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getAssignedCandidates, updateCandidateStatus } from '@/lib/db';
import type { Candidate, CandidateStatus } from '@/types/tasks';

// ─── Status config ────────────────────────────────────────

const STATUS_CONFIG: Record<CandidateStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-white', bg: 'bg-white-500/20 border-white-500/30' },
    interested: { label: 'Interested', color: 'text-green-300', bg: 'bg-green-500/20 border-green-500/30' },
    not_reachable: { label: 'Not Reachable', color: 'text-gray-400', bg: 'bg-gray-600/20 border-gray-600/30' },
    busy: { label: 'Busy', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/30' },
    not_interested: { label: 'Not Interested', color: 'text-red-300', bg: 'bg-red-500/20 border-red-500/30' },
    disconnecting: { label: 'Disconnecting', color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-500/30' },
    poor_comms: { label: 'Poor Comms', color: 'text-purple-300', bg: 'bg-purple-500/20 border-purple-500/30' },
    selected: { label: 'Selected', color: 'text-blue-300', bg: 'bg-blue-500/20 border-blue-500/30' },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG) as CandidateStatus[];

function StatusBadge({ status }: { status: CandidateStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color} ${cfg.bg}`}>
            {cfg.label}
        </span>
    );
}

// ─── Update modal ─────────────────────────────────────────

function UpdateModal({
    candidate,
    onSave,
    onClose,
    readOnly = false,
}: {
    candidate: Candidate;
    onSave: (
        id: string,
        status: CandidateStatus,
        remark: string,
        placement?: { selectedCompany: string; selectedPosition: string }
    ) => Promise<void>;
    onClose: () => void;
    readOnly?: boolean;
}) {
    const [status, setStatus] = useState<CandidateStatus>(candidate.status);
    const [remark, setRemark] = useState(candidate.remarks ?? '');
    const [selectedCompany, setSelectedCompany] = useState(candidate.selectedCompany ?? '');
    const [selectedPosition, setSelectedPosition] = useState(candidate.selectedPosition ?? '');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const isPlaced = candidate.status === 'selected';
    const showPlacementFields = status === 'selected' || isPlaced;
    const lockPlacementFields = readOnly || isPlaced;
    const lockStatus = readOnly || isPlaced;
    const missingPlacementDetails =
        !isPlaced &&
        status === 'selected' &&
        (!selectedCompany.trim() || !selectedPosition.trim());

    async function handleSave() {
        setError(null);
        const company = selectedCompany.trim();
        const position = selectedPosition.trim();

        if (!isPlaced && status === 'selected' && (!company || !position)) {
            setError('Company Name and Position/Post are required.');
            return;
        }

        setSaving(true);
        try {
            await onSave(
                candidate.id,
                status,
                remark,
                !isPlaced && status === 'selected'
                    ? { selectedCompany: company, selectedPosition: position }
                    : undefined
            );
        } catch (err: any) {
            setError(err.message ?? 'Unable to update candidate.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
                <h3 className="font-heading text-lg font-medium">{candidate.name}</h3>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">
                    {candidate.phone}{candidate.currentLocation ? ` · ${candidate.currentLocation}` : ''}
                </p>

                {isPlaced ? (
                    <div className="mb-5 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
                        This candidate has already been placed. Selected status cannot be modified.
                    </div>
                ) : null}

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={status}
                            disabled={lockStatus}
                            onChange={(e) => setStatus(e.target.value as CandidateStatus)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}
                                    style={{
                                        backgroundColor: "#171717",
                                        color: "#ffffff",
                                    }}
                                >
                                    {STATUS_CONFIG[s].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {showPlacementFields ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Company Name</label>
                                <input
                                    value={selectedCompany}
                                    disabled={lockPlacementFields}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    placeholder="Company name"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Position / Post</label>
                                <input
                                    value={selectedPosition}
                                    disabled={lockPlacementFields}
                                    onChange={(e) => setSelectedPosition(e.target.value)}
                                    placeholder="Position / post"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Remark</label>
                        <textarea
                            value={remark}
                            disabled={readOnly}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={3}
                            placeholder={readOnly ? "No remarks" : "e.g. Called, interested – will attend interview Friday"}
                            className="w-full resize-vertical rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    {error ? (
                        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                            {error}
                        </p>
                    ) : null}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    {readOnly ? (
                        <button
                            onClick={onClose}
                            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
                        >
                            Close
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                disabled={saving}
                                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || missingPlacementDetails}
                                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────

export default function MyTasksPage() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER';

    const searchParams = useSearchParams();
    const taskId = searchParams.get('taskId') ?? undefined;

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [taskName, setTaskName] = useState<string | null>(null);
    const [active, setActive] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<CandidateStatus | 'all'>('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                if (taskId) {
                    const taskRes = await fetch(`/api/tasks/${taskId}`);
                    if (taskRes.ok) {
                        const taskData = await taskRes.json();
                        if (taskData.task) {
                            setTaskName(taskData.task.name);
                        }
                    }
                }
                const data = await getAssignedCandidates(taskId);
                setCandidates(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [taskId]);

    async function handleSave(
        id: string,
        status: CandidateStatus,
        remarks: string,
        placement?: { selectedCompany: string; selectedPosition: string }
    ) {
        const updated = await updateCandidateStatus(id, { status, remarks, ...placement });
        setCandidates((prev) =>
            prev.map((c) => (c.id === id ? updated : c))
        );
        setActive(null);
    }

    const filtered = filter === 'all' ? candidates : candidates.filter((c) => c.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
                <div className="relative space-y-2">
                    <h1 className="font-heading text-3xl font-medium tracking-tight">
                        {taskName ? `Candidates for ${taskName}` : "My Candidates"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} {taskId ? "in this task" : "assigned to you"}
                    </p>
                </div>
            </div>

            {candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center">
                    <p className="text-muted-foreground">No candidates assigned to you yet.</p>
                </div>
            ) : (
                <>
                    {/* Filter bar */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === 'all'
                                ? 'border-violet-400/50 bg-violet-500/20 text-violet-200'
                                : 'border-white/10 text-muted-foreground hover:bg-white/5'
                                }`}
                        >
                            All ({candidates.length})
                        </button>
                        {STATUS_OPTIONS.map((s) => {
                            const count = candidates.filter((c) => c.status === s).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === s
                                        ? 'border-violet-400/50 bg-violet-500/20 text-violet-200'
                                        : 'border-white/10 text-muted-foreground hover:bg-white/5'
                                        }`}
                                >
                                    {STATUS_CONFIG[s].label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03]">
                                    {['Name', 'Phone', 'Location', 'Experience', 'Status', 'Last Remark', ''].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/[0.02]">
                                        <td className="px-4 py-3 font-medium">{c.name || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{c.phone || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{c.currentLocation || '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{c.experience || '—'}</td>
                                        <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                                        <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                                            {c.remarks || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setActive(c)}
                                                className="rounded-md border border-white/10 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                                            >
                                                {isAdmin ? 'View' : 'Update'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {active && (
                <UpdateModal
                    candidate={active}
                    onSave={handleSave}
                    onClose={() => setActive(null)}
                    readOnly={isAdmin}
                />
            )}
        </div>
    );
}
