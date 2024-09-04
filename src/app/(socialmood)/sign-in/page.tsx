import { SignInForm } from "@/components/(socialmood)/SignInForm";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/profile");
  }

  return (
    <div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      flex flex-col items-center justify-center 
                      p-10 z-10 w-[600px] space-y-4 
                      bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-lg drop-shadow-xl
                      border border-white/60 rounded-[50px]"
      >
        <SignInForm />
      </div>
      <Image className="absolute top-[40%] left-[20%] z-20" src={"/magic-wand.svg"} width={200} height={200} alt={""} />
      <Image className="absolute bottom-10 left-[20%] z-0" src={"/fearful-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-20 right-[20%] z-0" src={"/grinning-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-10 left-[22%] z-0" src={"/pouting-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute bottom-20 right-[22%] z-0" src={"/smiling-face-with-hearts.svg"} height={75} width={75} alt={""} />
      <Image className="absolute top-[40%] right-[20%] z-0" src={"/sparkles.svg"} height={200} width={200} alt={""} />
    </div>
  );
}