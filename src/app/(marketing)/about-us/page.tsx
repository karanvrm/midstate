"use client";

import { MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import { cn } from "@/utils";
import { motion } from "framer-motion";
import {
    ArrowRightIcon,
    BriefcaseIcon,
    CheckCircle2Icon,
    GlobeIcon,
    HeartHandshakeIcon,
    SearchCheckIcon,
    ShieldCheckIcon,
    TrendingUpIcon,
    Users2Icon,
    ZapIcon,
    MessageSquareIcon,
    AwardIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

// ─── Animation Helper ────────────────────────────────────────────────────────

const FadeUp = ({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

const TiltCard = ({
    children,
    className,
    glowColor = "rgba(124,58,237,0.22)",
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--cx", `${x}px`);
        el.style.setProperty("--cy", `${y}px`);
        el.style.setProperty("--rx", `${((y / r.height) - 0.5) * -7}deg`);
        el.style.setProperty("--ry", `${((x / r.width) - 0.5) * 7}deg`);
        el.style.setProperty("--lift", "-6px");
    };

    const onLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--lift", "0px");
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 ease-out will-change-transform hover:border-white/20 hover:bg-white/[0.07]",
                className
            )}
            style={{
                transform:
                    "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translate3d(0,var(--lift,0px),0)",
                transformStyle: "preserve-3d",
            }}
        >
            {/* inner glow on hover */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[inherit]"
                style={{
                    background: `radial-gradient(380px circle at var(--cx,50%) var(--cy,50%), ${glowColor}, transparent 52%)`,
                }}
            />
            {/* edge highlight */}
            <div className="pointer-events-none absolute inset-px rounded-[inherit] border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
            {/* shimmer sweep */}
            <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
            <div className="relative h-full" style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </div>
    );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
    {
        title: "People First",
        description:
            "We prioritize relationships, understanding the needs of both clients and candidates.",
        icon: Users2Icon,
        accent: "from-violet-500/20 to-purple-600/10",
        iconColor: "text-violet-300",
        glow: "rgba(124,58,237,0.25)",
    },
    {
        title: "Integrity & Transparency",
        description:
            "Clear communication and honest partnerships are at the heart of everything we do.",
        icon: ShieldCheckIcon,
        accent: "from-sky-500/20 to-blue-600/10",
        iconColor: "text-sky-300",
        glow: "rgba(14,165,233,0.25)",
    },
    {
        title: "Quality Over Quantity",
        description:
            "We focus on finding the right fit, not simply filling positions.",
        icon: CheckCircle2Icon,
        accent: "from-emerald-500/20 to-green-600/10",
        iconColor: "text-emerald-300",
        glow: "rgba(16,185,129,0.25)",
    },
    {
        title: "Continuous Improvement",
        description:
            "We adapt, learn, and improve to meet evolving industry demands.",
        icon: TrendingUpIcon,
        accent: "from-orange-500/20 to-amber-600/10",
        iconColor: "text-orange-300",
        glow: "rgba(249,115,22,0.25)",
    },
];

const WHY_CHOOSE = [
    {
        title: "Personalized Recruitment",
        description:
            "Every organization has unique hiring needs. We tailor our approach to match your goals.",
        icon: SearchCheckIcon,
        glow: "rgba(124,58,237,0.2)",
    },
    {
        title: "Industry Understanding",
        description:
            "We work to understand your business, culture, and workforce requirements.",
        icon: BriefcaseIcon,
        glow: "rgba(14,165,233,0.2)",
    },
    {
        title: "Responsive Support",
        description:
            "Our team remains available throughout the recruitment journey.",
        icon: ZapIcon,
        glow: "rgba(16,185,129,0.2)",
    },
    {
        title: "Long-Term Partnerships",
        description:
            "We focus on building lasting relationships, not one-time transactions.",
        icon: HeartHandshakeIcon,
        glow: "rgba(249,115,22,0.2)",
    },
    {
        title: "Candidate Quality",
        description:
            "We prioritize suitable, motivated, and qualified professionals.",
        icon: CheckCircle2Icon,
        glow: "rgba(236,72,153,0.2)",
    },
    {
        title: "Professional Process",
        description:
            "Structured screening and communication help ensure a smooth hiring experience.",
        icon: ShieldCheckIcon,
        glow: "rgba(99,102,241,0.2)",
    },
];

const TRUST_OUTER = [
    {
        position: "top-left",
        title: "Professional & Reliable",
        description:
            "Committed to delivering dependable recruitment solutions and consistent client support.",
        accent: "rgba(249,115,22,0.3)",
        icon: ShieldCheckIcon,
    },
    {
        position: "top-right",
        title: "Talent-Focused Approach",
        description:
            "We carefully match opportunities with professionals based on skills and goals.",
        accent: "rgba(249,115,22,0.3)",
        icon: UserIcon,
    },
    {
        position: "mid-left",
        title: "Transparent Communication",
        description:
            "Clear updates and honest conversations throughout the hiring process.",
        accent: "rgba(249,115,22,0.3)",
        icon: MessageSquareIcon,
    },
    {
        position: "mid-right",
        title: "Client-Centric Service",
        description:
            "Every hiring strategy is tailored to the unique needs of each business.",
        accent: "rgba(249,115,22,0.3)",
        icon: BriefcaseIcon,
    },
    {
        position: "bot-left",
        title: "Quality-Driven Process",
        description:
            "We emphasize candidate quality and cultural fit over volume.",
        accent: "rgba(249,115,22,0.3)",
        icon: AwardIcon,
    },
    {
        position: "bot-right",
        title: "Long-Term Partnerships",
        description:
            "Our goal is to build relationships that create lasting value for clients and candidates.",
        accent: "rgba(249,115,22,0.3)",
        icon: HeartHandshakeIcon,
    },
];

// ─── Floating Hero Visual ─────────────────────────────────────────────────────

const HERO_CARDS = [
    {
        id: "talent-pool",
        label: "Talent Pool",
        desc: "Connecting skilled professionals with the right opportunities across every industry and level.",
        icon: Users2Icon,
        iconColor: "text-violet-300",
        ringColor: "bg-violet-500/20",
        borderColor: "border-violet-500/25",
        glowColor: "rgba(124,58,237,0.35)",
        accentColor: "from-violet-500/40 to-purple-600/20",
        animDelay: 0,
        floatDy: -8,
        floatDur: 4.5,
    },
    {
        id: "business-growth",
        label: "Business Growth",
        desc: "Tailored hiring solutions built for organizations at every stage of their growth journey.",
        icon: BriefcaseIcon,
        iconColor: "text-sky-300",
        ringColor: "bg-sky-500/20",
        borderColor: "border-sky-500/25",
        glowColor: "rgba(14,165,233,0.35)",
        accentColor: "from-sky-500/40 to-blue-600/20",
        animDelay: 0.6,
        floatDy: -7,
        floatDur: 3.8,
    },
    {
        id: "hiring-partnership",
        label: "Hiring Partnership",
        desc: "Long-term recruitment relationships built on transparency, trust, and consistent results.",
        icon: HeartHandshakeIcon,
        iconColor: "text-emerald-300",
        ringColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500/25",
        glowColor: "rgba(16,185,129,0.35)",
        accentColor: "from-emerald-500/40 to-green-600/20",
        animDelay: 0.3,
        floatDy: -10,
        floatDur: 5,
    },
    {
        id: "global-workforce",
        label: "Global Workforce",
        desc: "Bridging exceptional talent across industries, geographies, and emerging market sectors.",
        icon: GlobeIcon,
        iconColor: "text-orange-300",
        ringColor: "bg-orange-500/20",
        borderColor: "border-orange-500/25",
        glowColor: "rgba(249,115,22,0.35)",
        accentColor: "from-orange-500/40 to-amber-600/20",
        animDelay: 0.9,
        floatDy: -8,
        floatDur: 4.2,
    },
];

const HeroVisual = () => (
    <div className="relative w-full select-none">
        {/* Ambient glow behind grid */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),transparent_70%)]" />

        {/* 2×2 grid of large cards */}
        <div className="grid grid-cols-2 gap-4">
            {HERO_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.id}
                        className={cn(
                            "relative overflow-hidden rounded-2xl border bg-white/[0.04] backdrop-blur-xl",
                            "shadow-[0_16px_48px_rgba(0,0,0,0.45)]",
                            card.borderColor,
                        )}
                        animate={{ y: [0, card.floatDy, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: card.floatDur,
                            ease: "easeInOut",
                            delay: card.animDelay,
                        }}
                    >
                        {/* Top accent stripe */}
                        <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r", card.accentColor)} />

                        {/* Radial glow */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-25"
                            style={{ background: `radial-gradient(circle at 20% 20%, ${card.glowColor}, transparent 65%)` }}
                        />

                        {/* Inner edge highlight */}
                        <div className="pointer-events-none absolute inset-px rounded-[calc(1rem-1px)] border border-white/[0.06]" />

                        {/* Card content */}
                        <div className="relative flex flex-col gap-3 p-5">
                            {/* Icon badge */}
                            <div className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10",
                                card.ringColor,
                                "shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
                            )}>
                                <Icon className={cn("size-5", card.iconColor)} strokeWidth={1.7} />
                            </div>

                            {/* Text */}
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-semibold text-white leading-snug">
                                    {card.label}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
);

// ─── About Visual Stack ───────────────────────────────────────────────────────

const AboutVisualStack = () => (
    <div className="relative w-full select-none">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.15),transparent_65%)]" />

        <div className="relative flex flex-col items-center gap-4">

            {/* ── Row 1 — Workforce Solutions (wide, centered) ── */}
            <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.45)]"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-violet-500/25 flex items-center justify-center">
                        <Users2Icon className="size-4 text-violet-300" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">Workforce Solutions</div>
                        <div className="text-[10px] text-muted-foreground">Tailored for every industry</div>
                    </div>
                </div>
                <div className="h-px bg-white/8 mb-3" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    From IT talent to business operations — we provide end-to-end recruitment support across sectors.
                </p>
            </motion.div>

            {/* ── Row 2 — Trust-First & Growth Focused (side-by-side) ── */}
            <div className="flex w-full max-w-sm gap-4">
                <motion.div
                    className="flex-1 rounded-2xl border border-white/12 bg-white/[0.05] p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.6 }}
                >
                    <ShieldCheckIcon className="size-6 text-sky-300 mb-2" />
                    <div className="text-sm font-semibold text-white">Trust-First</div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        Transparent partnerships built on honest communication.
                    </p>
                </motion.div>

                <motion.div
                    className="flex-1 rounded-2xl border border-white/12 bg-white/[0.05] p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut", delay: 1 }}
                >
                    <TrendingUpIcon className="size-6 text-emerald-300 mb-2" />
                    <div className="text-sm font-semibold text-white">Growth Focused</div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        Helping businesses build stronger, lasting teams.
                    </p>
                </motion.div>
            </div>

            {/* ── Row 3 — Recruitment Pipeline (wide, centered) ── */}
            <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/12 bg-white/[0.05] p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">Recruitment Pipeline</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="space-y-1.5">
                    {["Sourcing", "Screening", "Placement"].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                            <div className={cn("h-1.5 rounded-full flex-1 bg-white/10 overflow-hidden")}>
                                <motion.div
                                    className={cn("h-full rounded-full", i === 0 ? "bg-violet-400" : i === 1 ? "bg-sky-400" : "bg-emerald-400")}
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: i === 0 ? "85%" : i === 1 ? "60%" : "40%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-[10px] text-muted-foreground w-14 shrink-0">{step}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    </div>
);

// ─── Trust Diagram (Section 5) ────────────────────────────────────────────────

const TrustDiagram = () => {
    const cards = TRUST_OUTER;

    return (
        <div className="relative w-full">
            {/* Desktop layout */}
            <div className="hidden lg:block relative w-[900px] h-[520px] mx-auto">
                {/* SVG connector lines */}
                <svg
                    className="pointer-events-none absolute inset-0 w-full h-full"
                    viewBox="0 0 900 520"
                >
                    {/* Left top line: from (260, 70) to (340, 190) */}
                    <path
                        d="M 260 70 H 300 A 20 20 0 0 1 320 90 V 170 A 20 20 0 0 0 340 190"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 260 70 H 300 A 20 20 0 0 1 320 90 V 170 A 20 20 0 0 0 340 190"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Left mid line: from (260, 260) to (340, 260) */}
                    <path
                        d="M 260 260 H 340"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 260 260 H 340"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Left bot line: from (260, 450) to (340, 330) */}
                    <path
                        d="M 260 450 H 300 A 20 20 0 0 0 320 430 V 350 A 20 20 0 0 1 340 330"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 260 450 H 300 A 20 20 0 0 0 320 430 V 350 A 20 20 0 0 1 340 330"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Right top line: from (640, 70) to (560, 190) */}
                    <path
                        d="M 640 70 H 600 A 20 20 0 0 0 580 90 V 170 A 20 20 0 0 1 560 190"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 640 70 H 600 A 20 20 0 0 0 580 90 V 170 A 20 20 0 0 1 560 190"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Right mid line: from (640, 260) to (560, 260) */}
                    <path
                        d="M 640 260 H 560"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 640 260 H 560"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Right bot line: from (640, 450) to (560, 330) */}
                    <path
                        d="M 640 450 H 600 A 20 20 0 0 1 580 430 V 350 A 20 20 0 0 0 560 330"
                        fill="none"
                        stroke="rgba(249,115,22,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 640 450 H 600 A 20 20 0 0 1 580 430 V 350 A 20 20 0 0 0 560 330"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Connection dots (Outer Cards) */}
                    <circle cx="260" cy="70" r="3" fill="#f97316" />
                    <circle cx="260" cy="70" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />
                    <circle cx="260" cy="260" r="3" fill="#f97316" />
                    <circle cx="260" cy="260" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />
                    <circle cx="260" cy="450" r="3" fill="#f97316" />
                    <circle cx="260" cy="450" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />

                    <circle cx="640" cy="70" r="3" fill="#f97316" />
                    <circle cx="640" cy="70" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />
                    <circle cx="640" cy="260" r="3" fill="#f97316" />
                    <circle cx="640" cy="260" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />
                    <circle cx="640" cy="450" r="3" fill="#f97316" />
                    <circle cx="640" cy="450" r="6" fill="#f97316" opacity="0.4" className="animate-pulse" />

                    {/* Entry dots (Center Card) */}
                    <circle cx="340" cy="190" r="3.5" fill="#f97316" />
                    <circle cx="340" cy="190" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />
                    <circle cx="340" cy="260" r="3.5" fill="#f97316" />
                    <circle cx="340" cy="260" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />
                    <circle cx="340" cy="330" r="3.5" fill="#f97316" />
                    <circle cx="340" cy="330" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />

                    <circle cx="560" cy="190" r="3.5" fill="#f97316" />
                    <circle cx="560" cy="190" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />
                    <circle cx="560" cy="260" r="3.5" fill="#f97316" />
                    <circle cx="560" cy="260" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />
                    <circle cx="560" cy="330" r="3.5" fill="#f97316" />
                    <circle cx="560" cy="330" r="7" fill="#f97316" opacity="0.45" className="animate-pulse" />
                </svg>

                {/* Center card */}
                <motion.div
                    className="absolute rounded-3xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-neutral-900/80 to-red-600/10 backdrop-blur-xl shadow-[0_0_80px_rgba(249,115,22,0.35)] flex items-center justify-center z-10"
                    style={{ left: 340, top: 150, width: 220, height: 220 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] border border-white/10" />
                    <div className="text-center px-4">
                        <div className="text-2xl font-bold text-white mb-1">Why Trust</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Midstate</div>
                        <div className="mt-3 h-0.5 w-12 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 rounded-3xl border border-orange-500/30"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Outer cards */}
                {[
                    { style: { left: 0, top: 10, width: 260, height: 120 }, card: cards[0] },
                    { style: { left: 640, top: 10, width: 260, height: 120 }, card: cards[1] },
                    { style: { left: 0, top: 200, width: 260, height: 120 }, card: cards[2] },
                    { style: { left: 640, top: 200, width: 260, height: 120 }, card: cards[3] },
                    { style: { left: 0, top: 390, width: 260, height: 120 }, card: cards[4] },
                    { style: { left: 640, top: 390, width: 260, height: 120 }, card: cards[5] },
                ].map(({ style, card }, i) => (
                    <motion.div
                        key={card.title}
                        className="absolute"
                        style={style}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <TiltCard
                            className="h-full p-4 flex items-center justify-between"
                            glowColor={card.accent}
                        >
                            <div
                                className="absolute inset-0 rounded-[inherit] opacity-30"
                                style={{ background: `radial-gradient(circle at top left, ${card.accent}, transparent 70%)` }}
                            />
                            <div className="relative flex items-center gap-4 h-full w-full">
                                <div className="h-11 w-11 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
                                    <card.icon className="size-5 text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white leading-tight">{card.title}</div>
                                    <p className="mt-1 text-[11px] text-muted-foreground leading-normal">{card.description}</p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>

            {/* Mobile / tablet layout */}
            <div className="lg:hidden">
                <div className="mb-8 rounded-3xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-neutral-900/80 to-red-600/10 backdrop-blur-xl shadow-[0_0_60px_rgba(249,115,22,0.25)] p-8 text-center mx-auto max-w-xs">
                    <div className="text-2xl font-bold text-white mb-1">Why Trust</div>
                    <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Midstate</div>
                    <div className="mt-3 h-0.5 w-12 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {cards.map((card, i) => (
                        <FadeUp key={card.title} delay={0.08 * i}>
                            <TiltCard className="p-4" glowColor={card.accent}>
                                <div
                                    className="absolute inset-0 rounded-[inherit] opacity-20"
                                    style={{ background: `radial-gradient(circle at top left, ${card.accent}, transparent 70%)` }}
                                />
                                <div className="relative flex items-center gap-4 h-full w-full">
                                    <div className="h-11 w-11 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
                                        <card.icon className="size-5 text-orange-400" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-sm font-semibold text-white leading-tight">{card.title}</div>
                                        <p className="mt-1 text-xs text-muted-foreground leading-normal">{card.description}</p>
                                    </div>
                                </div>
                            </TiltCard>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutUsIndexPage = () => {
    return (
        <div className="relative overflow-x-hidden">

            {/* ════════════════════════════════════════
                SECTION 1 — HERO
            ════════════════════════════════════════ */}
            <div className="relative overflow-hidden">
                {/* Background effects */}
                <div className="pointer-events-none absolute -top-32 left-1/4 h-[36rem] w-[36rem] rounded-full bg-violet-600/14 blur-3xl" />
                <div className="pointer-events-none absolute -top-20 right-1/4 h-[28rem] w-[28rem] rounded-full bg-blue-600/12 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[24rem] w-[30rem] rounded-full bg-indigo-600/10 blur-3xl" />

                <MaxWidthWrapper className="pt-12 md:pt-20 pb-16 md:pb-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
                        {/* Left — copy */}
                        <FadeUp>
                            <MagicBadge title="About Midstate" />
                            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Connecting{" "}
                                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
                                    Global Talent
                                </span>{" "}
                                With Growing Businesses.
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                                We help companies find skilled professionals and help talented individuals discover meaningful opportunities. Our mission is simple: make hiring faster, smarter, and more human.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    size="lg"
                                    className="group shadow-[0_0_45px_rgba(168,85,247,0.3)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(168,85,247,0.5)]"
                                >
                                    <Link href="/jobs">
                                        Explore Opportunities
                                        <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="border-white/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-sky-300/35 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(56,189,248,0.18)]"
                                >
                                    <Link href="/contact-us">Contact Us</Link>
                                </Button>
                            </div>
                        </FadeUp>

                        {/* Right — animated visual */}
                        <FadeUp delay={0.15}>
                            <HeroVisual />
                        </FadeUp>
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ════════════════════════════════════════
                SECTION 2 — ABOUT MIDSTATE GLOBAL SERVICES
            ════════════════════════════════════════ */}
            <div className="relative overflow-hidden py-20 md:py-28">
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[38rem] w-[52rem] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-32 top-8 h-[26rem] w-[26rem] rounded-full bg-violet-500/12 blur-3xl" />

                <MaxWidthWrapper>
                    <FadeUp>
                        <div className="mb-4 text-center">
                            <MagicBadge title="Who We Are" />
                        </div>
                        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
                            About Midstate Global Services
                        </h2>
                        <p className="mx-auto max-w-xl text-center text-muted-foreground md:text-lg mb-16">
                            A recruitment and workforce solutions company built on trust, professionalism, and purpose.
                        </p>
                    </FadeUp>

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left — text */}
                        <FadeUp delay={0.1}>
                            <div className="space-y-6">
                                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                                    Midstate Global Services is a recruitment and workforce solutions company dedicated to helping organizations build stronger teams while empowering professionals to advance their careers.
                                </p>
                                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                                    We work closely with businesses across various industries to understand their workforce requirements and connect them with qualified talent. At the same time, we support candidates by helping them discover opportunities aligned with their skills, experience, and career goals.
                                </p>
                                <p className="text-base md:text-lg leading-8 text-muted-foreground">
                                    Our commitment is built on professionalism, transparency, and delivering value through every hiring partnership.
                                </p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {["Professionalism", "Transparency", "Value-Driven"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>

                        {/* Right — visual stack */}
                        <FadeUp delay={0.18}>
                            <AboutVisualStack />
                        </FadeUp>
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ════════════════════════════════════════
                SECTION 3 — OUR PRINCIPLES
            ════════════════════════════════════════ */}
            <div className="relative overflow-hidden py-20 md:py-28">
                <div className="pointer-events-none absolute -left-36 bottom-0 h-[30rem] w-[38rem] rounded-full bg-violet-600/12 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 top-12 h-[26rem] w-[32rem] rounded-full bg-sky-500/10 blur-3xl" />

                <MaxWidthWrapper>
                    <FadeUp>
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <MagicBadge title="Our Principles" />
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                                The Values That Guide{" "}
                                <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
                                    Every Partnership
                                </span>
                            </h2>
                        </div>
                    </FadeUp>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {PRINCIPLES.map((p, i) => (
                            <FadeUp key={p.title} delay={0.1 * (i + 1)}>
                                <TiltCard className="h-full p-6" glowColor={p.glow}>
                                    {/* Top gradient accent */}
                                    <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", p.accent.replace("from-", "from-").replace("to-", "to-"))} style={{ background: `linear-gradient(90deg, transparent, ${p.glow.replace("0.25", "0.6")}, transparent)` }} />
                                    <div className="relative flex flex-col h-full">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-5"
                                            style={{ boxShadow: `0 0 24px ${p.glow}` }}
                                        >
                                            <p.icon className={cn("size-6", p.iconColor)} strokeWidth={1.7} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">{p.title}</h3>
                                        <p className="text-sm leading-6 text-muted-foreground">{p.description}</p>
                                    </div>
                                </TiltCard>
                            </FadeUp>
                        ))}
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ════════════════════════════════════════
                SECTION 4 — WHY BUSINESSES CHOOSE MIDSTATE
            ════════════════════════════════════════ */}
            <div className="relative overflow-hidden py-20 md:py-28">
                <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 h-[34rem] w-[50rem] rounded-full bg-blue-500/10 blur-3xl" />

                <MaxWidthWrapper>
                    <FadeUp>
                        <div className="mx-auto max-w-3xl text-center mb-16">
                            <MagicBadge title="Why Choose Us" />
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                                Recruitment Built Around{" "}
                                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                    Your Goals
                                </span>
                            </h2>
                            <p className="mt-5 text-base text-muted-foreground md:text-lg">
                                We focus on understanding each organization&apos;s unique hiring needs and delivering recruitment solutions designed for long-term success.
                            </p>
                        </div>
                    </FadeUp>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {WHY_CHOOSE.map((item, i) => (
                            <FadeUp key={item.title} delay={0.08 * (i + 1)}>
                                <TiltCard className="h-full p-6" glowColor={item.glow}>
                                    <div className="relative flex flex-col h-full">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 mb-4"
                                            style={{ boxShadow: `0 0 20px ${item.glow}` }}
                                        >
                                            <item.icon className="size-5 text-white/80" strokeWidth={1.7} />
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                                        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                                    </div>
                                </TiltCard>
                            </FadeUp>
                        ))}
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ════════════════════════════════════════
                SECTION 5 — WHY TRUST MIDSTATE
            ════════════════════════════════════════ */}
            <div className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-transparent via-orange-950/[0.06] to-transparent">
                <div className="pointer-events-none absolute -left-24 top-1/3 h-[32rem] w-[32rem] rounded-full bg-orange-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-red-600/10 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

                <MaxWidthWrapper>
                    <FadeUp>
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <MagicBadge title="Trust & Reliability" />
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                                Why{" "}
                                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    Trust
                                </span>{" "}
                                Midstate
                            </h2>
                            <p className="mt-5 text-base text-muted-foreground md:text-lg">
                                A commitment to excellence at every stage of the hiring journey.
                            </p>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <TrustDiagram />
                    </FadeUp>
                </MaxWidthWrapper>
            </div>

        </div>
    );
};

export default AboutUsIndexPage;
