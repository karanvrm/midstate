"use client"

import * as React from "react"
import { HTMLMotionProps, Variants, motion } from "framer-motion"
import { cn } from "@/utils/index"
import { Button } from "@/components/ui/button"
import MagicBadge from "@/components/ui/magic-badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"

interface GalleryGridCellProps extends HTMLMotionProps<"div"> {
  index: number
}

const SPRING_TRANSITION_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
}

const filterVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
}

const areaClasses = [
  "col-start-2 col-end-3 row-start-1 row-end-3", // cell 1
  "col-start-1 col-end-2 row-start-2 row-end-4", // cell 2
  "col-start-1 col-end-2 row-start-4 row-end-6", // cell 3
  "col-start-2 col-end-3 row-start-3 row-end-5", // cell 4
]

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{
        staggerChildren: transition?.staggerChildren ?? 0.2,
        delayChildren: transition?.delayChildren ?? 0.2,
        duration: 0.3,
        ...transition,
      }}
      {...props}
    />
  )
})
ContainerStagger.displayName = "ContainerStagger"

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={filterVariants}
      transition={{
        ...SPRING_TRANSITION_CONFIG,
        duration: 0.3,
        ...transition,
      }}
      {...props}
    />
  )
})
ContainerAnimated.displayName = "ContainerAnimated"

export const GalleryGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 grid-rows-[50px_150px_50px_150px_50px] gap-4",
        className
      )}
      {...props}
    />
  )
})
GalleryGrid.displayName = "GalleryGrid"

export const GalleryGridCell = React.forwardRef<
  HTMLDivElement,
  GalleryGridCellProps
>(({ className, transition, index, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: index * 0.2,
        delayChildren: transition?.delayChildren ?? 0.2,
      }}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-md border border-border/30 bg-card",
        areaClasses[index],
        className
      )}
      {...props}
    />
  )
})
GalleryGridCell.displayName = "GalleryGridCell"

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=600&q=80",
    alt: "Job interview discussion",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    alt: "Recruitment team meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    alt: "Candidate and recruiter meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    alt: "Professional team collaboration",
  },
]

export default function CTASectionWithGallery() {
  return (
    <ContainerStagger className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
      {/* Left side text column */}
      <ContainerAnimated className="flex flex-col items-start text-left space-y-6 max-w-xl">
        <MagicBadge title="Why Midstate" />

        <h2 className="text-3xl md:text-5xl font-medium font-heading text-foreground tracking-tight !leading-[1.15]">
          Where Great Hiring Decisions Begin.
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          At Midstate Global Services, we believe great opportunities begin with the right connections. We help businesses find exceptional talent and support professionals in discovering meaningful careers through a recruitment process defined by speed, quality, and trust.
        </p>

        <Button asChild size="lg" variant="outline" className="group mt-2">
          <Link href="/about-us" className="flex items-center gap-2">
            <span className="text-lg">Read More</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </Button>
      </ContainerAnimated>

      {/* Right side gallery column */}
      <ContainerAnimated className="w-full relative h-[450px] flex items-center justify-center">
        <GalleryGrid className="w-full max-w-md">
          {GALLERY_IMAGES.map((img, idx) => (
            <GalleryGridCell key={idx} index={idx} className="group overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </GalleryGridCell>
          ))}
        </GalleryGrid>
      </ContainerAnimated>
    </ContainerStagger>
  )
}
