import { AnimationContainer, MaxWidthWrapper } from "@/components";
import Link from "next/link";

const TermsPage = () => {
    return (
        <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
            <AnimationContainer delay={0.1} className="w-full">
                <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
                    Terms and Conditions
                </h1>

                <p className="text-sm mb-2 italic mt-20">
                    Last updated: 30th December 2025
                </p>

                <p className="mt-4 text-muted-foreground">
                    Welcome to <strong>Midstate Global Services</strong>. These Terms and Conditions govern your use of our website, recruitment platform, and related services.
                </p>

                <p className="mt-4 text-muted-foreground">
                    By accessing or using our services, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, please do not use our services.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    About Our Services
                </h2>

                <p className="mt-8 text-muted-foreground">
                    Midstate Global Services operates as a recruitment and hiring support consultancy that connects candidates with hiring partner companies across BPO, customer support, operations, IT support, and related industries.
                </p>

                <p className="mt-4 text-muted-foreground">
                    We assist with candidate sourcing, profile screening, interview coordination, and communication between candidates and hiring companies.
                </p>

                <p className="mt-4 text-muted-foreground">
                    Final hiring decisions, interviews, onboarding, salary discussions, and employment terms are managed directly by the respective hiring companies.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Eligibility
                </h2>

                <p className="mt-8 text-muted-foreground">
                    To use our services, candidates must be at least 18 years old and capable of providing accurate and lawful employment-related information.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Candidate Responsibilities
                </h2>

                <div className="mt-8">
                    <ul className="list-disc ml-8 text-muted-foreground">
                        <li>Provide accurate and genuine personal and professional information.</li>
                        <li>Submit authentic resumes and documents.</li>
                        <li>Attend scheduled interviews professionally and responsibly.</li>
                        <li>Avoid impersonation, fraudulent applications, or misleading information.</li>
                        <li>Maintain respectful communication with recruiters and hiring companies.</li>
                    </ul>
                </div>

                <h2 className="text-xl font-medium mt-12">
                    No Placement Guarantee
                </h2>

                <p className="mt-8 text-muted-foreground">
                    While we strive to connect candidates with suitable opportunities, Midstate Global Services does not guarantee job placement, interview selection, employment confirmation, or salary outcomes.
                </p>

                <p className="mt-4 text-muted-foreground">
                    Final selection depends entirely on the hiring company&apos;s internal evaluation and recruitment process.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    No Registration Fees
                </h2>

                <p className="mt-8 text-muted-foreground">
                    We do not charge candidates any registration fee, placement fee, interview fee, or hidden charges for applying to opportunities through our consultancy.
                </p>

                <p className="mt-4 text-muted-foreground">
                    If anyone requests payment in our name for recruitment services, candidates should report it to us immediately.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Document Submission
                </h2>

                <p className="mt-8 text-muted-foreground">
                    Candidates may be required to submit resumes, identification documents, educational certificates, or employment-related information during the recruitment process.
                </p>

                <p className="mt-4 text-muted-foreground">
                    By submitting documents, candidates confirm that the provided information is accurate and legally shareable for recruitment purposes.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Privacy and Data Protection
                </h2>

                <p className="mt-8 text-muted-foreground">
                    Candidate information is handled professionally and securely. We do not sell, misuse, or distribute personal information for unrelated commercial purposes.
                </p>

                <p className="mt-4 text-muted-foreground">
                    Please review our{" "}
                    <Link href="/privacy" className="underline">
                        Privacy Policy
                    </Link>{" "}
                    to understand how we collect, use, and protect candidate information.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Third-Party Hiring Companies
                </h2>

                <p className="mt-8 text-muted-foreground">
                    Midstate Global Services works with multiple hiring partners and companies. Once a candidate profile is shared with a hiring company, portions of the recruitment process may be managed directly by that company.
                </p>

                <p className="mt-4 text-muted-foreground">
                    We are not responsible for employment decisions, company policies, workplace conditions, salary structures, or operational practices of third-party employers.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Acceptable Use
                </h2>

                <div className="mt-8">
                    Candidates agree not to:
                    <ul className="list-disc text-muted-foreground ml-8 mt-4">
                        <li>Submit false or misleading information.</li>
                        <li>Use the platform for unlawful purposes.</li>
                        <li>Attempt unauthorized access to systems or data.</li>
                        <li>Harass recruiters, staff members, or hiring companies.</li>
                        <li>Misuse recruitment communications or interview opportunities.</li>
                    </ul>
                </div>

                <h2 className="text-xl font-medium mt-12">
                    Limitation of Liability
                </h2>

                <p className="mt-8 text-muted-foreground">
                    Midstate Global Services shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our services, recruitment outcomes, or third-party hiring decisions.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Termination of Access
                </h2>

                <p className="mt-8 text-muted-foreground">
                    We reserve the right to restrict or terminate access to our services if any user violates these Terms and Conditions or engages in fraudulent, abusive, or unlawful activities.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Changes to Terms
                </h2>

                <p className="mt-8 text-muted-foreground">
                    We may update these Terms and Conditions from time to time to reflect operational, legal, or service-related changes. Updated versions will be published on our website.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Governing Law
                </h2>

                <p className="mt-8 text-muted-foreground">
                    These Terms and Conditions shall be governed and interpreted in accordance with the laws of India.
                </p>

                <h2 className="text-xl font-medium mt-12">
                    Contact Us
                </h2>

                <p className="mt-8 text-muted-foreground">
                    If you have any questions regarding these Terms and Conditions, please contact us through the contact information available on our website.
                </p>

                <p className="mt-12 font-medium">
                    By using our services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                </p>
            </AnimationContainer>
        </MaxWidthWrapper>
    );
};

export default TermsPage;