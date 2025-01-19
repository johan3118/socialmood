import SignOut from "@/components/(socialmood)/sign-out";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex flex-col items-center justify-center bg-[#2C2436] w-full overflow-auto">
            <SignOut />
            <main className="">
            {children}
            </main>
        </div>
    );
}
