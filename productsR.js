const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const chechAuth = require('./check-auth');

const Product = require('./productsM');

//handles get request
router.get('/',(req,res,next) => {

  Product.find()
  .select('name price _id')
  .exec()
  .then(docs =>{
    const resp ={
      count: docs.length,
      product: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request:{
            type: 'GET',
            url:'htttp://localhost:8000/products/' + doc._id
          }
        }
      })
    };
    res.status(200).json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});

router.post('/',checkAuth,(req,res,next) => {

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price
    });

    product.save().then(result =>{
      console.log(result);
      res.status(201).json({
          message: 'CreatedProduct successfully',
          createdProduct: {
            name: result.name,
            price:result.price,
            _id: result._id,
            request:{
                 type: 'POST',
                 url:'htttp://localhost:8000/products/' + doc._id
            }
          }
        });
    }).catch(err =>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
});


router.get('/:productId', (req,res,next) =>{

    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc =>{
      console.log("From database",doc);
      if(doc){
          res.status(200).json( {
            product:doc,
            request:{
              type:'GET',
              description:'Get all product info',
              url:'http://localhost:8000/products' + doc._id
            }
          });
      }else{
        res.status(404).json({message: 'No Valid entry'});
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error:err});
    });
});

router.patch('/:productId',checkAuth, (req,res,next) =>{
      const id = req.params.productId;
      const updateOps = {};
      for(const ops of req.body){
        updateOps[ops.propName] = ops.vale;
      }
    Product.update({_id: id} , { $set: updateOps})
    .exec()
    .then( result=> {
      console.log(result);
      res.status(200).json({
         message: 'Product Updated',
         request: {
           type:'GET',
           url:'http://localhost:8000/products/' + id
         }

      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productId',checkAuth, (req,res,next) =>{
  const id = req.params.productId;
  Product.remove({_id: id})
  .exec()
  .then(result => {
     res.status(200).json({
       message: 'Product deleted',
         request:{
           type: 'POST',
           url: 'http://localhost:8000/products',
           body:{ name : 'String', price:'Number'}
         }

     });
  }).catch(err =>{
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});



module.exports = router;
