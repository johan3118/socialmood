// app/dashboard/layout.tsx
import { Ubuntu } from "next/font/google";


const rubik = Ubuntu({
    style: "normal",
    weight: ["400", "500", "700"],
    display: "swap",
    subsets: ["latin"],
});

export const metadata = {
    title: "Backoffice Login",
    description: "Social Mood Backoffice Login",
};

export default function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#A9A0B4] w-full h-screen">
            <main>{children}</main>
        </div>
    );
}
