const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'listings.json');

app.use(cors());
app.use(express.json());

// Load listings from file or start empty
let listings = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE);
    listings = JSON.parse(data);
  } catch (err) {
    console.error('Error reading listings file:', err);
    listings = [];
  }
}

// Endpoint to get all listings
app.get('/listings', (req, res) => {
  res.json(listings);
});

// Endpoint to add a new listing
app.post('/listings', (req, res) => {
  const { price, itemName, world } = req.body;
  if (!price || !itemName || !world) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const newListing = {
    id: Date.now(),
    price,
    itemName,
    world
  };

  listings.push(newListing);

  // Save to file
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(listings, null, 2));
  } catch (err) {
    console.error('Error writing listings file:', err);
    return res.status(500).json({ error: 'Failed to save listing' });
  }

  res.status(201).json(newListing);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});



