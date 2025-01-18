import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import { getUserById } from "@/app/actions/(backoffice)/user.actions";

export default async function Home() {
  const { user } = await validateRequest();
  if (user) {
    const userdata = await getUserById(user?.id);
    if (userdata?.tipo_usuario == "admin") {
      return redirect("/bo/layout/sub-table");
    }
    else{
      return redirect("/app");
    }
  }
  else {
    return redirect("/bo/sign-in");
  }
}
