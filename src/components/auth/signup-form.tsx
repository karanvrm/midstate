"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightIcon, CheckCircle2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from 'react';

const SignUpForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!name.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
            setIsSuccess(false);
            setMessage("Complete all required fields.");
            return;
        }

        if (password.length < 8) {
            setIsSuccess(false);
            setMessage("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setIsSuccess(false);
            setMessage("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, phoneNumber, password }),
        });

        const data = await response.json().catch(() => ({}));
        setIsSubmitting(false);

        if (!response.ok) {
            setIsSuccess(false);
            setMessage(data.error ?? "Unable to create your account.");
            return;
        }

        setIsSuccess(true);
        setMessage(data.message ?? "Your account is awaiting administrator approval.");
        setName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
    };

    if (isSuccess) {
        return (
            <div className="flex w-full flex-col items-start gap-y-5">
                <div className="flex size-12 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2Icon className="size-6" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-medium font-heading text-foreground">Request submitted</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Your registration request has been submitted and is awaiting approval from an administrator.
                    </p>
                </div>
                <Button asChild className="w-full">
                    <Link href="/auth/sign-in">Back to login</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-y-4">
            <div className="space-y-3">
                <div className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Staff registration
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-medium font-heading text-foreground">Create account</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Submit your profile for administrator approval.
                    </p>
                </div>
            </div>
            <div className="grid gap-y-2 w-full">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="border-border/80 bg-background/80 transition-all focus-visible:border-violet-400"
                    required
                />
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
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 555 000 0000"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="border-border/80 bg-background/80 transition-all focus-visible:border-violet-400"
                    required
                />
            </div>
            <div className="grid gap-y-2 w-full">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={8}
                        placeholder="At least 8 characters"
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
            <div className="grid gap-y-2 w-full">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={8}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="border-border/80 bg-background/80 pr-11 transition-all focus-visible:border-violet-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                        {showConfirmPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                </div>
            </div>
            {message ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-200" role="alert">
                    {message}
                </p>
            ) : null}
            <Button type="submit" className="group w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
                {!isSubmitting ? <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="font-medium text-foreground transition-colors hover:text-violet-300">
                    Login
                </Link>
            </p>
        </form>
    )
};

export default SignUpForm
