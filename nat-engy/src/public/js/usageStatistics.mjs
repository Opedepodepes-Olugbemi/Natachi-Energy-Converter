console.log('usageStatistics.mjs loaded');

import { devices } from './deviceManager.mjs';

let energySourcesChart, energyConsumptionChart;

function calculateUsageStatistics() {
    const stats = Object.values(devices).reduce((acc, device) => {
        acc.totalConsumption += device.consumption;
        acc.totalUsageTime += parseFloat(device.usageTime);
        acc.energySources[device.energySource] = (acc.energySources[device.energySource] || 0) + device.consumption;
        return acc;
    }, { totalConsumption: 0, totalUsageTime: 0, energySources: {} });

    const daysInMonth = 30; // Assuming 30 days per month for simplicity
    stats.dailyAverage = stats.totalConsumption / daysInMonth;
    stats.monthlyCost = stats.totalConsumption * 0.12; // Assuming $0.12 per kWh

    return stats;
}

function updateUsageStatistics() {
    const stats = calculateUsageStatistics();

    document.getElementById('total-consumption').textContent = stats.totalConsumption.toFixed(2);
    document.getElementById('daily-average').textContent = stats.dailyAverage.toFixed(2);
    document.getElementById('monthly-cost').textContent = stats.monthlyCost.toFixed(2);
    document.getElementById('total-usage-time').textContent = stats.totalUsageTime.toFixed(1);

    const energySourcesList = document.getElementById('energy-sources-list');
    energySourcesList.innerHTML = '';
    for (const [source, consumption] of Object.entries(stats.energySources)) {
        const percentage = (consumption / stats.totalConsumption) * 100;
        const li = document.createElement('li');
        li.textContent = `${source}: ${consumption.toFixed(2)} kWh (${percentage.toFixed(1)}%)`;
        energySourcesList.appendChild(li);
    }

    updateCharts(stats);
}

function updateCharts(stats) {
    const sources = Object.keys(stats.energySources);
    const consumptions = Object.values(stats.energySources);

    if (energySourcesChart) {
        energySourcesChart.data.labels = sources;
        energySourcesChart.data.datasets[0].data = consumptions;
        energySourcesChart.update();
    } else {
        energySourcesChart = new Chart(document.getElementById('energySourcesChart'), {
            type: 'pie',
            data: {
                labels: sources,
                datasets: [{
                    data: consumptions,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Energy Sources Distribution'
                    }
                }
            }
        });
    }

    if (energyConsumptionChart) {
        energyConsumptionChart.data.labels = sources;
        energyConsumptionChart.data.datasets[0].data = consumptions;
        energyConsumptionChart.update();
    } else {
        energyConsumptionChart = new Chart(document.getElementById('energyConsumptionChart'), {
            type: 'bar',
            data: {
                labels: sources,
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: consumptions,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Consumption (kWh)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Energy Consumption by Source'
                    }
                }
            }
        });
    }
}

function init() {
    updateUsageStatistics();
    // You might want to add an event listener here if you need to update stats dynamically
    // For example: document.addEventListener('deviceUpdated', updateUsageStatistics);
}

window.addEventListener('load', init);

export { updateUsageStatistics };
