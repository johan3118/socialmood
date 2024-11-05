'use client'
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes de Chart.js que necesitas
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SeguidoresChart = () => {
  const data = {
    labels: ['@ilovedogs', '@ilovecats', '@doggo'], // Etiquetas para las cuentas de redes sociales
    datasets: [
      {
        label: 'Seguidores', // Etiqueta del dataset
        data: [50, 25, 100], // Datos de seguidores por cuenta
        backgroundColor: [
          'rgba(252, 192, 39)', // Color de fondo para la primera barra
          'rgba(248, 108, 58)', // Color de fondo para la segunda barra
          'rgba(48, 189, 146)', // Color de fondo para la tercera barra
        ],
        borderWidth: 1, // Ancho del borde
        borderRadius: 10, // Radio de redondeo para las esquinas

      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          display: false,
  
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          display: false,
        },
      },
    },
  
  };

  return (
    <div className="w-full h-64 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-8" style={{ width: '300px', height: '200px' }}> {/* Ajusta el tamaño aquí */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default SeguidoresChart;


