import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import { TargetIcon } from "@radix-ui/react-icons";
import SocialButton from "@/components/(socialmood)/social-button";
export default async function ProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-8">
      <div className="bg-white px-2 py-1 rounded-lg flex items-center">
        <TargetIcon className="w-4 h-4 mr-2" />
        <p className="font-semibold text-sm">Protected route</p>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome {user.username}
        </h1>
      </div>
      <form action={redirect("/app/get-sub")}>
        <SocialButton
          type="submit"
          variant="default"
          defaultText="Get Subscription"
          pendingText="Loading..."
        />
      </form>
    </main>
  );
}
