import React from 'react'
import AnimationContainer from "@/components/global/animation-container";
const JobsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0.1}>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Jobs
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    Explore the latest openings and connect with opportunities that match your experience.
                </p>
            </AnimationContainer>
        </div>
    )
};

export default JobsPage
