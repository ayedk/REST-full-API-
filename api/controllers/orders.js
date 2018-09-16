const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');






exports.orders_get_all =  (req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product, name')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc=>{
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
};

exports.orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if (!product){
            return res.status(404).json({
                message:'product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result=>{
        res.status(200).json({
            message: 'order stored',
            createdOrder:{
                _id: result._id,
                product: result.product,
                quantity:result.quantity
            },
            request:{
                type: 'Get',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
};


exports.orders_get_order = (req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:'Order not found'
            });
        }
        res.status(200).json({
            order: order,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders'
            }
        });
    })
    .catch(err=>{
        res.etatus(500).json({
            error: err
        });
    })
};

exports.orders_delete_order =  (req,res,next)=>{
    Order.remove({_id: req.params.orderId })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'order deleted',
            request:{
                type:"POST",
                url:'http://localhost:4200/orders',
                body:{ product:'ID', quantity:'Number'}
            }
        });
    })    
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
}