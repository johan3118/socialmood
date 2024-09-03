import { SignUpForm } from "@/components/(socialmood)/SignUpForm";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/profile");
  }

  return (
    <div>
      <div className="absolute top-[5%] left-[45%] flex flex-col items-center justify-center space-y-10 rounded-lg bg-[#1c1b2a] p-6 z-10">
        <SignUpForm />
      </div>
      <Image className="absolute top-[40%] left-[32%] z-20" src={"/magic-wand.svg"} width={200} height={200} alt={""} />
      <Image className="absolute bottom-10 left-[32%] z-0" src={"/fearful-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-20 right-[28%] z-0" src={"/grinning-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute top-10 left-[32%] z-0" src={"/pouting-face.svg"} height={200} width={200} alt={""} />
      <Image className="absolute bottom-20 right-[32%] z-0" src={"/smiling-face-with-hearts.svg"} height={75} width={75} alt={""} />
      <Image className="absolute top-[40%] right-[32%] z-0" src={"/sparkles.svg"} height={200} width={200} alt={""} />
    </div>
  );
}
