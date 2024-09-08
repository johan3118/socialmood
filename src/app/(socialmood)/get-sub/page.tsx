import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/(socialmood)/auth.actions";
import SocialButton from "@/components/(socialmood)/SocialButton";
import BlurredContainer from "@/components/(socialmood)/BlurBackground";

export default async function GetSubscription() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-8"></main>
  );
}
