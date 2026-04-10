import { AnimationContainer, MaxWidthWrapper } from "@/components";
import MagicCard from "@/components/ui/magic-card";
import { MailIcon, PhoneCallIcon } from "lucide-react";

const CONTACT_CARDS = [
    {
        title: "Call Us",
        description: "Speak with our team for quick guidance on openings and the application process.",
        value: "+91 98765 43210",
        href: "tel:+919876543210",
        icon: PhoneCallIcon,
    },
    {
        title: "Email Us",
        description: "Drop your resume on our email ID so that we can find the best suitable role for you.",
        value: "careers@midstateglobal.com",
        href: "mailto:careers@midstateglobal.com",
        icon: MailIcon,
    },
];

const ContactUsIndexPage = () => {
    return (
        <div className="overflow-x-hidden">
            <MaxWidthWrapper className="py-10 md:py-16">
                <AnimationContainer>
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-semibold text-foreground md:text-5xl lg:text-6xl">
                            Contact Us
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                            We&apos;re here to help
                        </p>
                    </div>
                </AnimationContainer>

                <div className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    {CONTACT_CARDS.map((card, index) => (
                        <AnimationContainer key={card.title} delay={0.1 * (index + 1)} className="w-full">
                            <MagicCard className="h-full max-w-none border-border/70 bg-neutral-950/80 p-0">
                                <div className="flex h-full flex-col rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8">
                                    <div className="flex size-16 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500/15 text-sky-300 shadow-[0_10px_30px_rgba(14,165,233,0.12)]">
                                        <card.icon className="size-7" strokeWidth={1.8} />
                                    </div>
                                    <h2 className="mt-6 text-2xl font-medium text-foreground">
                                        {card.title}
                                    </h2>
                                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted-foreground">
                                        {card.description}
                                    </p>
                                    <div className="mt-4 text-base font-medium text-foreground">
                                        {card.value}
                                    </div>
                                </div>
                            </MagicCard>
                        </AnimationContainer>
                    ))}
                </div>

                <AnimationContainer delay={0.2}>
                    <div className="mx-auto mt-14 max-w-3xl text-center">
                        <p className="text-base leading-7 text-muted-foreground">
                            We are committed to supporting you at every stage of your career journey. For any inquiries regarding opportunities or applications, feel free to reach out to our team. Our recruitment team strives to provide timely and effective assistance to all candidates.
                        </p>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>
        </div>
    );
};

export default ContactUsIndexPage;
