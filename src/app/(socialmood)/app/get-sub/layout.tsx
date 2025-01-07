import type { Metadata } from "next";
import { Ubuntu, Inter, Poppins } from "next/font/google"
import Sidebar from "@/components/(socialmood)/sidebar"
import MainBar from "@/components/(socialmood)/main-bar"
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import { hasSubscription } from "@/app/actions/(socialmood)/auth.actions";
import SignOut from "@/components/(socialmood)/sign-out";


const rubik = Ubuntu({
    style: "normal",
    weight: ["400", "500", "700"],
    display: "swap",
    subsets: ["latin"],
});



export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex flex-col items-center justify-center bg-[#2C2436] w-full h-screen overflow-auto">
            <SignOut />
            <main className="">
            {children}
            </main>
        </div>
    );
}
