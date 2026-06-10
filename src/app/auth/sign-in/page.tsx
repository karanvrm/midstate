import AuthShell from "@/components/auth/auth-shell";
import { SignInForm } from "@/components";

const SignInPage = () => {
    return (
        <AuthShell
            eyebrow="Team Portal"
            title="Sign in"
            description="Sign in to continue toward curated opportunities, profile updates, and administrator-approved portal access."
        >
            <SignInForm />
        </AuthShell>
    )
};

export default SignInPage
