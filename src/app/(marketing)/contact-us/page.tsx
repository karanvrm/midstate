import Link from "next/link";

const ContactUsIndexPage = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground mb-8">Get in touch with us</p>
            <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact-us/blog" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Blog
                </Link>
                <Link href="/contact-us/help" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Help
                </Link>
            </div>
        </div>
    );
};

export default ContactUsIndexPage;
