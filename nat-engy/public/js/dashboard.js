document.addEventListener('DOMContentLoaded', function() {
  // Initialize devices from local storage or use default if empty
  let devices = JSON.parse(localStorage.getItem('devices')) || {
    'My Laptop': { consumption: 100, location: 'Home Office' }
  };

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

    if (devices[newDeviceName]) {
      alert('Device already exists!');
      return;
    }

    devices[newDeviceName] = { consumption: newDeviceConsumption, location: newDeviceLocation };
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
    const totalConsumption = Object.values(devices).reduce((sum, device) => sum + device.consumption, 0);
    document.getElementById('total-consumption').textContent = totalConsumption.toFixed(2);
    document.getElementById('daily-average').textContent = (totalConsumption / 30).toFixed(2);
    document.getElementById('monthly-cost').textContent = (totalConsumption * 0.12).toFixed(2);
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

