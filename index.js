const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let menuData = {
  breakfast: [],
  lunch: [],
  dinner: []
};

const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json'); // Replace with your service account JSON file path
const SPREADSHEET_ID = '1bc_B31pGkYH4KRniMKwTOWr6OSPGxE6OMRjcoOfQlD8'; // Replace with your actual spreadsheet ID

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error('Error loading service account key file:', err);
  authorize(JSON.parse(content), listMajors);
});

function authorize(credentials, callback) {
  const { client_email, private_key } = credentials;
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: client_email,
      private_key: private_key,
    },
    scopes: SCOPES,
  });

  auth.getClient().then(authClient => {
    callback(authClient);
  }).catch(err => {
    console.error('Error authorizing client:', err);
  });
}

function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  const ranges = {
    breakfast: 'Breakfast!A1:A17', // Replace with your actual range for breakfast
    lunch: ['Dals!A1:A17', 'Sabzis!A1:A17'], // Replace with your actual ranges for lunch
    dinner: ['Dals!A1:A17', 'Sabzis!A1:A17', 'Specials!A1:A17', 'Pulaos!A1:A17'] // Replace with your actual ranges for dinner
  };

  // Fetch breakfast data
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: ranges.breakfast,
  }, (err, res) => {
    if (err) {
      console.error('The API returned an error for breakfast:', err);
      return;
    }
    const rows = res.data.values;
    if (rows.length) {
      console.log('Breakfast data:');
      console.log(rows);
      menuData.breakfast = rows;
    } else {
      console.log('No breakfast data found.');
    }
  });

  // Fetch lunch data
  ranges.lunch.forEach(range => {
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    }, (err, res) => {
      if (err) {
        console.error(`The API returned an error for lunch range ${range}:`, err);
        return;
      }
      const rows = res.data.values;
      if (rows.length) {
        console.log(`Lunch data for range ${range}:`);
        console.log(rows);
        menuData.lunch = menuData.lunch.concat(rows);
      } else {
        console.log(`No lunch data found for range ${range}.`);
      }
    });
  });

  // Fetch dinner data
  ranges.dinner.forEach(range => {
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    }, (err, res) => {
      if (err) {
        console.error(`The API returned an error for dinner range ${range}:`, err);
        return;
      }
      const rows = res.data.values;
      if (rows.length) {
        console.log(`Dinner data for range ${range}:`);
        console.log(rows);
        menuData.dinner = menuData.dinner.concat(rows);
      } else {
        console.log(`No dinner data found for range ${range}.`);
      }
    });
  });
}

app.get('/menu', (req, res) => {
  res.json(menuData);
});

app.get('/menu-of-the-day', (req, res) => {
  const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

  const menuOfTheDay = {
    breakfast: getRandomItem(menuData.breakfast),
    lunch: getRandomItem(menuData.lunch),
    dinner: getRandomItem(menuData.dinner)
  };

  res.json(menuOfTheDay);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});