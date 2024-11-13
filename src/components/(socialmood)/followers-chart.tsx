'use client'
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getFacebookAccountFollowers } from '@/app/actions/(socialmood)/dashboard.actions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const followersData: FollowerData[] = await getFacebookAccountFollowers();
        
        const labels = followersData.map((account) => account.name);
        const data = followersData.map((account) => account.followers_count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Seguidores',
              data,
              backgroundColor: [
                'rgba(252, 192, 39)',
                'rgba(248, 108, 58)',
                'rgba(48, 189, 146)',
              ],
              borderWidth: 1,
              borderRadius: 10,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching followers data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Seguidores', // Título del gráfico
        font: {
            size: 16, // Tamaño de la fuente del título
            family: 'arial', // Familia de la fuente
            weight: 'bold',
        },
        color: '#FFFFFF', // Color del título
    },
    }

  
  };

  return (
    <div className="w-full h-64 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-8" style={{ width: '300px', height: '200px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SeguidoresChart;
