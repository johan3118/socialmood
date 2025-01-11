import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Spotlight } from "@/components/(socialmood)/spotlight";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/app/profile");
  }

  return (
    <div className="bg-[#2C2436] h-screen w-full min-h-full flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-5xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center justify-center">
        <h1 className="text-5xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Futuro SocialMood jeje
        </h1>

        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          <span className="font-bold">Next.js, </span>
          <span className="font-bold">Lucia, </span>
          <span className="font-bold">Drizzle, </span>and
          <span className="font-bold"> Turso</span>.
        </p>
        <div className="mt-10 flex flex-col items-center">
          <p className="text-white font-semibold text-sm text-center">
            johan, pazzis, paola, allen
          </p>
          <div className="flex items-center space-x-2 mt-5">
            <Link href={"app/sign-up"}>
              <Button variant={"default"}>Sign up</Button>
            </Link>
            <p className="text-white text-xs">or</p>
            <Link href={"app/sign-in"}>
              <Button variant={"default"}>Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
