import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { IoLogoFacebook } from "react-icons/io";
const steps = [
    {
        id: "step1",
        title: "Paso 1",
        content: (

            <div className="w-full h-full">
                <p className="font-medium mb-4 text-black">
                    1. Debes crear tu cuenta de facebook Business para poder asociarla a Social Mood.
                </p>
                <iframe
                    className="w-full h-[35vh]"
                    src="https://www.youtube.com/embed/-BF7-d0WaAA?si=C7Hvvg_vs7DMJgbh"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
                <p className="text-s mt-4 text-black">
                    Más información: <a href="https://www.facebook.com/business/help/1199464373557428" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Documentación Facebook</a>
                </p>
            </div>
        ),
    },
    {
        id: "step2",
        title: "Paso 2",
        content: (
            <div className="w-full h-full">

                <p className="font-medium mb-4 text-black">
                    2. Luego de crear tu cuenta debes asociarla a Social Mood tomando los siguientes pasos
                </p>

                <iframe
                    src="https://estintecedu-my.sharepoint.com/personal/1104220_est_intec_edu_do/_layouts/15/embed.aspx?UniqueId=4d74b80f-a003-4768-8f8c-174fedb8d1df&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
                    className="w-full h-[35vh]"
                    allowFullScreen
                >
                </iframe>

                <ol className="mt-4">
                    <li className="text-black text-s">1. Ingresar a las configuraciones de perfil</li>
                    <li className="text-black text-s">2. Hacer click en "+" dentro del apartado de Redes Sociales</li>
                    <li className="text-black text-s">3. Seleccionar la red social</li>
                    <li className="text-black text-s">4. Seguir las instrucciones de la página para otorgar los permisos a Social Mood.</li>
                    <li className="text-black text-s">5. Luego de otorgar los permisos, debes seleccionar el color con el que se representara tu cuenta en la aplicación. Con este color se mostrarán los resultados de los gráficos en la app.</li>
                    <li className="text-black text-s">6. Hacer click en agregar red social.</li>
                </ol>


            </div>



        ),
    },
    {
        id: "step3",
        title: "FAQ",
        content: (
            <div className="w-full h-full">
                <p className="font-medium text-black">FAQ - Frequently Asked Questions</p>
                <iframe 
                src="https://scribehow.com/page-embed/Ayuda_en_linea__-5UdHVEvSk-LKbsT8cZylw" 
                width="100%" 
                height="640">
                </iframe>
            </div>
        ),
    }
];

export default function InstructionCard({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-[80vh] h-[60vh] mx-auto overflow-scroll">
            <div className="flex items-center justify-between border-b">
                <h1 className="text-left text-black font-bold text-2xl">Instrucciones</h1>
                <button className="text-gray-400 hover:text-black" onClick={closeModal}>
                    <X className="h-6 w-6" />
                </button>
            </div>

            <Tabs defaultValue="step1" className="mt-2">
                <TabsList className="mb-4 flex justify-center space-x-2">
                    {steps.map((step) => (
                        <TabsTrigger key={step.id} value={step.id} className="px-4 py-2">
                            {step.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {steps.map((step) => (
                    <TabsContent
                        key={step.id}
                        value={step.id}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <div className="w-full h-full">{step.content}</div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
