import { UserForm } from "@/components/(backoffice)/user-form";
import BlurredContainer from "@/components/(socialmood)/blur-background";

export default function CreateSubPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado Izquierdo */}
      <div className="flex-1 p-20">
        <h1 className="text-3xl font-bold mb-2">Crear Usuario</h1>
        <p className="text-gray-500 mb-6">
          Ingrese los datos del usuario
        </p>
        <UserForm />
      </div>
      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-2 flex items-center justify-center">
        <BlurredContainer customStyle="h-[500px]">{""}</BlurredContainer>
      </div>

    </div>
  );
}
