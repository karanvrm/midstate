"use client";

export const dynamic = "force-dynamic";
import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AnimationContainer from "@/components/global/animation-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LOCATION_OPTIONS = [
  "Gurugram",
  "Noida",
  "Pune",
  "Banglore",
  "Hyderabad",
  "Delhi",
  "Kolkata",
];

const ApplyPage = () => {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("job") || "Position";

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    preferredLocation: "",
    resume: null as File | null,
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid =
    formData.fullName.trim() &&
    formData.phoneNumber.trim() &&
    formData.email.trim() &&
    formData.preferredLocation &&
    formData.resume &&
    isChecked;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Only PDF, DOC, and DOCX files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB.");
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields and check the consent box.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("fullName", formData.fullName);
      formPayload.append("phoneNumber", formData.phoneNumber);
      formPayload.append("email", formData.email);
      formPayload.append("preferredLocation", formData.preferredLocation);
      formPayload.append("jobTitle", jobTitle);
      if (formData.resume) {
        formPayload.append("resume", formData.resume);
      }

      const response = await fetch("/api/apply", {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          preferredLocation: "",
          resume: null,
        });
        setIsChecked(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <main className="relative overflow-hidden min-h-screen px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute top-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_60%)]" />

        <AnimationContainer className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8" delay={0.1}>
          <div className="relative z-10 flex max-w-2xl flex-col items-center text-center space-y-6">
            <div className="inline-flex rounded-full border border-green-300/20 bg-green-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-green-200 shadow-[0_0_40px_rgba(34,197,94,0.12)]">
              Success
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl font-heading">
              Application Submitted Successfully
            </h1>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg max-w-xl">
              Thank you for applying. Our recruitment team will review your application and contact you if your profile matches our current requirements.
            </p>

            <Button asChild className="mt-8">
              <a href="/jobs">
                Back to Jobs
              </a>
            </Button>
          </div>
        </AnimationContainer>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden min-h-screen px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute top-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_60%)]" />

      <AnimationContainer className="relative mx-auto max-w-2xl" delay={0.1}>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:p-12">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl font-heading">
            Apply for {jobTitle}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Fill out the form below to submit your application.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name <span className="text-red-400">*</span>
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="border border-white/10 bg-white/5 placeholder:text-muted-foreground focus:border-violet-300/40"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="border border-white/10 bg-white/5 placeholder:text-muted-foreground focus:border-violet-300/40"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address <span className="text-red-400">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border border-white/10 bg-white/5 placeholder:text-muted-foreground focus:border-violet-300/40"
              />
            </div>

            {/* Preferred Location */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Which Location do u prefer? <span className="text-red-400">*</span>
              </label>
              <RadioGroup
                value={formData.preferredLocation}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, preferredLocation: value }))
                }
                className="grid gap-3 sm:grid-cols-2"
                required
              >
                {LOCATION_OPTIONS.map((location) => (
                  <label
                    key={location}
                    htmlFor={`location-${location}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground transition-all hover:border-violet-300/40 hover:bg-white/10"
                  >
                    <RadioGroupItem
                      id={`location-${location}`}
                      value={location}
                      className="border-white/30 text-violet-200"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label htmlFor="resume" className="block text-sm font-medium text-foreground">
                Resume/CV <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-8 transition-all hover:border-violet-300/40 hover:bg-white/10"
                >
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC or DOCX (max 5MB)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                By using this form, you agree to the storage and handling of your data by this website. <span className="text-red-400">*</span>
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <a href="/jobs">Cancel</a>
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </AnimationContainer>
    </main>
  );
};

export default ApplyPage;
