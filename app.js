const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/mongoDB.js');
const indexRoutes = require('./routes/indexRoute.js');
const userRoutes = require('./routes/userRoute.js');
const productRoutes = require('./routes/productRoute.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

/* "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg0MTJlMWJlMzVhZGIzYTNkODBlODEiLCJpYXQiOjE3MzY3MDg4MzMsImV4cCI6MTczNjcxMjQzM30.IyGXsdzCEKx-VO_N3qUS1dsankRxHz6BNEJXh2VIg6s"*/ 

app.use('/',indexRoutes);
app.use('/user',userRoutes);
app.use('/products',productRoutes);

app.listen(3000,()=>{
    connectDB();
    console.log("Server is running on port 3000");
});
