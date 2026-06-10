"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from 'react';

const SignInForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!email.trim() || !password) {
            setMessage("Enter your email and password.");
            return;
        }

        setIsSubmitting(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setIsSubmitting(false);

        if (result?.error) {
            setMessage(result.error);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-y-5">
            <div className="space-y-3">
                <div className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Secure login
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-medium font-heading text-foreground">Sign in</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                    </p>
                </div>
            </div>
            <div className="grid gap-y-2 w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="border-border/80 bg-background/80 transition-all focus-visible:border-violet-400"
                    required
                />
            </div>
            <div className="grid gap-y-2 w-full">
                <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="border-border/80 bg-background/80 pr-11 transition-all focus-visible:border-violet-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                </div>
            </div>
            {message ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-200" role="alert">
                    {message}
                </p>
            ) : null}
            <Button type="submit" className="group w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
                {!isSubmitting ? <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="font-medium text-foreground transition-colors hover:text-violet-300">
                    Sign up
                </Link>
            </p>
        </form>
    )
};

export default SignInForm
