import { redirect } from "next/navigation";

export default async function Home() {
    return redirect("/app/sign-in");
}
