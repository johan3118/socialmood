import { SignInForm } from "@/components/(socialmood)/sign-in-form";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Image from "next/image";
import BlurredContainer from "@/components/(socialmood)/blur-background";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/app/profile");
  }

  return (
    <div className="w-full min-h-full h-screen flex items-center justify-center bg-[#2C2436]">
      <BlurredContainer>
        <SignInForm />
      </BlurredContainer>

      <Image className="absolute top-[40%] left-[20%] z-20" src={"/magic-wand.svg"} width={200} height={200} alt={""} />
      <Image className="absolute bottom-10 left-[20%] z-0" src={"/fearful-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-20 right-[20%] z-0" src={"/grinning-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-10 left-[22%] z-0" src={"/pouting-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute bottom-20 right-[22%] z-0" src={"/smiling-face-with-hearts.svg"} height={75} width={75} alt={""} />
      <Image className="absolute top-[40%] right-[20%] z-0" src={"/sparkles.svg"} height={200} width={200} alt={""} />
    </div>
  );
}