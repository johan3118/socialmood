import { UserForm } from "@/components/(backoffice)/user-form";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";

export default function CreateSubPage() {
  return (
    <div className="flex min-h-screen bg-white flex-grow">
      {/* Lado Izquierdo */}
      <div className="flex-1 px-32 py-16">
        <h1 className="text-3xl font-bold mb-2">Crear Usuario</h1>
        <p className="text-gray-500 mb-6">
          Ingrese los datos del usuario
        </p>
        <UserForm />
      </div>
      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-2 flex items-center justify-center">
        <BlurredContainer customStyle="h-[300px]"> <Image className="" src={"/socialmood-logo.svg"} width={400} height={70} alt={""} /></BlurredContainer>
      </div>

    </div>
  );
}
