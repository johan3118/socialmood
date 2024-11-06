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

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmotionsChart = () => {

    const [emotions, setEmotions] = React.useState<[string, number][] | null>(null);

    const fetchEmotions = async () => {
        const emotions = await getEmotions();
        setEmotions(emotions);
    }

    useEffect(() => {
        fetchEmotions();
    }, []);

    const data = {
        labels: emotions?.map(([emotion, _]) => emotion) ?? [],
        datasets: [
            {
                label: 'Emociones', // Dataset label
                data: emotions?.map(([_, frequency]) => frequency) ?? [], // Data for the chart
                backgroundColor: [
                    'rgba(210, 78, 166, 0.8)', // Background color for the first bar
                    'rgba(248, 108, 58, 0.8)', // Background color for the second bar
                    'rgba(66, 46, 156, 0.8)', // Background color for the third bar
                    'rgba(120, 189, 146, 0.8)', // Background color for the fourth bar
                ],
                borderRadius: 10, // Border radius for rounded corners
            },
        ],
    };

    const options = {
        indexAxis: 'y', // Cambia el gráfico a barras horizontales
        plugins: {

            title: {
                display: true,
                text: 'Emociones', // Título del gráfico
                font: {
                    size: 16, // Tamaño de la fuente del título
                    family: 'Montserrat', // Familia de la fuente
                    weight: 'bold',
                },
                color: '#FFFFFF', // Color del título
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-4 overflow-auto" style={{height: '200px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default EmotionsChart;