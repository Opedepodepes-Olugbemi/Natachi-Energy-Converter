import db from '../database/setup_db.mjs';

class Device {
  static getAllDevices(callback) {
    db.all('SELECT * FROM devices', callback);
  }

  static addDevice(device, callback) {
    const { name, consumption, location, energySource, usageTime } = device;
    db.run(
      'INSERT INTO devices (name, consumption, location, energy_source, usage_time) VALUES (?, ?, ?, ?, ?)',
      [name, consumption, location, energySource, usageTime],
      callback
    );
  }

  static removeDevice(deviceId, callback) {
    db.run('DELETE FROM devices WHERE id = ?', [deviceId], callback);
  }

  // Add more methods as needed
}

export default Device;
