"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getInteractionsPerDay } from "@/app/actions/(socialmood)/interactions.actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InteractionData {
  fecha: string;
  cantidad: number;
}

interface GraficoInteraccionesProps {
  social_medias?: string[];
}

const GraficoInteracciones: React.FC<GraficoInteraccionesProps> = ({
  social_medias = [],
}) => {
  const t = useTranslations("socialmood.dashboard.charts");
  const [data, setData] = useState<InteractionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interactionsData = await getInteractionsPerDay();
        const formattedData = interactionsData.map((item) => ({
          fecha: format(new Date(item.fecha), "dd/MM/yyyy", { locale: es }),
          cantidad: item.cantidad,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching interactions data:", error);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <div className="text-center py-4">{t("noData")}</div>;
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            tick={{ fill: "white" }}
            tickLine={{ stroke: "white" }}
          />
          <YAxis tick={{ fill: "white" }} tickLine={{ stroke: "white" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "4px",
            }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "white" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cantidad"
            name={t("interactionsTitle")}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoInteracciones;
