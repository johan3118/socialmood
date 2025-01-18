
import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import { getUserById } from "@/app/actions/(backoffice)/user.actions";


export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = await validateRequest();

    if (!user) {
        return redirect("/bo/sign-in");

    }
    else {
        const userdata = await getUserById(user?.id);
        if (userdata?.tipo_usuario == "participante") {
            return redirect("/app");
        }
    }

    return (
        <>
            {children}
        </>
    )
}
