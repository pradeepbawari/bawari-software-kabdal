const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productsRoutes');
const checkLastUpdateRoutes = require('./routes/checkLastUpdateRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');  // Import your upload routes
const settingRoutes = require('./routes/settingRoutes');
const uploadPDFRoutes = require('./routes/uploadPDFRoutesRoutes');
const authenticate = require('./utiles/middleware');
const adminRoutes = require('./routes/adminRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Import the upload middleware
const { upload, uploadPDF } = require('./uploadImages/imageUpload'); 
const setting = require('./models/setting');

const app = express();

// CORS middleware
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

const corsOptions = {
  //origin: ['http://localhost:5173', 'http://localhost:5174'], // Ensure this matches your frontend URL
  origin: ['http://srv748278.hstgr.cloud:5000'], // Ensure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers you need
  credentials: true, // If you're passing cookies or tokens, this is necessary
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes


// Set the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the multer upload middleware
const createUpload = upload.array('images', 10); 
const createUploadPDF = uploadPDF.single('pdf'); 

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/users', authenticate, userRoutes);
app.use('/api/dealers', authenticate, dealerRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/products', authenticate, productsRoutes);
app.use('/api/data', authenticate, checkLastUpdateRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/invoice', authenticate, invoiceRoutes);
app.use('/api/search', authenticate, searchRoutes);
app.use('/api/setting', authenticate, createUpload, settingRoutes);
app.use('/api/comments', authenticate, commentRoutes);

// File upload route
app.use('/api/upload', authenticate, createUpload, uploadRoutes);  // Apply upload middleware to the '/upload' route
app.use('/api/invoice', authenticate, createUploadPDF, uploadPDFRoutes); 

// Test DB Connection
db.sequelize
  .authenticate()
  .then(() => console.log('Database connected bawari...'))
  .catch((err) => console.log('Error: ' + err));

// Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

