"use client";

import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {

    const client = new QueryClient();

    return (
        <SessionProvider>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
};

export default Providers
