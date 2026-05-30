"use client";

import { motion } from "framer-motion";
import React from "react";

interface AboutRevealProps {
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    className?: string;
}

export const AboutReveal = ({ children, className, reverse, delay = 0 }: AboutRevealProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: reverse ? -28 : 28, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{
                duration: 0.85,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
};
