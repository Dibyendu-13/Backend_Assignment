require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import models
const Items = require('./models/items');
const Bills = require('./models/bills');


const app = express();
app.use(bodyParser.json());

// MongoDB Atlas Connection String with database name 'shop'
const atlasUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ccdmlvp.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB Atlas
mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Add Item to Inventory
app.post('/items', async (req, res) => {
  try {
    const item = new Items(req.body);
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Retrieve All Items
app.get('/items', async (req, res) => {
  try {
    const items = await Items.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Create a Bill
app.post('/bills', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bill = new Bills(req.body);
    await bill.save({ session });

    for (const item of bill.items) {
      const inventoryItem = await Items.findById(item.item).session(session);
      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send({ error: `Insufficient stock for item: ${inventoryItem ? inventoryItem.name : 'Unknown'}` });
      }
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).send(bill);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: error.message });
  }
});

// Retrieve All Bills
app.get('/bills', async (req, res) => {
  try {
    const bills = await Bills.find().populate('items.item');
    res.status(200).send(bills);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Details of a Specific Bill
app.get('/bills/:id', async (req, res) => {
  try {
    const bill = await Bills.findById(req.params.id).populate('items.item');
    if (!bill) {
      return res.status(404).send({ error: 'Bill not found' });
    }
    res.status(200).send(bill);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
