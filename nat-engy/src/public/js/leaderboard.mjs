console.log('leaderboard.mjs loaded');

import { devices } from './deviceManager.mjs';

async function fetchLeaderboardData() {
    try {
        // For now, we'll use the devices from deviceManager
        // In a real-world scenario, you'd fetch this from an API
        const sortedDevices = Object.entries(devices)
            .sort((a, b) => b[1].consumption - a[1].consumption)
            .map(([name, data]) => ({ name, ...data }));
        return sortedDevices;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
    }
}

function displayLeaderboard(leaderboardData) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    leaderboardData.forEach((device, index) => {
        const row = leaderboardBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${device.name}</td>
            <td>${device.consumption.toFixed(2)}</td>
            <td>${device.location}</td>
        `;
    });
}

async function loadLeaderboard() {
    const leaderboardData = await fetchLeaderboardData();
    displayLeaderboard(leaderboardData);
}

function setupClearLeaderboard() {
    const clearButton = document.getElementById('clear-leaderboard');
    clearButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the leaderboard?')) {
            Object.keys(devices).forEach(key => delete devices[key]);
            localStorage.removeItem('devices');
            loadLeaderboard();
        }
    });
}

window.addEventListener('load', () => {
    loadLeaderboard();
    setupClearLeaderboard();
});

export { loadLeaderboard };
