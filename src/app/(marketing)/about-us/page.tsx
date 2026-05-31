import { MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
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
import { AboutReveal } from "./about-motion";
import PremiumAboutCard from "./premium-about-card";

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
        <div className="relative overflow-x-hidden">
            <MaxWidthWrapper className="pt-10 md:pt-16">
                <div className="px-6 py-16 md:px-10 md:py-20 lg:px-16">
                    <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <AboutReveal className="max-w-3xl">
                            <MagicBadge title="About Us" />
                            <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-tight text-foreground sm:text-5xl lg:text-6xl">
                                A modern hiring partner for talent and teams ready to move forward.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                Midstate Global Services helps candidates discover better opportunities and supports employers with hiring that feels faster, clearer, and more human.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="group shadow-[0_0_45px_rgba(168,85,247,0.25)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(168,85,247,0.42)]">
                                    <Link href="/jobs">
                                        Explore Jobs
                                        <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-sky-300/35 hover:bg-white/[0.07] hover:shadow-[0_0_45px_rgba(56,189,248,0.16)]">
                                    <Link href="/contact-us">Contact Our Team</Link>
                                </Button>
                            </div>
                        </AboutReveal>

                        <AboutReveal delay={0.12}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <PremiumAboutCard className="p-6 sm:col-span-2" glowClassName="bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_58%)]">
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
                                </PremiumAboutCard>
                                <PremiumAboutCard className="p-6">
                                    <Users2Icon className="size-8 text-violet-300" />
                                    <h2 className="mt-4 text-xl font-medium text-foreground">People-first approach</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        We focus on real alignment, not just quick placement, so every opportunity has stronger long-term potential.
                                    </p>
                                </PremiumAboutCard>
                                <PremiumAboutCard className="p-6" glowClassName="bg-[radial-gradient(circle,rgba(14,165,233,0.22),transparent_58%)]">
                                    <ShieldCheckIcon className="size-8 text-sky-300" />
                                    <h2 className="mt-4 text-xl font-medium text-foreground">Reliable process</h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Our workflow is built to keep candidates informed and employers supported from first contact to final selection.
                                    </p>
                                </PremiumAboutCard>
                            </div>
                        </AboutReveal>
                    </div>
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="relative py-16 md:py-20">
                <div className="pointer-events-none absolute -right-40 top-8 h-[28rem] w-[28rem] rounded-full bg-violet-500/18 blur-3xl" />
                <div className="pointer-events-none absolute -left-36 bottom-0 h-[24rem] w-[30rem] rounded-full bg-blue-500/12 blur-3xl" />
                <AboutReveal>
                    <div className="mx-auto max-w-2xl text-center">
                        <MagicBadge title="Company Story" />
                        <h2 className="mt-6 text-3xl font-medium text-foreground md:text-5xl">
                            Built around clarity, speed, and better outcomes.
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We combine recruitment support, industry reach, and a cleaner candidate experience to help hiring feel less fragmented.
                        </p>
                    </div>
                </AboutReveal>
                <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
                    {COMPANY_PILLARS.map((pillar, index) => (
                        <AboutReveal delay={0.11 * (index + 1)} key={pillar.title}>
                            <PremiumAboutCard className="p-4 md:p-6">
                                <div className="flex h-full flex-col rounded-xl">
                                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_32px_rgba(124,58,237,0.12)] transition-all duration-500 group-hover:border-violet-300/30 group-hover:shadow-[0_0_44px_rgba(124,58,237,0.28)]">
                                        <pillar.icon className="size-6 text-violet-100 transition-colors duration-500 group-hover:text-violet-200" strokeWidth={1.8} />
                                    </div>
                                    <h3 className="mt-6 text-2xl font-medium text-foreground">{pillar.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                                </div>
                            </PremiumAboutCard>
                        </AboutReveal>
                    ))}
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="relative py-6 md:py-10">
                <div className="pointer-events-none absolute left-1/3 top-1/2 h-[30rem] w-[46rem] -translate-y-1/2 rounded-full bg-indigo-500/14 blur-3xl" />
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <AboutReveal>
                        <div className="sticky top-24 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/18 blur-3xl" />
                            <div className="pointer-events-none absolute inset-px rounded-[calc(1.75rem-1px)] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                            <div className="relative">
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
                        </div>
                    </AboutReveal>

                    <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                        {SERVICES.map((service, index) => (
                            <AboutReveal delay={0.1 * (index + 1)} key={service.title}>
                                <PremiumAboutCard className="p-4 md:p-6" glowClassName={index % 2 === 0 ? "bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_58%)]" : undefined}>
                                    <div className="flex h-full flex-col">
                                        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_32px_rgba(59,130,246,0.1)] transition-all duration-500 group-hover:border-sky-300/30 group-hover:shadow-[0_0_44px_rgba(59,130,246,0.26)]">
                                            <service.icon className="size-6 text-sky-100 transition-colors duration-500 group-hover:text-sky-200" strokeWidth={1.8} />
                                        </div>
                                        <h3 className="mt-6 text-xl font-medium text-foreground">{service.title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
                                    </div>
                                </PremiumAboutCard>
                            </AboutReveal>
                        ))}
                    </div>
                </div>
            </MaxWidthWrapper>

            <MaxWidthWrapper className="relative py-16 md:py-20">
                <div className="pointer-events-none absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full bg-sky-500/14 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-8 h-[26rem] w-[34rem] rounded-full bg-violet-600/16 blur-3xl" />
                <AboutReveal>
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/70 p-8 shadow-[0_32px_110px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-10">
                        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-500/18 blur-3xl" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.07),transparent_34%,rgba(59,130,246,0.06))]" />
                        <div className="pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                            <div>
                                <MagicBadge title="Credibility" />
                                <h2 className="mt-6 text-3xl font-medium text-foreground md:text-5xl">
                                    A team structure built to support better hiring conversations.
                                </h2>
                                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                                    If you do not yet have public team profiles to show, this section still gives the page the confidence and depth of a modern company overview.
                                </p>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <PremiumAboutCard className="rounded-2xl p-5">
                                        <div className="text-3xl font-semibold text-foreground">Multi-sector</div>
                                        <p className="mt-2 text-sm text-muted-foreground">Support across IT, operations, finance, and business hiring.</p>
                                    </PremiumAboutCard>
                                    <PremiumAboutCard className="rounded-2xl p-5" glowClassName="bg-[radial-gradient(circle,rgba(14,165,233,0.2),transparent_58%)]">
                                        <div className="text-3xl font-semibold text-foreground">Responsive</div>
                                        <p className="mt-2 text-sm text-muted-foreground">A workflow designed to keep employers and candidates aligned.</p>
                                    </PremiumAboutCard>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {TEAM_BLOCKS.map((block, index) => (
                                    <AboutReveal delay={0.1 * (index + 1)} key={block.title}>
                                        <PremiumAboutCard className="p-6" glowClassName={index === 1 ? "bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_58%)]" : undefined}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-foreground shadow-[0_0_32px_rgba(124,58,237,0.12)] transition-all duration-500 group-hover:border-violet-300/30 group-hover:shadow-[0_0_44px_rgba(124,58,237,0.28)]">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-medium text-foreground">{block.title}</h3>
                                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.description}</p>
                                                </div>
                                            </div>
                                        </PremiumAboutCard>
                                    </AboutReveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </AboutReveal>
            </MaxWidthWrapper>
        </div>
    );
};

export default AboutUsIndexPage;
