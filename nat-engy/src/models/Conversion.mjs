import db from '../database/setup_db.mjs';

class Conversion {
  static getConversionFactors(callback) {
    db.all('SELECT * FROM conversion_factors', callback);
  }

  static addConversionHistory(conversion, callback) {
    const { fromType, toType, inputValue, outputValue } = conversion;
    db.run(
      'INSERT INTO conversion_history (from_type, to_type, input_value, output_value) VALUES (?, ?, ?, ?)',
      [fromType, toType, inputValue, outputValue],
      callback
    );
  }

  // Add more methods as needed
}

export default Conversion;
