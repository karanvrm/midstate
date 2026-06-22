import { AnimationContainer, Icons, MaxWidthWrapper, StatsBar } from "@/components";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import CTASectionWithGallery from "@/components/ui/cta-section-with-gallery";
import { Badge } from "@/components/ui/badge";
import Marquee from "@/components/ui/marquee";
import { PROCESS } from "@/utils";
import {
    ArrowRightIcon,
    BriefcaseBusinessIcon,
    HeadsetIcon,
    LandmarkIcon,
    MonitorIcon,
    ShoppingBagIcon,
    ClipboardList,
    ScanSearch,
    Shuffle,
    BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const LATEST_JOB_OPENINGS = [
    {
        title: "Non IT Jobs",
        icon: BriefcaseBusinessIcon,
        accent: "from-rose-500/10 via-rose-500/5 to-transparent",
    },
    {
        title: "BPO/KPO/LPO",
        icon: HeadsetIcon,
        accent: "from-amber-500/10 via-amber-500/5 to-transparent",
    },
    {
        title: "IT Jobs",
        icon: MonitorIcon,
        accent: "from-sky-500/10 via-sky-500/5 to-transparent",
    },
    {
        title: "BFSI Jobs",
        icon: LandmarkIcon,
        accent: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    },
    {
        title: "Finance",
        icon: BriefcaseBusinessIcon,
        accent: "from-fuchsia-500/10 via-fuchsia-500/5 to-transparent",
    },
    {
        title: "Retail Jobs",
        icon: ShoppingBagIcon,
        accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    },
];

const HOW_WE_WORK = [
    {
        phase: "Phase 1",
        title: "Application Review",
        description:
            "We review your application and understand your requirements, experience, and career goals. A dedicated HR Recruiter then contacts you to discuss opportunities and guide you through the next steps.",
        accent: "from-violet-500/20 via-violet-500/10 to-transparent",
        dot: "bg-violet-500",
        glow: "shadow-violet-500/20",
    },
    {
        phase: "Phase 2",
        title: "Screening & Evaluation",
        description:
            "Our team conducts an initial screening and gathers key details such as experience, skills, and previous compensation. Based on this, we connect you with the most suitable job opportunities.",
        accent: "from-fuchsia-500/20 via-fuchsia-500/10 to-transparent",
        dot: "bg-fuchsia-500",
        glow: "shadow-fuchsia-500/20",
    },
    {
        phase: "Phase 3",
        title: "Opportunity Matching",
        description:
            "We match candidates with suitable opportunities and coordinate interviews with our clients. Our team coordinates interviews, provides scheduling assistance, and keeps candidates informed throughout every stage of the selection process.",
        accent: "from-sky-500/20 via-sky-500/10 to-transparent",
        dot: "bg-sky-500",
        glow: "shadow-sky-500/20",
    },
    {
        phase: "Phase 4",
        title: "Offer & Onboarding",
        description:
            "Selected candidates receive dedicated support through the final stages of recruitment, including offer discussions, documentation, and joining formalities. We work closely with both the candidate and employer to ensure a smooth transition.",
        accent: "from-emerald-500/20 via-emerald-500/10 to-transparent",
        dot: "bg-emerald-500",
        glow: "shadow-emerald-500/20",
    },
];

const marqueeData = [
    "Is this role the right fit for my experience?",
    "What happens after submitting my application?",
    "How long does the screening process take?",
    "Will a recruiter contact me directly?",
    "How do I prepare for the interview?",
    "What skills do recruiters prefer?",
    "Which opportunities match my profile best?",
    "How can I stand out from other candidates?",
    "What should I expect during the evaluation?",
    "How will I know if shortlisted?",
    "What happens after receiving an offer?",
    "Will I get support during onboarding?",
];

const features = [
    {
        description:
            "We review your application to understand your experience, qualifications, and career goals. A dedicated recruiter then reaches out to discuss suitable opportunities and guide you through the next steps.",
        icon: ClipboardList,
        title: "Application Review",
    },
    {
        description:
            "Our team conducts an initial screening and gathers key details such as experience, skills, and previous compensation. Based on this, we connect you with the most suitable job opportunities.",
        icon: ScanSearch,
        title: "Screening & Evaluation",
    },
    {
        description:
            "We match candidates with suitable opportunities and coordinate interviews with our clients. Our team coordinates interviews, provides scheduling assistance, and keeps candidates informed throughout every stage of the selection process.",
        icon: Shuffle,
        title: "Opportunity Matching",
    },
    {
        description:
            "Selected candidates receive dedicated support through the final stages of recruitment, including offer discussions, documentation, and joining formalities. We work closely with both the candidate and employer to ensure a smooth transition.",
        icon: BadgeCheck,
        title: "Offer & Onboarding",
    },
];

const m1 = marqueeData.slice(0, marqueeData.length / 3);
const m2 = marqueeData.slice(
    marqueeData.length / 3,
    (marqueeData.length / 3) * 2,
);
const m3 = marqueeData.slice((marqueeData.length / 3) * 2);

const HomePage = async () => {

    return (
        <div className="overflow-x-hidden scrollbar-hide size-full">
            <div className="mt-24"> </div>
            {/* Hero Section */}
            <MaxWidthWrapper>
                <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
                    <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                        <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                            <span>
                                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                            </span>
                            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
                            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                                Building Careers, Empowering Business
                            </span>
                        </button>
                        <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                            Midstate Global <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">Services</span>
                        </h1>
                        <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
                            Trusted by businesses for efficient hiring solutions and valued by professionals for meaningful opportunities, we create connections that drive growth, success, and long-term impact.
                        </p>
                    </AnimationContainer>

                    {/* Image/visual block removed per request */}
                </div>
            </MaxWidthWrapper >
            {/* Trusted-by section removed per request */}

            {/* Statistics Section */}
            <StatsBar />

            {/* Journey Section */}
            <MaxWidthWrapper className="py-20 md:py-28">
                <CTASectionWithGallery />
            </MaxWidthWrapper>

            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Application Process" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            Start Your Career Journey
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Browse through selected job opportunities, find positions that align with your experience and career goals, and complete your application in a few steps. We&apos;re here to help bridge the gap between talented professionals and organizations looking for candidates.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
                    {PROCESS.map((process, id) => (
                        <AnimationContainer delay={0.2 * id} key={id}>
                            <MagicCard className="group md:py-8">
                                <div className="flex flex-col items-start justify-center w-full">
                                    <process.icon strokeWidth={1.5} className="w-10 h-10 text-foreground" />
                                    <div className="flex flex-col relative items-start">
                                        <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                                            {id + 1}
                                        </span>
                                        <h3 className="text-base mt-6 font-medium text-foreground">
                                            {process.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {process.description}
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>


            {/* Latest Job Opening Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center justify-center w-full py-8">
                        <div className="flex items-center gap-4 w-full max-w-5xl">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border/70" />
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium uppercase tracking-[0.22em] text-foreground/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                                <BriefcaseBusinessIcon className="size-4 text-violet-400" />
                                Latest Job Opening
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border/70" />
                        </div>
                        <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground">
                            Explore current openings across key industries and jump straight to our jobs page for full details.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
                    {LATEST_JOB_OPENINGS.map((job, index) => (
                        <AnimationContainer delay={0.1 * (index + 1)} key={job.title}>
                            <MagicCard className="h-full border-border/70 bg-neutral-950/80 p-0">
                                <div className={`relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-xl bg-gradient-to-br ${job.accent}`}>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
                                    <div className="relative flex h-full flex-col items-start justify-between p-8">
                                        <div className="space-y-6">
                                            <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                                                <job.icon className="size-7 text-foreground" strokeWidth={1.8} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-medium text-foreground">
                                                    {job.title}
                                                </h3>
                                                <p className="max-w-xs text-sm text-muted-foreground">
                                                    Discover curated openings and role updates tailored to this category.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="group h-auto px-0 py-0 text-sm font-semibold uppercase tracking-[0.18em] text-orange-300 hover:bg-transparent hover:text-orange-200"
                                        >
                                            <Link href="/jobs">
                                                Learn more
                                                <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>


            {/* Features / Marquee Section */}
            <section className="relative  pt-20 sm:pt-40 ">
                <div className="mx-auto max-w-full">
                    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 px-5 text-center md:px-10">
                        <MagicBadge title="Our Recruitment Process" />

                        <h2 className="max-w-3xl font-medium text-4xl sm:text-5xl lg:text-6xl">
                            The Structured Approach to Recruitment
                        </h2>
                        <p className="max-w-xl text-base md:text-lg">
                            Finding the right opportunity or the right talent shouldn&apos;t be complicated. Our recruitment process is built to create meaningful connections, streamline hiring, and deliver results for everyone involved.
                        </p>
                        <div className="relative mx-auto max-w-3xl overflow-hidden">
                            <div className="absolute left-0 z-50 h-full w-20 bg-gradient-to-r from-background" />
                            <div className="absolute right-0 z-50 h-full w-20 bg-gradient-to-l from-background" />

                            <div className="-mx-6 flex w-screen flex-col md:-mx-10 lg:-mx-16">
                                <Marquee className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
                                    {m1.map((q) => (
                                        <Badge
                                            className="rounded-none border-slate-700 bg-slate-900 text-slate-100 px-3 py-1"
                                            key={q}
                                            variant="outline"
                                        >
                                            {q}
                                        </Badge>
                                    ))}
                                </Marquee>

                                <Marquee
                                    className="[--duration:50s] [--gap:0.75rem]"
                                    repeat={4}
                                    reverse
                                >
                                    {m2.map((q) => (
                                        <Badge
                                            className="rounded-none border-slate-700 bg-slate-900 text-slate-100 px-3 py-1"
                                            key={q}
                                            variant="outline"
                                        >
                                            {q}
                                        </Badge>
                                    ))}
                                </Marquee>

                                <Marquee className="[--duration:42s] [--gap:0.75rem]" repeat={4}>
                                    {m3.map((q) => (
                                        <Badge
                                            className="rounded-none border-slate-700 bg-slate-900 text-slate-100 px-3 py-1"
                                            key={q}
                                            variant="outline"
                                        >
                                            {q}
                                        </Badge>
                                    ))}
                                </Marquee>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 divide-dashed divide-neutral-600 border-neutral-600 border-t border-dashed sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    className="flex flex-col gap-5 px-5 py-8 last:border-b-0 lg:border-b-0 lg:px-6 lg:py-10"
                                    key={feature.title}
                                >
                                    <Icon className="size-12 text-neutral-700" />

                                    <div className="flex flex-col gap-2 pt-10 lg:pt-20">
                                        <h3 className="font-medium text-lg lg:text-2xl">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm font-light text-neutral-300 max-w-md">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                                Ready to Advance Your Career?
                            </h2>
                            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                                Ready to take the next step? Let&apos;s work together to find the perfect opportunity for your skills and ambitions.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/jobs">
                                    <Button size="lg" variant="outline" className="px-8 py-6 rounded-full text-base shadow-lg hover:shadow-xl transition-shadow">
                                        Explore Opportunities
                                        <ArrowRightIcon className="ml-2 size-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>

        </div>
    )
};

export default HomePage
