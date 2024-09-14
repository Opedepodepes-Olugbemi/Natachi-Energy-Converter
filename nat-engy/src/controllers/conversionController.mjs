import Conversion from '../models/ConversionModel.mjs';

export const getConversionFactors = (req, res) => {
  Conversion.getConversionFactors((err, factors) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(factors);
  });
};

export const performConversion = (req, res) => {
  const { fromType, toType, value } = req.body;
  // Perform conversion logic here
  // Then add to conversion history
  Conversion.addConversionHistory({ fromType, toType, inputValue: value, outputValue: result }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ result });
  });
};

// Add more controller methods as needed
