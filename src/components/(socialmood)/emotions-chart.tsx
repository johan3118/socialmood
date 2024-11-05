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
                    'rgba(252, 192, 39, 0.8)', // Background color for the first bar
                    'rgba(248, 108, 58, 0.8)', // Background color for the second bar
                    'rgba(48, 189, 146, 0.8)', // Background color for the third bar
                    'rgba(120, 189, 146, 0.8)', // Background color for the fourth bar
                ],
                borderColor: [
                    'rgba(252, 192, 39, 1)', // Border color for the first bar
                    'rgba(248, 108, 58, 1)', // Border color for the second bar
                    'rgba(48, 189, 146, 1)', // Border color for the third bar
                    'rgba(120, 189, 146, 1)', // Border color for the fourth bar
                ],
                borderWidth: 1, // Border width
                borderRadius: 10, // Border radius for rounded corners
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // Set the index axis to 'y' for a horizontal bar chart
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
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-64 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-[32px] p-8 overflow-auto">
            <Bar data={data} options={options} />
        </div>
    );
};

export default EmotionsChart;