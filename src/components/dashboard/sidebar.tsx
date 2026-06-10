import { cn } from "@/utils";
import {
    BriefcaseBusinessIcon,
    CheckSquareIcon,
    LayoutDashboardIcon,
    Settings2Icon,
    ShieldIcon,
    Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SidebarProps {
    stakeholder?: "admin" | "staff";
}

const SIDEBAR_COPY = {
    admin: {
        label: "Admin Panel",
        description:
            "Shared dashboard shell for platform-level actions and oversight.",
        icon: ShieldIcon,
    },
    staff: {
        label: "Staff Panel",
        description:
            "Shared workspace for internal operations and hiring coordination.",
        icon: Users2Icon,
    },
} as const;

const Sidebar = ({ stakeholder = "admin" }: SidebarProps) => {
    const config = SIDEBAR_COPY[stakeholder];
    const Icon = config.icon;

    return (
        <aside className="hidden w-72 shrink-0 border-r border-border/70 bg-neutral-950/90 lg:flex">
            <div className="flex h-full w-full flex-col p-6">
                <Link href="/" className="flex flex-col items-center text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2">
                        <Image
                            src="/icons/logo.png"
                            alt="Midstate Global Services logo"
                            width={48}
                            height={48}
                            className="size-full object-contain"
                        />
                    </div>

                    <div className="mt-3">
                        <div className="text-sm font-medium text-foreground">
                            Midstate Global{" "}
                            <span className="text-purple-500">Services</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {config.label}
                        </div>
                    </div>
                </Link>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <Icon
                        className="size-6 text-foreground"
                        strokeWidth={1.8}
                    />
                    <h2 className="mt-4 text-lg font-medium text-foreground">
                        {config.label}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {config.description}
                    </p>
                </div>

                <nav className="mt-8 space-y-2">
                    {[
                        {
                            label: "Overview",
                            icon: LayoutDashboardIcon,
                            active: true,
                        },
                        {
                            label: "Task Management",
                            icon: CheckSquareIcon,
                            href: stakeholder === "admin" ? "/admin/dashboard/tasks" : "/staff/dashboard/tasks",
                        },
                        {
                            label: "Workspace",
                            icon: BriefcaseBusinessIcon,
                        },
                        {
                            label: "Settings",
                            icon: Settings2Icon,
                        },
                    ].map((item) => {
                        const isLink = item.href ? true : false;
                        
                        const content = (
                            <div
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors w-full",
                                    item.active
                                        ? "border border-white/10 bg-white/[0.05] text-foreground"
                                        : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                                )}
                            >
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                            </div>
                        );

                        return isLink ? (
                            <Link key={item.label} href={item.href!}>
                                {content}
                            </Link>
                        ) : (
                            <div key={item.label}>
                                {content}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;