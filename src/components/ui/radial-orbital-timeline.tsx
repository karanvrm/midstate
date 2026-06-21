"use client";
import { useState, useEffect, useRef } from "react";

interface PhaseItem {
    id: number;
    phase: string;
    title: string;
    description: string;
    accent: string;
    dot: string;
    glow: string;
}

interface RadialOrbitalTimelineProps {
    phases: PhaseItem[];
}

export default function RadialOrbitalTimeline({ phases }: RadialOrbitalTimelineProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [autoRotate, setAutoRotate] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-rotation
    useEffect(() => {
        if (!autoRotate) return;
        const timer = setInterval(() => {
            setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
        }, 50);
        return () => clearInterval(timer);
    }, [autoRotate]);

    const toggleNode = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setAutoRotate(true);
        } else {
            setExpandedId(id);
            setAutoRotate(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current) {
            setExpandedId(null);
            setAutoRotate(true);
        }
    };

    const calculatePosition = (index: number, total: number) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 170;
        const radian = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);
        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(radian)) / 2)));
        return { x, y, zIndex, opacity };
    };

    // Dot colour map keyed by phase index
    const glowColors = [
        "rgba(139,92,246,0.7)",   // violet – Phase 1
        "rgba(217,70,239,0.7)",   // fuchsia – Phase 2
        "rgba(14,165,233,0.7)",   // sky – Phase 3
        "rgba(16,185,129,0.7)",   // emerald – Phase 4
    ];

    const borderColors = [
        "border-violet-500/70",
        "border-fuchsia-500/70",
        "border-sky-500/70",
        "border-emerald-500/70",
    ];

    const textColors = [
        "text-violet-400",
        "text-fuchsia-400",
        "text-sky-400",
        "text-emerald-400",
    ];

    const cardGradients = [
        "from-violet-500/20 via-violet-500/10 to-transparent",
        "from-fuchsia-500/20 via-fuchsia-500/10 to-transparent",
        "from-sky-500/20 via-sky-500/10 to-transparent",
        "from-emerald-500/20 via-emerald-500/10 to-transparent",
    ];

    return (
        <>
            {/* ── Desktop / Tablet ── */}
            <div
                ref={containerRef}
                className="hidden md:flex w-full h-[520px] items-center justify-center relative overflow-visible"
                onClick={handleBackdropClick}
            >
                {/* Orbit ring */}
                <div className="absolute w-[340px] h-[340px] rounded-full border border-white/8 pointer-events-none" />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-white/4 pointer-events-none" />

                {/* Centre orb */}
                <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 flex items-center justify-center z-10 pointer-events-none">
                    <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-60" />
                    <div
                        className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-40"
                        style={{ animationDelay: "0.6s" }}
                    />
                    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
                </div>

                {/* Orbiting nodes */}
                {phases.map((phase, index) => {
                    const pos = calculatePosition(index, phases.length);
                    const isExpanded = expandedId === phase.id;

                    return (
                        <div
                            key={phase.id}
                            className="absolute transition-all duration-700 cursor-pointer"
                            style={{
                                transform: `translate(${pos.x}px, ${pos.y}px)`,
                                zIndex: isExpanded ? 300 : pos.zIndex,
                                opacity: isExpanded ? 1 : pos.opacity,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNode(phase.id);
                            }}
                        >
                            {/* Glow halo */}
                            <div
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    width: 56,
                                    height: 56,
                                    top: -8,
                                    left: -8,
                                    background: `radial-gradient(circle, ${glowColors[index]} 0%, transparent 70%)`,
                                    opacity: isExpanded ? 1 : 0.5,
                                    transition: "opacity 0.3s",
                                }}
                            />

                            {/* Node circle */}
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    border-2 ${borderColors[index]}
                                    transition-all duration-300
                                    ${isExpanded
                                        ? "bg-white/20 backdrop-blur-md scale-125 shadow-lg"
                                        : "bg-black/60 hover:bg-white/10"
                                    }
                                `}
                            >
                                <span className={`text-[10px] font-bold ${textColors[index]}`}>
                                    {index + 1}
                                </span>
                            </div>

                            {/* Label */}
                            <div
                                className={`
                                    absolute whitespace-nowrap text-[11px] font-semibold tracking-wider
                                    transition-all duration-300 pointer-events-none
                                    ${isExpanded ? "text-white scale-110" : "text-white/60"}
                                `}
                                style={{ top: "44px", left: "50%", transform: "translateX(-50%)" }}
                            >
                                {phase.phase}
                            </div>

                            {/* Popup card */}
                            {isExpanded && (
                                <div
                                    className="absolute z-50 w-72"
                                    style={{
                                        top: "60px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Connector line */}
                                    <div className="w-px h-3 bg-white/30 mx-auto" />

                                    <div
                                        className={`
                                            relative overflow-hidden rounded-xl border border-white/10
                                            bg-neutral-950/90 backdrop-blur-xl
                                            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                                            bg-gradient-to-br ${cardGradients[index]}
                                        `}
                                    >
                                        {/* Radial shine */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.07),transparent_60%)] pointer-events-none" />

                                        <div className="relative p-5">
                                            {/* Phase label */}
                                            <span
                                                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${textColors[index]}`}
                                            >
                                                {phase.phase}
                                            </span>

                                            {/* Title */}
                                            <h3 className="mt-1 text-base font-semibold text-white leading-tight">
                                                {phase.title}
                                            </h3>

                                            {/* Divider */}
                                            <div className="my-3 h-px bg-white/10" />

                                            {/* Description */}
                                            <p className="text-sm text-white/70 leading-relaxed">
                                                {phase.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Mobile: vertical stacked timeline ── */}
            <div className="flex md:hidden flex-col relative pl-6 mt-4">
                {/* Left edge line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                {phases.map((phase, index) => (
                    <div key={phase.id} className="relative mb-8">
                        {/* Dot */}
                        <div
                            className={`absolute -left-[22px] top-[23px] z-10 w-3.5 h-3.5 rounded-full ring-2 ring-background ${phases[index].dot}`}
                        />

                        {/* Card */}
                        <div
                            className={`
                                relative overflow-hidden rounded-xl border border-border/60
                                bg-neutral-950/80 shadow-xl ${phase.glow}
                                bg-gradient-to-br ${cardGradients[index]}
                                p-5
                            `}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
                            <div className="relative flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${textColors[index]}`}>
                                    {phase.phase}
                                </span>
                                <h3 className="text-base font-medium text-foreground leading-tight">
                                    {phase.title}
                                </h3>
                            </div>
                            <p className="relative text-sm text-muted-foreground leading-relaxed">
                                {phase.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
