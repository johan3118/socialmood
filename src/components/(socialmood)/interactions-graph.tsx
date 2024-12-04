"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getInteractionsByMonthAndUsername } from "@/app/actions/(socialmood)/get-interactions.actions"; // Ajusta la ruta al action

// Definir el tipo de datos del gráfico
type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    pointBackgroundColor: string;
    tension: number;
    borderWidth: number;
    fill: boolean;
  }[];
};

// Definir el tipo para los últimos 6 meses
type Last6Month = {
  label: string; // Mes y año en formato "Ene 2024"
  month: number; // Número del mes (1-12)
  year: number; // Año
};

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Cantidad de Comentarios',
      font: {
        size: 18,
        family: 'Arial',
        weight: 'bold' as const,
      },
      color: '#FFFFFF',
    },
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        color: "#fff",
        usePointStyle: true,
      },
      onClick: () => { }, // Disable legend click events

    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#fff",
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#fff",
      },
      grid: {
        display: false,
      },
    },
  },
};

interface GraficoInteraccionesProps {
  filter: any;
}

const GraficoInteracciones: React.FC<GraficoInteraccionesProps> = ({ filter = {} }) => {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener los últimos 6 meses con año
        const now = new Date();
        const last6Months: Last6Month[] = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            label: `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          });
        }

        // Llamada al action
        let response = await getInteractionsByMonthAndUsername();

        if (filter?.social_medias) {
          if (filter.social_medias.length > 0) {
            response.datasets = response.datasets.filter((dataset) => filter.social_medias.includes(dataset.label));
          }
        }

        // Formatear los datos obtenidos del action para incluir los últimos 6 meses
        const formattedLabels = last6Months.map(({ label }) => label);
        const datasets = response.datasets.map((dataset) => ({
          ...dataset,
          data: formattedLabels.map((label, index) =>
            response.labels.includes(label) ? dataset.data[index] : 0
          ),
        }));

        setData({ labels: formattedLabels, datasets });
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
        setData({ labels: [], datasets: [] }); // Manejo de errores
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div
      className="w-full h-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-6"
      style={{ width: "100%", height: "250px" }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default GraficoInteracciones;
