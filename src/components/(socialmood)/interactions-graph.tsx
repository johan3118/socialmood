"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Datos de ejemplo para el gráfico
const data = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], // Meses
  datasets: [
    {
      label: '@socialmood',
      data: [12, 19, 10, 5, 20, 15],
      borderColor: '#fff',
      backgroundColor: 'fade(#1DA1F2, 0.2)',
      pointBackgroundColor: '#F86A3A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#1DA1F2',
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
    {
      label: '@paosq16',
      data: [12, 19, 10, 20, 10, 15],
      borderColor: '#fff',
      backgroundColor: 'rgba(29, 161, 242, 0.2)',
      pointBackgroundColor: '#1DA1F2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#1DA1F2',
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
  ],
};

// Opciones simplificadas
const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top', // Puedes ajustar esta posición a 'bottom', 'left', 'right'
      labels: {
        color: '#fff',
        usePointStyle: true, // Usa puntos en lugar de rectángulos
      },
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
    },
  },
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

const GraficoInteracciones: React.FC = () => {
  return (
          <div  className="w-full h-64 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-8" style={{ width: '48%', height: '200px' }}> {/* Ajusta el tamaño aquí */}
          <Line data={data} options={options} />
        </div>
  );
};

export default GraficoInteracciones;

