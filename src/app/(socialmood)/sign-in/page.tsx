import { SignInForm } from "@/components/(socialmood)/SignInForm";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/profile");
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-10 rounded-lg bg-[#1c1b2a] p-6">
      <SignInForm />
    </div>
  );
}
