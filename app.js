const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3200;

// MongoDB connection
mongoose.connect('mongodb+srv://audiopitara:83r593yTtqPE91L7@cluster0.1yxqn2q.mongodb.net/webhook_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a model for your data without specifying a schema
const Data = mongoose.model('Data', new mongoose.Schema({}, { strict: false }));

// Middleware to parse JSON data
app.use(express.json());

// Webhook route to receive JSON data
app.post('/webhook', async (req, res) => {
  const jsonData = req.body;
  console.log('Received JSON data:', jsonData);

  try {
    // Create a new instance of the Data model and save it to MongoDB
    const newData = new Data(jsonData);

    console.log(newData);

    await newData.save();
    console.log('Received JSON data and saved to MongoDB:', newData);
    res.status(200).json({ message: 'Data received and saved successfully' });
  } catch (err) {
    console.error('Error saving data to MongoDB:', err);
    res.status(500).json({ error: 'Data save error' });
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
