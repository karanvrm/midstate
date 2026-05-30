"use client";

import { cn } from "@/utils";
import React, { useRef } from "react";

interface PremiumAboutCardProps {
    children: React.ReactNode;
    className?: string;
    glowClassName?: string;
}

const PremiumAboutCard = ({ children, className, glowClassName }: PremiumAboutCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;

        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;

        card.style.setProperty("--about-card-x", `${x}px`);
        card.style.setProperty("--about-card-y", `${y}px`);
        card.style.setProperty("--about-card-rotate-x", `${rotateX}deg`);
        card.style.setProperty("--about-card-rotate-y", `${rotateY}deg`);
        card.style.setProperty("--about-card-lift", "-6px");
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;

        if (!card) return;

        card.style.setProperty("--about-card-rotate-x", "0deg");
        card.style.setProperty("--about-card-rotate-y", "0deg");
        card.style.setProperty("--about-card-lift", "0px");
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-[border-color,box-shadow,background-color,transform,filter] duration-500 ease-out will-change-transform hover:border-violet-300/35 hover:bg-white/[0.065] hover:shadow-[0_30px_110px_rgba(88,80,236,0.24)] hover:brightness-110",
                className
            )}
            style={{
                transform:
                    "perspective(1000px) rotateX(var(--about-card-rotate-x, 0deg)) rotateY(var(--about-card-rotate-y, 0deg)) translate3d(0, var(--about-card-lift, 0px), 0)",
                transformStyle: "preserve-3d",
            }}
        >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-0 transition-opacity duration-700 group-hover:opacity-35" />
            <div
                className={cn(
                    "pointer-events-none absolute -inset-16 rounded-[inherit] bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_58%)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                    glowClassName
                )}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_26%,transparent_68%,rgba(129,140,248,0.12))] opacity-70" />
            <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(420px circle at var(--about-card-x, 50%) var(--about-card-y, 50%), rgba(196,181,253,0.24), transparent 44%)",
                }}
            />
            <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
            <div className="relative h-full transition-transform duration-500 ease-out group-hover:scale-[1.01]" style={{ transform: "translateZ(34px)" }}>
                {children}
            </div>
        </div>
    );
};

export default PremiumAboutCard;
