// server.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS
const app = express();
const { products } = require('./data');

// Enable CORS for all routes (optional if frontend is served from the same server)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Home Route (Serves index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get All Products (Including 'price')
app.get('/api/products', (req, res) => {
  const newProducts = products.map(({ id, name, image, price }) => ({
    id,
    name,
    image,
    price, // Ensure 'price' is included
  }));
  res.json(newProducts);
});

// Get Single Product by ID
app.get('/api/products/:productID', (req, res) => {
  const { productID } = req.params;
  const singleProduct = products.find(
    (product) => product.id === Number(productID)
  );

  if (!singleProduct) {
    return res.status(404).send('Product Does Not Exist');
  }

  res.json(singleProduct);
});

// Search Products
app.get('/api/v1/query', (req, res) => {
  const { search, limit } = req.query;
  let sortedProducts = [...products];

  if (search) {
    sortedProducts = sortedProducts.filter((product) =>
      product.name.toLowerCase().startsWith(search.toLowerCase())
    );
  }

  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
  }

  if (sortedProducts.length < 1) {
    return res.status(200).json([]);
  }

  res.status(200).json(sortedProducts);
});

// 404 Route for Undefined Paths
app.all('*', (req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}....`);
});
