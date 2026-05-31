import React from "react";
import Link from "next/link";
import AnimationContainer from "@/components/global/animation-container";
import MagicCard from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";

const JOB_LISTINGS = [
  {
    title: "Voice Process",
    description:
      "Customer support and voice-based communication role for candidates with good communication skills.",
  },
  {
    title: "Chat Process",
    description:
      "Handle customer interactions through chat and messaging channels while maintaining service quality.",
  },
  {
    title: "Sales Process",
    description:
      "Customer acquisition and sales support role focused on client communication and business growth.",
  },
  {
    title: "Blended",
    description:
      "Support customers across voice and non-voice channels while maintaining smooth service delivery.",
  },
  {
    title: "Fraud Analyst",
    description:
      "Monitor transactions and customer activity to identify, review, and escalate potential fraud risks.",
  },
  {
    title: "Business Manager",
    description:
      "Lead business operations, client coordination, and team performance to support steady growth.",
  },
];

const JobsPage = () => {
  return (
    <main className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <AnimationContainer
        className="relative flex min-h-[75vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        delay={0.1}
      >
        <div className="relative z-10 flex max-w-3xl flex-col items-center space-y-6 text-center">
          <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-violet-200 shadow-[0_0_40px_rgba(167,139,250,0.12)]">
            Current Openings
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl font-heading">
            Current Openings
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl">
            Explore active opportunities across customer support, sales, and business process roles. Find the position that matches your skills and career goals.
          </p>
        </div>
      </AnimationContainer>

      <section className="relative mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {JOB_LISTINGS.map((job, index) => (
            <AnimationContainer delay={0.12 * (index + 1)} key={job.title}>
              <MagicCard className="h-full max-w-none border-border/70 bg-neutral-950/80 p-0">
                <div className="flex h-full flex-col rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition duration-500 hover:border-violet-300/35 hover:shadow-[0_40px_120px_rgba(124,58,237,0.22)]">
                  <div className="mt-6 space-y-5">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {job.title}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-center pt-6">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white transition-all duration-300 hover:border-violet-300/40 hover:bg-white/10 hover:text-white"
                    >
                      <Link href={`/apply?job=${encodeURIComponent(job.title)}`}>
                        Apply Here
                      </Link>
                    </Button>
                  </div>
                </div>
              </MagicCard>
            </AnimationContainer>
          ))}
        </div>
      </section>
    </main>
  );
};

export default JobsPage;
