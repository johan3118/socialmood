import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { IoLogoFacebook } from "react-icons/io";
import { useTranslations } from "next-intl";

interface InstructionCardProps {
  closeModal: () => void;
}

export default function InstructionCard({ closeModal }: InstructionCardProps) {
  const t = useTranslations("socialmood.instructions");

  const steps = [
    {
      id: "step1",
      title: t("facebook.step1"),
      content: (
        <div className="w-full h-full">
          <p className="font-medium mb-4 text-black">{t("facebook.step1")}</p>
          <iframe
            className="w-full h-[35vh]"
            src="https://www.youtube.com/embed/-BF7-d0WaAA?si=C7Hvvg_vs7DMJgbh"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="text-s mt-4 text-black">
            {t("facebook.moreInfo")}:
            <a
              href="https://www.facebook.com/business/help/1199464373557428"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {t("facebook.documentation")}
            </a>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-auto relative">
      <button
        onClick={closeModal}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <X className="h-6 w-6" />
      </button>

      <Tabs defaultValue="step1" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          {steps.map((step) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="data-[state=active]:bg-white"
            >
              <div className="flex items-center gap-2">
                <IoLogoFacebook className="text-blue-600" />
                <span className="text-black">{step.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((step) => (
          <TabsContent key={step.id} value={step.id}>
            {step.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
