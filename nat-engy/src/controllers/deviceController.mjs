import Device from '../models/Device.mjs';

export const getAllDevices = (req, res) => {
  Device.getAllDevices((err, devices) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(devices);
  });
};

export const addDevice = (req, res) => {
  const { name, consumption, location, energySource, usageTime } = req.body;
  Device.addDevice({ name, consumption, location, energySource, usageTime }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'Device added successfully' });
  });
};

export const removeDevice = (req, res) => {
  const { id } = req.params;
  Device.removeDevice(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Device removed successfully' });
  });
};

// Add more controller methods as needed
