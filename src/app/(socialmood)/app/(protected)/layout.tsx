
import type { Metadata } from "next";
import { Ubuntu, Inter, Poppins } from "next/font/google"
import Sidebar from "@/components/(socialmood)/sidebar"
import MainBar from "@/components/(socialmood)/main-bar"
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";

const rubik = Ubuntu({
    style: "normal",
    weight: ["400", "500", "700"],
    display: "swap",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SocialMood App",
    description: "Generated by create next app",
};



export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = await validateRequest();
    console.log(user);
    if (!user) {
        return redirect("/app/sign-in");
    }
    return (
        <main className="bg-[#2C2436] h-screen w-full antialiased min-h-screen flex">
            <div className="flex-1">
                <Sidebar />
            </div>
            <div className="w-full flex-grow overflow-hidden  px-8">
                <MainBar />
                {children}
            </div>
        </main>

    );
}
