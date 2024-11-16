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

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        color: "#fff",
        usePointStyle: true,
      },
    },
    tooltip: {
      enabled: true,
      mode: "index",
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

const GraficoInteracciones: React.FC = () => {
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: ChartData = await getInteractionsByMonthAndUsername(); // Llamada al action
        setData(response); // Actualizamos el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
        setData({ labels: [], datasets: [] }); // Manejo de errores
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="w-full h-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-8"
      style={{ width: "48%", height: "200px" }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default GraficoInteracciones;
