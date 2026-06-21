"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn, NAV_LINKS } from "@/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import MaxWidthWrapper from "../global/max-width-wrapper";
import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "../global/animation-container";
import logo from "../../../Logo.webp";
import { motion } from "framer-motion";

const Navbar = () => {
    const [scroll, setScroll] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Handle background blur trigger (> 8px)
            if (currentScrollY > 8) {
                setScroll(true);
            } else {
                setScroll(false);
            }

            // Keep navbar visible if mobile menu is open
            if (isMobileMenuOpen) {
                setVisible(true);
                return;
            }

            if (currentScrollY < 50) {
                setVisible(true);
            } else {
                const diff = currentScrollY - lastScrollY;
                if (diff > 15) {
                    // Scrolling down significantly -> hide
                    setVisible(false);
                } else if (diff < -15) {
                    // Scrolling up significantly -> show
                    setVisible(true);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY, isMobileMenuOpen]);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{
                y: visible ? 0 : -80,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "fixed top-0 inset-x-0 h-20 w-full border-b border-transparent z-[99999] select-none transition-colors duration-200",
                scroll && "border-background/80 bg-background/40 backdrop-blur-md"
            )}
        >
            <AnimationContainer reverse delay={0.1} className="size-full">
                <MaxWidthWrapper className="flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href="/#home" className="flex w-28 flex-col items-center justify-center gap-0.5">
                            <Image
                                src={logo}
                                alt="Midstate Global Services logo"
                                width={72}
                                height={72}
                                className="h-12 w-24 object-contain"
                                priority
                            />
                            <span className="w-full text-center text-[9px] font-bold font-heading uppercase leading-tight">
                                Midstate Global Services
                            </span>
                        </Link>

                        <NavigationMenu className="hidden lg:flex">
                            <NavigationMenuList>
                                {NAV_LINKS.map((link) => (
                                    <NavigationMenuItem key={link.title}>
                                        {link.menu && link.title !== "About Us" ? (
                                            <>
                                                <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className={cn(
                                                        "grid gap-1 p-4 md:w-[400px] lg:w-[500px] rounded-xl bg-neutral-950 border border-white/10",
                                                        link.title === "About Us" ? "lg:grid-cols-[.75fr_1fr]" : "lg:grid-cols-2"
                                                    )}>
                                                        {link.menu.map((menuItem) => (
                                                            <ListItem
                                                                key={menuItem.title}
                                                                title={menuItem.title}
                                                                href={menuItem.href}
                                                                icon={menuItem.icon}
                                                            >
                                                                {menuItem.tagline}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link href={link.href} legacyBehavior passHref>
                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                    {link.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="hidden lg:flex items-center gap-2">
                        <Button asChild variant="ghost">
                            <Link href="/auth/sign-in">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/sign-up">Sign up</Link>
                        </Button>
                    </div>

                    <MobileNavbar isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
                </MaxWidthWrapper>
            </AnimationContainer>
        </motion.header>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href!}
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-100 ease-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center space-x-2 text-neutral-300">
                        <Icon className="h-4 w-4" />
                        <h6 className="text-sm font-medium !leading-none">
                            {title}
                        </h6>
                    </div>
                    <p title={children! as string} className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

export default Navbar;
