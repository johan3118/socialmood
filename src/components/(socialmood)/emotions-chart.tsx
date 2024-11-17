'use client'
import React, { useEffect } from 'react';
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

import { getEmotions } from '@/app/actions/(socialmood)/get-interactions.actions';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmotionsChart = () => {
    const [emotions, setEmotions] = React.useState<[string, number][] | null>(null);

    // Obtener las emociones desde el backend
    const fetchEmotions = async () => {
        try {
            const emotionsData = await getEmotions();
            console.log(emotionsData);
            setEmotions(emotionsData);
        } catch (error) {
            console.error("Error fetching emotions:", error);
        }
    };

    useEffect(() => {
        fetchEmotions();
    }, []);

    // Generar colores dinámicamente si hay más emociones de las previstas
    const generateColors = (count: number) => {
        return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);
    };

    const data = {
        labels: emotions?.map(([emotion]) => emotion) ?? [], // Etiquetas de las emociones
        datasets: [
            {
                label: 'Emociones', // Título del dataset
                data: emotions?.map(([_, frequency]) => frequency) ?? [], // Frecuencia de cada emoción
                backgroundColor: generateColors(emotions?.length ?? 0), // Colores dinámicos
                borderRadius: 10, // Bordes redondeados para las barras
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // Cambiar las barras a orientación horizontal
        plugins: {
            legend: {
                display: false,
                
            },
            title: {
                display: true,
                text: 'Emociones',
                font: {
                    size: 18,
                    family: 'Arial',
                    weight: 'bold' as const,
                },
                color: '#FFFFFF', // Color del título
            },
        },
        responsive: true,
        maintainAspectRatio: false, // El gráfico ocupa todo el contenedor
        scales: {
            x: {
                ticks: {
                    color: '#FFFFFF', // Color blanco para las etiquetas del eje X
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // Líneas de rejilla en el eje X
                },
            },
            y: {
                ticks: {
                    color: '#FFFFFF', // Color blanco para las etiquetas del eje Y
                },
                grid: {
                    display: false, // Ocultar las líneas de rejilla en el eje Y
                },
            },
        },
    };

    return (
        <div className="w-full h-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-6 overflow-auto" style={{ height: '250px' }}>
            {emotions ? (
                <Bar data={data} options={options} />
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-white text-lg">Cargando...</p>
                </div>
            )}
        </div>
    );
};

export default EmotionsChart;
