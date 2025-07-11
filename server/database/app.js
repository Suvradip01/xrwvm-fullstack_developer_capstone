const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.raw({ type: '*/*' }));

// Load data from JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", {
  dbName: 'dealershipsDB',
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Load Mongoose models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Seed database
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error('Error seeding database:', error);
  }
})();

// ---------------------- ROUTES ----------------------

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// ✅ Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// ✅ Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: parseInt(req.params.id) });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews for dealer' });
  }
});

// ✅ Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// ✅ Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const state = req.params.state;
    const dealers = await Dealerships.find({ state: state });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// ✅ Fetch dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id);
    const dealer = await Dealerships.findOne({ id: dealerId });
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer by ID' });
  }
});

// ✅ Insert a new review
app.post('/insert_review', async (req, res) => {
  try {
    const data = JSON.parse(req.body);

    const documents = await Reviews.find().sort({ id: -1 }).limit(1);
    const new_id = documents.length ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
