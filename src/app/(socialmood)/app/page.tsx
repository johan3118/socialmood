import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/app/profile");
  } else{
    return redirect("/app/sign-in");
  }
}
