import AuthShell from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components";

const SignUpPage = () => {
    return (
        <AuthShell
            eyebrow="Join the team"
            title="Create account"
            description="Create a staff account request. An administrator will review your registration before portal access is activated. False requests will be rejected and blocked from future attempts."
            className="items-start lg:items-center"
        >
            <SignUpForm />
        </AuthShell>
    )
};

export default SignUpPage
