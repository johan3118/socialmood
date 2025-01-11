"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getEmotionsDistribution } from "@/app/actions/(socialmood)/interactions.actions";

interface EmotionData {
  name: string;
  value: number;
}

interface EmotionsChartProps {
  social_medias?: string[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EmotionsChart: React.FC<EmotionsChartProps> = ({
  social_medias = [],
}) => {
  const t = useTranslations("socialmood.dashboard.charts");
  const [data, setData] = useState<EmotionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emotionsData = await getEmotionsDistribution();
        setData(emotionsData);
      } catch (error) {
        console.error("Error fetching emotions data:", error);
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
              name,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "4px",
            }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "white" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "white" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionsChart;
