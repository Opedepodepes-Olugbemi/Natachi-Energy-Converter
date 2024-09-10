document.addEventListener('DOMContentLoaded', function() {
  // Initialize devices from local storage or use default if empty
  let devices = JSON.parse(localStorage.getItem('devices')) || {};

  function saveDevicesToLocalStorage() {
    localStorage.setItem('devices', JSON.stringify(devices));
  }

  function updateDeviceTable(filterLocation = '') {
    console.log("Updating device table with filter:", filterLocation);
    const tableBody = document.querySelector('#device-table tbody');
    tableBody.innerHTML = '';
    Object.entries(devices)
      .filter(([_, data]) => filterLocation === '' || data.location.toLowerCase().includes(filterLocation.toLowerCase()))
      .forEach(([device, data]) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${device}</td>
          <td>${data.consumption.toFixed(2)}</td>
          <td>${data.location}</td>
          <td>${data.energySource}</td>
          <td>${data.usageTime}</td>
          <td>
            <button class="remove-device" data-device="${device}">Remove</button>
          </td>
        `;
      });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-device').forEach(button => {
      button.addEventListener('click', function() {
        const deviceToRemove = this.getAttribute('data-device');
        removeDevice(deviceToRemove);
      });
    });
    console.log("Device table updated");
  }

  function removeDevice(deviceName) {
    if (confirm(`Are you sure you want to remove ${deviceName}?`)) {
      delete devices[deviceName];
      saveDevicesToLocalStorage();
      updateDeviceTable();
      updateDeviceLeaderboard();
      updateUsageStatistics();
      alert(`${deviceName} has been removed.`);
    }
  }

  function searchDevices() {
    const query = document.getElementById('location-input').value.toLowerCase();
    console.log("Searching devices with query:", query);
    updateDeviceTable(query);
  }

  document.getElementById('search-devices').addEventListener('click', function(e) {
    e.preventDefault();
    console.log("Search button clicked");
    searchDevices();
  });

  document.getElementById('new-device-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newDeviceName = document.getElementById('new-device-name').value;
    const newDeviceConsumption = parseFloat(document.getElementById('new-device-consumption').value);
    const newDeviceLocation = document.getElementById('new-device-location').value;
    const newDeviceEnergySource = document.getElementById('new-device-energy-source').value;
    const newDeviceUsageTime = document.getElementById('new-device-usage-time').value;

    if (devices[newDeviceName]) {
      alert('Device already exists!');
      return;
    }

    devices[newDeviceName] = { consumption: newDeviceConsumption, location: newDeviceLocation, energySource: newDeviceEnergySource, usageTime: newDeviceUsageTime };
    saveDevicesToLocalStorage();
    updateDeviceTable();
    updateDeviceLeaderboard();
    updateUsageStatistics();
    alert('New device added successfully!');

    this.reset();
  });

  function updateDeviceLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    Object.entries(devices)
      .sort((a, b) => b[1].consumption - a[1].consumption)
      .forEach(([device, data]) => {
        const li = document.createElement('li');
        li.textContent = `${device} (${data.location}): ${data.consumption.toFixed(2)} kWh`;
        leaderboardList.appendChild(li);
      });
  }

  function updateUsageStatistics() {
    const stats = Object.values(devices).reduce((acc, device) => {
      acc.totalConsumption += device.consumption;
      acc.totalUsageTime += parseFloat(device.usageTime);
      acc.energySources[device.energySource] = (acc.energySources[device.energySource] || 0) + device.consumption;
      return acc;
    }, { totalConsumption: 0, totalUsageTime: 0, energySources: {} });

    document.getElementById('total-consumption').textContent = stats.totalConsumption.toFixed(2);
    document.getElementById('daily-average').textContent = (stats.totalConsumption / 30).toFixed(2);
    document.getElementById('monthly-cost').textContent = (stats.totalConsumption * 0.12).toFixed(2);
    document.getElementById('total-usage-time').textContent = stats.totalUsageTime.toFixed(2);

    const energySourcesList = document.getElementById('energy-sources-list');
    energySourcesList.innerHTML = '';
    for (const [source, consumption] of Object.entries(stats.energySources)) {
      const li = document.createElement('li');
      li.textContent = `${source}: ${consumption.toFixed(2)} kWh`;
      energySourcesList.appendChild(li);
    }
  }

  function clearLeaderboard() {
    devices = {};
    saveDevicesToLocalStorage();
    updateDeviceTable();
    updateDeviceLeaderboard();
    updateUsageStatistics();
    alert('Leaderboard and all devices have been cleared.');
  }

  document.getElementById('clear-leaderboard').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the leaderboard? This will remove all devices.')) {
      clearLeaderboard();
    }
  });

  // Initial updates
  updateDeviceTable();
  updateDeviceLeaderboard();
  updateUsageStatistics();
});

