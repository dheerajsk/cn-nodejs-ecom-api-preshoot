// 1. Import Exprerss
import express from 'express';
import swagger from 'swagger-ui-express';
import dotenv from 'dotenv';

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import orderRouter from './src/features/orders/order.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
import apiDocs from './swagger.json' assert { type: 'json' };
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectDB} from './src/configs/db.js';
import { connectUsingMongoose } from './src/configs/mongoosedb.js';
import mongoose from 'mongoose';

// 2. Create Server
const server = express();

dotenv.config();

// CORS policy configuration
server.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:5500'
  );
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  // return ok for preflight request.
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(express.json());
// Bearer <token>
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use(
  '/api-docs',
  swagger.serve,
  swagger.setup(apiDocs)
);

server.use(loggerMiddleware);

server.use(
  '/api/products',
  jwtAuth,
  productRouter
);
server.use(
  '/api/cartItems',
  loggerMiddleware,
  jwtAuth,
  cartRouter
);
server.use('/api/users', userRouter);
server.use('/api/orders',jwtAuth, orderRouter);

// 3. Default request handler
server.get('/', (req, res) => {
  res.send('Welcome to Ecommerce APIs');
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log("ERRRRR")
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
  }
  else if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  
  // server errors.
  res
    .status(500)
    .send(
      'Something went wrong, please try later'
    );
});

// 4. Middleware to handle 404 requests.
server.use((req, res) => {
  res
    .status(404)
    .send(
      'API not found. Please check our documentation for more information at localhost:3200/api-docs'
    );
});

// 5. Specify port.
server.listen(3200, () => {
  console.log(`Server is running on port 3200`);
  connectDB();
  connectUsingMongoose();
});
