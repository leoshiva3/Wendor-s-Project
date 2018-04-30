const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//variables  for products and orders handler
const productRoutes = require('./productsR');
const orderRoutes = require('./ordersR');
const userRoutes = require('./userR');

mongoose.connect('mongodb+srv://shop-admin:'+
process.env.MONGO_ATLAS_PW +
'@node-shop-rest-tk30h.mongodb.net/test',
  {
     useMongoClient:true

  }
);
mongoose.Promise = global.Promise;

//morgan middleware for log
app.use(morgan('dev'));

//Body parser to parse  body of json and url encoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//To solve cors
app.use((req,res,next) => {
   res.header("Access-Control-Allow-Origin" ,"*");
   res.header(
     "Access-Control-Allow-Headers" ,
     "Origin , X-Requested-With , Content-Type,Accept,Authoriazation"
   );

   if(req.method === 'OPTIONS') {
     res.header('Access-Control-Allow-Methods',
      'PUT,POST,PATCH,DELETE,GET,POST');
      return res.status(200).json({});

   }
});


//Routers which handles requests
app.use('/products' , productRoutes);
app.use('/orders' ,orderRoutes);
app.use('/user',userRoutes);



//Catch Error if none of the rquests are handled
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handling the caught error
app.use((error,req,res,next) => {
   res.status(error.status || 500)
   res.json({
     error: {
       message:error.message
     }
   });

});


//exports this module to others
module.exports = app;
