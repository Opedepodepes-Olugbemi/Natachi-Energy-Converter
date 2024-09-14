console.log('deviceManager.mjs loaded');

let devices = JSON.parse(localStorage.getItem('devices')) || {};

function saveDevicesToLocalStorage() {
  localStorage.setItem('devices', JSON.stringify(devices));
}

function updateDeviceTable(filterLocation = '') {
  const tableBody = document.querySelector('#device-table tbody');
  console.log(tableBody);
  if (!tableBody) {
    console.error('Device table body not found');
    return;
  }
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
}

function removeDevice(deviceName) {
  delete devices[deviceName];
  saveDevicesToLocalStorage();
  updateDeviceTable();
}

function addDevice(newDeviceName, newDeviceConsumption, newDeviceLocation, newDeviceEnergySource, newDeviceUsageTime) {
  if (devices[newDeviceName]) {
    return false;
  }
  devices[newDeviceName] = { 
    consumption: parseFloat(newDeviceConsumption), 
    location: newDeviceLocation, 
    energySource: newDeviceEnergySource, 
    usageTime: parseFloat(newDeviceUsageTime)
  };
  saveDevicesToLocalStorage();
  updateDeviceTable();
  return true;
}

export { devices, updateDeviceTable, removeDevice, addDevice };
