import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getSentimentCounts } from "@/app/actions/(socialmood)/get-sentimentcount.actions";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
    filter: any;
}

const CategoryChart = ({ filter }: CategoryChartProps) => {
    const [sentimentData, setSentimentData] = useState({
        totalInteractions: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
    });

    const fetchSentimentCounts = async () => {
        try {
            const data = await getSentimentCounts(filter);
            console.log("Sentiment data:", data); // Verifica los datos
            setSentimentData(data);
        } catch (error) {
            console.error("Error al cargar los conteos de sentimientos:", error);
        }
    };

    useEffect(() => {
        fetchSentimentCounts();
    }, [filter]);

    useEffect(() => {
        console.log("Sentiment data after fetch:", sentimentData); // Asegúrate de que neutralCount tenga el valor correcto
    }, [sentimentData]);

    const chartData = {
        labels: ["Positivo", "Negativo", "Neutro"],
        datasets: [
            {
                data: [
                    sentimentData.positiveCount,
                    sentimentData.negativeCount,
                    sentimentData.neutralCount,
                ],
                backgroundColor: ["#2B4FE2", "#414470", "#FFFFFF"],
                borderColor: ["#2B4FE2", "#414470", "#FFFFFF"],
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
                    label: (tooltipItem: any) => {
                        const label = chartData.labels[tooltipItem.dataIndex];
                        const value = chartData.datasets[0].data[tooltipItem.dataIndex];
                        return `${label}: ${value}`;
                    }
                },
                bodyColor: "white",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: 1,
            },
        },
    };

    return (
        <div className="w-full bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[28px] p-8 h-[300px]">
        <div className="flex justify-between mb-2">
          <h1 className="text-[24px] font-bold">Sentimientos</h1>
          <div className="text-right">
            <p className="text-white/50 text-[16px] font-medium">Cantidad de interacciones</p>
            <p className="text-white text-2xl font-bold">{sentimentData.totalInteractions.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-10">
          <div className="text-white text-md space-y-8">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-[#2B4FE2] mr-2 rounded-full"></span> Positivo
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-[#414470] mr-2 rounded-full"></span> Negativo
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-white mr-2 rounded-full border border-gray-600"></span> Neutral
            </div>
          </div>
          <div className="w-40 h-40">
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </div>
      
    );
};

export default CategoryChart;


