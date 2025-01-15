import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getSentimentCounts } from "@/app/actions/(socialmood)/get-sentimentcount.actions";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const [sentimentData, setSentimentData] = useState({
    totalInteractions: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  });

  const fetchSentimentCounts = async () => {
    try {
      const data = await getSentimentCounts();
      setSentimentData(data);
    } catch (error) {
      console.error("Error al cargar los conteos de sentimientos:", error);
    }
  };

  useEffect(() => {
    fetchSentimentCounts();
  }, []);

  const chartData = {
    labels: ["Positivo", "Negativo", "Neutro"],
    datasets: [
      {
        data: [
          sentimentData.positiveCount,
          sentimentData.negativeCount,
          sentimentData.neutralCount,
        ],
        backgroundColor: ["#2B4FE2", "#FFFFFF", "#414470"],
        borderColor: ["#3b82f6", "#1e3a8a", "#e5e7eb"],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Oculta la leyenda predeterminada de Chart.js
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = chartData.labels[tooltipItem.dataIndex];
            const value = chartData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value}`;
          },
        },
        bodyColor: "white",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="w-fit bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[28px] p-6">
      <div className="flex justify-between space-x-12 items-center text-center">
        <h1 className="text-[24px] text-gray-300 font-bold">Categorías</h1>
        <div className="text-right">
          <p className="text-white/50 text-lg font-bold">Total Interacciones</p>
          <p className="text-white text-2xl font-bold">
            {sentimentData.totalInteractions.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex justify-center mb-4"></div>
      <div className="flex items-center justify-center">
        <div className="w-50 h-50 flex justify-center m-3 p-6">
          <Pie data={chartData} options={options} />
        </div>
        <div className="mt-4 text-gray-400 text-md ml-4 space-y-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#2B4FE2] mr-2 rounded-full"></span>{" "}
            Positivo
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-white mr-2 rounded-full"></span>{" "}
            Negativo
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#414470] mr-2 rounded-full border border-gray-600"></span>{" "}
            Neutro
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
