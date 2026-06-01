"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils";

const whatsappUrl = "https://wa.me/918294897343";
const whatsappIcon = "/whatsapp.png";

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const openWhatsApp = () => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-7 sm:right-7">
            <div
                className={cn(
                    "mb-3 w-[calc(100vw-2.5rem)] max-w-[180px] origin-bottom-right overflow-hidden rounded-md bg-zinc-900 shadow-xl ring-1 ring-white/10 transition-all duration-300 ease-out sm:max-w-[210px]",
                    isOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none translate-y-4 scale-95 opacity-0",
                )}
                aria-hidden={!isOpen}
            >
                <div className="relative bg-[#26c044] px-3 py-3 text-white">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                        aria-label="Close WhatsApp chat popup"
                    >
                        <X className="size-4" />
                    </button>

                    <div className="flex items-start gap-2 pr-6">
                        <div className="relative mt-0.5 size-7 shrink-0">
                            <Image
                                src={whatsappIcon}
                                alt=""
                                fill
                                sizes="28px"
                                className="object-contain"
                            />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold leading-tight sm:text-base">
                                Start a Conversation
                            </h2>

                            <p className="text-xs font-medium leading-4 text-white/90">
                                Click below to chat with our team on WhatsApp
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 px-3 py-3">
                    <p className="text-xs leading-4 text-zinc-400">
                        The team typically replies in a few minutes.
                    </p>

                    <button
                        type="button"
                        onClick={openWhatsApp}
                        className="group flex w-full items-center gap-2 rounded-md border-l-2 border-[#26c044] bg-zinc-800 px-2 py-2 text-left transition hover:-translate-y-0.5 hover:bg-zinc-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#26c044]/40"
                    >
                        <span className="relative size-8 shrink-0">
                            <Image
                                src={whatsappIcon}
                                alt=""
                                fill
                                sizes="32px"
                                className="object-contain"
                            />
                        </span>

                        <span className="min-w-0 flex-1 text-xs font-medium leading-4 text-zinc-100">
                            Midstate Global Services
                        </span>

                        <span className="relative size-5 shrink-0 transition group-hover:scale-110">
                            <Image
                                src={whatsappIcon}
                                alt=""
                                fill
                                sizes="20px"
                                className="object-contain"
                            />
                        </span>
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="relative size-[72px] bg-transparent focus:outline-none sm:size-20"
                aria-label={isOpen ? "Close WhatsApp chat popup" : "Open WhatsApp chat popup"}
                aria-expanded={isOpen}
            >
                <Image
                    src={whatsappIcon}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                />
            </button>
        </div>
    );
}