console.log('searchDevices.mjs loaded');

document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('search-devices').addEventListener('click', function() {
        const location = document.getElementById('location-input').value;
        updateDeviceTable(location);
    });

    document.getElementById('clear-devices').addEventListener('click', function() {
        devices = {};
        saveDevicesToLocalStorage();
        updateDeviceTable();
    });
});
