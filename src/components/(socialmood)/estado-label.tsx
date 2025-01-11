import { useTranslations } from "next-intl";

interface EstadoLabelProps {
  estado: "ACTIVO" | "INACTIVO";
}

export default function EstadoLabel({ estado }: EstadoLabelProps) {
  const t = useTranslations("common");

  const getColorClass = (estado: string) => {
    return estado === "ACTIVO"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${getColorClass(estado)}`}
    >
      {estado === "ACTIVO" ? t("active") : t("inactive")}
    </span>
  );
}
