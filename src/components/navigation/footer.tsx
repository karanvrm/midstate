import Link from 'next/link';
import { AnimationContainer, Icons } from "@/components"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">

            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

            <div className="grid gap-8 xl:grid-cols-4 xl:gap-8 w-full">

                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-start justify-start md:max-w-[200px]">
                        <div className="flex items-start">
                            <Icons.logo className="w-7 h-7" />
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm text-start">
                            Connecting talented professionals with global career opportunities.
                        </p>
                        <span className="mt-4 text-neutral-200 text-sm flex items-center">
                        </span>
                    </div>
                </AnimationContainer>

                <AnimationContainer delay={0.2}>
                    <div className="">
                        <h3 className="text-base font-medium text-white">
                            Opportunities
                        </h3>
                        <ul className="mt-4 text-sm text-muted-foreground">
                            <li className="">
                                <Link href="" className="hover:text-foreground transition-all duration-300">
                                    About Us
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="" className="hover:text-foreground transition-all duration-300">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="" className="hover:text-foreground transition-all duration-300">
                                    Candidate Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                </AnimationContainer>

                <AnimationContainer delay={0.3}>
                    <div className="flex flex-col">
                        <h3 className="text-base font-medium text-white">
                            Social Handles
                        </h3>
                        <ul className="mt-4 text-sm text-muted-foreground">
                            <li className="">
                                <Link href="http://facebook.com/midstateglobalservices" className="hover:text-foreground transition-all duration-300">
                                    Facebook
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="https://www.instagram.com/midstateglobalservices/" className="hover:text-foreground transition-all duration-300">
                                    Instagram
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="https://www.youtube.com/@midstateglobalservices" className="hover:text-foreground transition-all duration-300">
                                    YouTube
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="https://www.linkedin.com/company/midstateglobalservices/" className="hover:text-foreground transition-all duration-300">
                                    LinkedIn
                                </Link>
                            </li>
                        </ul>
                    </div>
                </AnimationContainer>

                <AnimationContainer delay={0.4}>
                    <div className="flex flex-col">
                        <h3 className="text-base font-medium text-white">
                            Company
                        </h3>
                        <ul className="mt-4 text-sm text-muted-foreground">
                            <li className="">
                                <Link href="/privacy" className="hover:text-foreground transition-all duration-300">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="/terms" className="hover:text-foreground transition-all duration-300">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="/contact-us" className="hover:text-foreground transition-all duration-300">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </AnimationContainer>

            </div>

            <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
                <AnimationContainer delay={0.6}>
                    <p className="text-sm text-muted-foreground mt-8 md:mt-0">
                        &copy; {new Date().getFullYear()} Linkify INC. All rights reserved.
                    </p>
                </AnimationContainer>
            </div>

            <div className="h-[20rem] lg:h-[20rem] hidden md:flex items-center justify-center">
                <TextHoverEffect text="Midstate" />
            </div>
        </footer>
    )
}

export default Footer
