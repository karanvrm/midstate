import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import {
    ArrowRightIcon,
    BriefcaseBusinessIcon,
    Building2Icon,
    CheckCircle2Icon,
    Globe2Icon,
    HeadsetIcon,
    LineChartIcon,
    MonitorIcon,
    ShieldCheckIcon,
    SparklesIcon,
    Users2Icon,
} from "lucide-react";
import Link from "next/link";

const COMPANY_PILLARS = [
    {
        title: "Our Mission",
        description: "Help candidates find meaningful work faster while giving employers a more dependable hiring pipeline.",
        icon: SparklesIcon,
    },
    {
        title: "Our Vision",
        description: "Build a hiring experience that feels transparent, modern, and genuinely helpful for both talent and teams.",
        icon: Globe2Icon,
    },
    {
        title: "Our Story",
        description: "Midstate Global Services was shaped around one idea: great people should not get lost in a complicated hiring process.",
        icon: Building2Icon,
    },
];

const SERVICES = [
    {
        title: "IT Hiring",
        description: "From support to engineering roles, we connect companies with technical talent ready to contribute quickly.",
        icon: MonitorIcon,
    },
    {
        title: "BPO / KPO / LPO",
        description: "We source high-volume and specialist operations talent with a process built for speed and fit.",
        icon: HeadsetIcon,
    },
    {
        title: "Business Roles",
        description: "Recruitment support across non-IT, finance, retail, and customer-facing teams.",
        icon: BriefcaseBusinessIcon,
    },
    {
        title: "Hiring Insights",
        description: "A focused, data-aware approach that helps employers make faster and better recruitment decisions.",
        icon: LineChartIcon,
    },
];

const TRUST_SIGNALS = [
    "Candidate-first communication",
    "Fast coordination with employers",
    "Role matching across multiple sectors",
    "Responsive support throughout the process",
];

const TEAM_BLOCKS = [
    {
        title: "Recruitment Specialists",
        description: "Focused on screening, role alignment, and making the hiring process easier to navigate.",
    },
    {
        title: "Employer Success Team",
        description: "Works closely with partner companies to understand requirements and improve hiring speed.",
    },
    {
        title: "Candidate Support",
        description: "Helps applicants stay informed, prepared, and confident through each hiring step.",
    },
];

const AboutUsIndexPage = () => {
    return (
        <div className="overflow-x-hidden">
            <MaxWidthWrapper className="pt-10 md:pt-16">
                <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-neutral-950 px-6 py-16 md:px-10 md:py-20 lg:px-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[url('/noise.webp')] opacity-[0.06]" />
                    <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <AnimationContainer className="max-w-3xl">
                            <MagicBadge title="About Us" />
                            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-tight text-foreground sm:text-5xl lg:text-6xl">
                                A modern hiring partner for talent and teams ready to move forward.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                Midstate Global Services helps candidates discover better opportunities and supports employers with hiring that feels faster, clearer, and more human.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="group">
                                    <Link href="/jobs">
                                        Explore Jobs
                                        <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="/contact-us">Contact Our Team</Link>
                                </Button>
                            </div>
                        </AnimationContainer>

                        <AnimationContainer delay={0.1}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:col-span-2">
                                    <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Why teams choose us</div>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                        <div>
                                            <div className="text-3xl font-semibold text-foreground">Talent</div>
                                            <p className="mt-2 text-sm text-muted-foreground">Carefully aligned opportunities across multiple hiring categories.</p>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-semibold text-foreground">Speed</div>
                                            <p className="mt-2 text-sm text-muted-foreground">Structured processes that help reduce friction in every hiring step.</p>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-semibold text-foreground">Trust</div>
                                            <p className="mt-2 text-sm text-muted-foreground">Communication and support designed to feel clear and dependable.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-transparent p-6">
                                    <Users2Icon className="size-8 text-violet-300" />
                                    <h2 className="mt-4 text-xl font-medium text-foreground">People-first approach</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        We focus on real alignment, not just quick placement, so every opportunity has stronger long-term potential.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/15 to-transparent p-6">
                                    <ShieldCheckIcon className="size-8 text-sky-300" />
                                    <h2 className="mt-4 text-xl font-medium text-foreground">Reliable process</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Our workflow is built to keep candidates informed and employers supported from first contact to final selection.
                                    </p>
                                </div>
                            </div>
                        </AnimationContainer>
                    </div>
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="py-16 md:py-20">
                <AnimationContainer>
                    <div className="mx-auto max-w-2xl text-center">
                        <MagicBadge title="Company Story" />
                        <h2 className="mt-6 text-3xl font-medium text-foreground md:text-5xl">
                            Built around clarity, speed, and better outcomes.
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We combine recruitment support, industry reach, and a cleaner candidate experience to help hiring feel less fragmented.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
                    {COMPANY_PILLARS.map((pillar, index) => (
                        <AnimationContainer delay={0.1 * (index + 1)} key={pillar.title}>
                            <MagicCard className="h-full border-border/70 bg-neutral-950/70">
                                <div className="flex h-full flex-col rounded-xl">
                                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                        <pillar.icon className="size-6 text-foreground" strokeWidth={1.8} />
                                    </div>
                                    <h3 className="mt-6 text-2xl font-medium text-foreground">{pillar.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="py-6 md:py-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <AnimationContainer>
                        <div className="sticky top-24 rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-white/[0.03] to-transparent p-8">
                            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">What we offer</p>
                            <h2 className="mt-4 text-3xl font-medium text-foreground md:text-4xl">
                                Recruitment support shaped for real-world hiring needs.
                            </h2>
                            <p className="mt-4 text-base leading-7 text-muted-foreground">
                                Our services are designed to support both job seekers and employers with focused execution, practical communication, and category-specific hiring support.
                            </p>
                            <div className="mt-8 space-y-3">
                                {TRUST_SIGNALS.map((item) => (
                                    <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimationContainer>

                    <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                        {SERVICES.map((service, index) => (
                            <AnimationContainer delay={0.1 * (index + 1)} key={service.title}>
                                <MagicCard className="h-full border-border/70 bg-neutral-950/80">
                                    <div className="flex h-full flex-col">
                                        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                            <service.icon className="size-6 text-foreground" strokeWidth={1.8} />
                                        </div>
                                        <h3 className="mt-6 text-xl font-medium text-foreground">{service.title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
                                    </div>
                                </MagicCard>
                            </AnimationContainer>
                        ))}
                    </div>
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="py-16 md:py-20">
                <AnimationContainer>
                    <div className="rounded-[2rem] border border-border/70 bg-neutral-950/70 p-8 md:p-10">
                        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                            <div>
                                <MagicBadge title="Credibility" />
                                <h2 className="mt-6 text-3xl font-medium text-foreground md:text-5xl">
                                    A team structure built to support better hiring conversations.
                                </h2>
                                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                                    If you do not yet have public team profiles to show, this section still gives the page the confidence and depth of a modern company overview.
                                </p>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                        <div className="text-3xl font-semibold text-foreground">Multi-sector</div>
                                        <p className="mt-2 text-sm text-muted-foreground">Support across IT, operations, finance, and business hiring.</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                        <div className="text-3xl font-semibold text-foreground">Responsive</div>
                                        <p className="mt-2 text-sm text-muted-foreground">A workflow designed to keep employers and candidates aligned.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {TEAM_BLOCKS.map((block, index) => (
                                    <AnimationContainer delay={0.1 * (index + 1)} key={block.title}>
                                        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-foreground">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-medium text-foreground">{block.title}</h3>
                                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimationContainer>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>
        </div>
    );
};

export default AboutUsIndexPage;
