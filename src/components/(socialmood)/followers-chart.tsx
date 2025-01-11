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
import { getFollowersPerDay } from "@/app/actions/(socialmood)/interactions.actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FollowersData {
  fecha: string;
  cantidad: number;
}

interface SeguidoresChartProps {
  social_medias?: string[];
}

const SeguidoresChart: React.FC<SeguidoresChartProps> = ({
  social_medias = [],
}) => {
  const t = useTranslations("socialmood.dashboard.charts");
  const [data, setData] = useState<FollowersData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const followersData = await getFollowersPerDay();
        const formattedData = followersData.map((item) => ({
          fecha: format(new Date(item.fecha), "dd/MM/yyyy", { locale: es }),
          cantidad: item.cantidad,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching followers data:", error);
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
            name={t("followersTitle")}
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeguidoresChart;
