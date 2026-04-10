import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { PROCESS } from "@/utils";
import { REVIEWS } from "@/utils/constants/misc";
import { ArrowRightIcon, BriefcaseBusinessIcon, HeadsetIcon, LandmarkIcon, MonitorIcon, ShoppingBagIcon, StarIcon } from "lucide-react";
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

const HomePage = async () => {

    return (
        <div className="overflow-x-hidden scrollbar-hide size-full">
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
                                ✨ Hiring Made Simple
                                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </span>
                        </button>
                        <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                            Midstate Global <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">Services</span>
                        </h1>
                        <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
                            Discover better career opportunities with ease. Connect with companies actively hiring and take the next step toward the job you deserve.
                        </p>
                    </AnimationContainer>

                    {/* Image/visual block removed per request */}
                </div>
            </MaxWidthWrapper >
            {/* Trusted-by section removed per request */}

            {/* Features Section */}
            <MaxWidthWrapper className="pt-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
                        <MagicBadge title="Features" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            Connecting Talent with Opportunity
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Midstate Global Services partners with leading companies to recruit talented professionals. We help candidates discover new opportunities and apply to top employers through a simple platform.
                        </p>
                    </div>
                </AnimationContainer>
                {/* Feature images removed per request */}
            </MaxWidthWrapper>

            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Application Process" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            Start Your Journey in 3 Steps
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Follow these simple steps to upload your resume, explore opportunities, and apply to top companies hiring through Midstate Global Services.
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

            {/* Pricing section removed per request */}

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

            {/* Reviews Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Our Customers" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            What our users are saying
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Here&apos;s what some of our users have to say about Linkify.
                        </p>
                    </div>
                </AnimationContainer>
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 py-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {REVIEWS.map((review, index) => (
                        <AnimationContainer delay={0.15 * index} key={index} className="w-full">
                            <MagicCard className="h-full max-w-none md:p-0">
                                <Card className="flex h-full w-full flex-col border-none">
                                    <CardHeader className="space-y-0">
                                        <CardTitle className="text-lg font-medium text-muted-foreground">
                                            {review.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {review.username}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pb-4">
                                        <p className="text-muted-foreground">
                                            {review.review}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="mt-auto w-full space-x-1">
                                        {Array.from({ length: review.rating }, (_, i) => (
                                            <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </CardFooter>
                                </Card>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>
            </MaxWidthWrapper>

            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                                Start Your Career Journey Today
                            </h2>
                            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                                Upload your resume and explore job opportunities from leading companies.
                            </p>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>

        </div>
    )
};

export default HomePage
