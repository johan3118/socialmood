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

interface EmotionsChartProps {
    filter: any;
}

const EmotionsChart: React.FC<EmotionsChartProps> = ({ filter = {} }) => {
    const [emotions, setEmotions] = React.useState<[string, number][] | null>(null);

    // Obtener las emociones desde el backend
    const fetchEmotions = async () => {
        try {
            const emotionsData = await getEmotions(filter);
            setEmotions(emotionsData);
        } catch (error) {
            console.error("Error fetching emotions:", error);
        }
    };

    useEffect(() => {
        fetchEmotions();
    }, [filter]);

    // Mapa de colores predefinidos para cada emoción
    const emotionColors: { [key: string]: string } = {
        Alegría: '#F86A3A',       // Dorado
        Enfado: '#FF6961',       // Rojo anaranjado
        Miedo: '#422EA3',        // Rojo oscuro
        Tristeza: '#2046E1',     // Azul
        Sorpresa: '#FCC327',     // Rosa
        Asco: '#30BD92',         // Verde
        Confianza: '#FFFFFF',    // Turquesa
        Anticipación: '#D24EA6', // Naranja
    };

    // Obtener colores correspondientes para las etiquetas actuales
    const getBackgroundColors = (labels: string[]) => {
        return labels.map(label => emotionColors[label] || '#808080'); // Gris para emociones desconocidas
    };

    const data = {
        labels: emotions?.map(([emotion]) => emotion) ?? [], // Etiquetas de las emociones
        datasets: [
            {
                label: 'Emociones', // Título del dataset
                data: emotions?.map(([_, frequency]) => frequency) ?? [], // Frecuencia de cada emoción
                backgroundColor: getBackgroundColors(emotions?.map(([emotion]) => emotion) ?? []), // Colores predefinidos
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
