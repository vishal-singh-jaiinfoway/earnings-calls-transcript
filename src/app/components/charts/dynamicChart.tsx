'use client';

import {
    Bar,
    Line,
    Pie,
    Doughnut,
    Scatter,
    Bubble
} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

type ChartType =
    | 'bar'
    | 'stackedBar'
    | 'line'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'bubble';

interface ChartData {
    [key: string]: string | number;
}

interface Props {
    key: number;
    data: ChartData[];
    chartType: ChartType;
    chartTitle: string;
}

const DynamicChart = ({ data, chartType, chartTitle }: Props) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    // Safely determine the label key
    const labelKey = Object.keys(data[0]).find(
        (key) => typeof data[0][key] === 'string'
    );

    if (!labelKey) return <div>Invalid data format</div>;

    const labels = data.map((item) => item[labelKey] as string);
    const keys = Object.keys(data[0]).filter((key) => key !== labelKey);

    const chartData = {
        labels,
        datasets: keys.map((key, index) => ({
            label: key,
            data: data.map((item) => item[key] as number),
            backgroundColor: [
                'rgba(91, 44, 111, 0.2)',   // Deep Purple
                'rgba(108, 52, 131, 0.2)',  // Royal Purple
                'rgba(210, 180, 222, 0.2)', // Lavender
                'rgba(233, 30, 99, 0.2)',   // Hot Pink
                'rgba(248, 187, 208, 0.2)', // Soft Pink
                'rgba(112, 123, 124, 0.2)'  // Slate Gray
            ][index % 6],
            borderColor: [
                'rgba(91, 44, 111, 1)',   // Deep Purple
                'rgba(108, 52, 131, 1)',  // Royal Purple
                'rgba(210, 180, 222, 1)', // Lavender
                'rgba(233, 30, 99, 1)',   // Hot Pink
                'rgba(248, 187, 208, 1)', // Soft Pink
                'rgba(112, 123, 124, 1)'  // Slate Gray
            ][index % 6],
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(0, 0, 0, 0.1)',
            hoverBorderColor: '#000',
            borderRadius: 8,
            fill: true,
            tension: 0.4
        }))
    };

    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        family: 'Poppins'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: '#333',
                titleColor: '#333',
                borderWidth: 1,
                borderColor: '#ddd',
                cornerRadius: 8
            },
            title: {
                display: true,
                text: chartTitle, // <-- Add your custom title here
                color: '#333',
                font: {
                    size: 18,
                    family: 'Poppins',
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
        },

        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderColor: '#ddd'
                },
                ticks: {
                    color: '#333',
                    font: {
                        size: 12,
                        family: 'Poppins'
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderColor: '#ddd'
                },
                ticks: {
                    color: '#333',
                    font: {
                        size: 12,
                        family: 'Poppins'
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
            {chartType === 'stackedBar' && (
                <Bar
                    data={{
                        ...chartData,
                        datasets: chartData.datasets.map((dataset) => ({
                            ...dataset,
                            stack: 'stack1'
                        }))
                    }}
                    options={{
                        ...chartOptions,
                        scales: {
                            x: { stacked: true },
                            y: { stacked: true }
                        }
                    }}
                />
            )}
            {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
            {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
            {chartType === 'donut' && <Doughnut data={chartData} options={chartOptions} />}
            {chartType === 'scatter' && <Scatter data={chartData} options={chartOptions} />}
            {chartType === 'bubble' && <Bubble data={chartData} options={chartOptions} />}
        </div>
    );
};

export default DynamicChart;
