import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import Link from "next/link";
import SocialButton from "@/components/(backoffice)/social-button";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/bo/layout/sub-table");
  }
  else{
    return redirect("/bo/sign-in");
  }
}
