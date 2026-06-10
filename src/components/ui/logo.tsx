import Image from "next/image";
import React from 'react'
import { cn } from "@/utils";

interface Props {
    variant?: "icon" | "text" | "full";
    className?: string;
}

const Logo = ({ variant = "icon", className }: Props) => {
    return (
        <>
            {variant === "icon" ? (
                <Image
                    src="/icons/logo.png"
                    alt="Midstate Global Services logo"
                    width={40}
                    height={40}
                    className={cn("size-8 object-contain transition-all", className)}
                    priority
                />
            ) : variant === "text" ? (
                <span className={cn("text-sm font-semibold leading-tight text-foreground transition-all", className)}>
                    Midstate Global Services
                </span>
            ) : (
                <div className={cn("w-auto h-8 flex items-center space-x-2 transition-all", className)}>
                    <Image
                        src="/icons/logo.png"
                        alt="Midstate Global Services logo"
                        width={40}
                        height={40}
                        className="size-8 shrink-0 object-contain transition-all"
                        priority
                    />
                    <span className="text-sm font-semibold leading-tight text-foreground">
                        Midstate Global Services
                    </span>
                </div>
            )}
        </>
    )
};

export default Logo
