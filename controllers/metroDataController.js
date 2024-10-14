const Template = require('../models/metroDataModel');

const fs = require('fs');
const path = require('path');

// Assuming the metroData.json is in the 'data' folder at the root of your project
const filePath = path.join(__dirname, '../data/metroData.json');

exports.getMetroData = (req, res) => {
  try {
    // Read the file synchronously or asynchronously
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return res.status(500).json({ message: 'Error retrieving metro data' });
      }

      // Parse the data into JSON and send it as a response
      const metroData = JSON.parse(data);
      res.status(200).json({
        message: 'Metro data retrieved successfully',
        data: metroData,
      });
    });
  } catch (error) {
    console.error('Error retrieving metro data:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
