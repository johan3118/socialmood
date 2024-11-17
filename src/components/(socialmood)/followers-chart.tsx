'use client'
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getFacebookAccountFollowers } from '@/app/actions/(socialmood)/dashboard.actions';
import { getAccountColor } from '@/app/actions/(socialmood)/social.actions'; // Asegúrate de ajustar la ruta

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interfaz para los datos de seguidores
interface FollowerData {
    name: string;
    followers_count: number;
}

const SeguidoresChart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
      borderRadius: number;
      barThickness: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Mostrar indicador de carga
        const followersData: FollowerData[] = await getFacebookAccountFollowers();

        if (followersData.length === 0) {
          console.warn('No followers data received.');
          setLoading(false); // Ocultar carga si no hay datos
          return;
        }

        // Obtener colores de todas las cuentas
        const colors = await Promise.all(
          followersData.map(async (account) => {
            const accountColor = await getAccountColor(account.name);
            return accountColor[0]?.color || 'rgba(128, 128, 128, 0.7)';
          })
        );

        // Etiquetas y datos del gráfico
        const labels = followersData.map((account) => account.name);
        const data = followersData.map((account) => account.followers_count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Seguidores',
              data,
              backgroundColor: colors,
              borderWidth: 1,
              borderRadius: 10,
              barThickness: 40, // Altura y anchura específica de las barras
            },
          ],
        });

        setLoading(false); // Ocultar indicador de carga
      } catch (error) {
        console.error('Error fetching followers data:', error);
        setLoading(false); // Ocultar carga en caso de error
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Asegura que ocupe todo el espacio
    plugins: {
      title: {
        display: true,
        text: 'Seguidores',
        font: {
          size: 18,
          family: 'Arial',
          weight: 'bold' as 'bold',
        },
        color: '#FFFFFF',
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw} seguidores`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  return (
    <div
      className="relative w-full h-64 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px]"
      style={{ width: '100%', height: '250px' }} // Ocupa todo el ancho y una altura fija
    >
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-white/10">
          <p className="text-white text-lg">Cargando...</p>
        </div>
      ) : (
        <div className="absolute inset-0 py-6 px-4">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default SeguidoresChart;
