import { AnimationContainer } from "@/components";
import { cn } from "@/utils";
import { BriefcaseBusinessIcon, Globe2Icon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../Logo.webp";

interface AuthShellProps {
    children: React.ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    className?: string;
}

const proofPoints = [
    {
        label: "Verified portal",
        icon: ShieldCheckIcon,
    },
    {
        label: "Global roles",
        icon: Globe2Icon,
    },
    {
        label: "Career support",
        icon: BriefcaseBusinessIcon,
    },
];

const AuthShell = ({ children, eyebrow, title, description, className }: AuthShellProps) => {
    return (
        <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_60%,transparent_115%)]" />
            <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.13),transparent_34%)]" />
            <div className="relative mx-auto grid min-h-dvh w-full max-w-7xl grid-cols-1 px-4 py-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-8">
                <AnimationContainer className="flex min-h-[360px] flex-col justify-between rounded-lg border border-border/70 bg-neutral-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur md:p-8 lg:min-h-full">
                    <Link href="/" className="flex w-fit items-center gap-4">
                        <Image
                            src={logo}
                            alt="Midstate Global Services logo"
                            width={96}
                            height={96}
                            className="h-14 w-24 object-contain"
                            priority
                        />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground">
                                Midstate Global Services
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Business career portal
                            </p>
                        </div>
                    </Link>

                    <div className="py-12 lg:py-0">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-foreground/90">
                            <span className="size-2 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.8)]" />
                            {eyebrow}
                        </div>
                        <h1 className="max-w-2xl text-4xl font-medium !leading-[1.08] text-foreground font-heading sm:text-5xl lg:text-6xl">
                            Midstate Global <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Services</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                            Building Careers, Empoerting Business.
                        </p>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {proofPoints.map((point) => (
                            <div key={point.label} className="group rounded-lg border border-border/70 bg-background/70 p-4 transition-all duration-300 hover:border-violet-400/40 hover:bg-neutral-900/80">
                                <point.icon className="mb-3 size-5 text-violet-300 transition-transform duration-300 group-hover:-translate-y-0.5" />
                                <p className="text-sm font-medium text-foreground">
                                    {point.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </AnimationContainer>

                <AnimationContainer delay={0.08} className={cn("flex items-center justify-center py-6 lg:py-0", className)}>
                    <div className="w-full max-w-md rounded-lg border border-border/80 bg-card/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
                        {children}
                    </div>
                </AnimationContainer>
            </div>
        </main>
    );
};

export default AuthShell;
