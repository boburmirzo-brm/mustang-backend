const express = require("express")
const router = express.Router()
const {Orders, orderValidate } = require("../../models/orderSchema")
const auth = require("../../middleware/auth")

router.get('/', async(req, res) => {
    try {
        const orders = await Orders.find()

        if( !orders.length ) {
            return res.json({msg: 'Orders is empty.', orders: orders, state: false})
        }

        res.json({msg: 'Orders.', orders: orders, state: true})
    }

    catch(err) {
        res.json('Something went wrong.')
    }
})

router.post("/", async(req, res)=>{
        const { error } = orderValidate(req.body)
        if( error ){
            return res.json({msg: error.details[0].message, order: {}, state: false} )
        }
        const { name, tel, address, orders } = req.body;
        const newOrder = await Orders.create({ name, tel, address, orders })
        
        const savedOrder = await newOrder.save()
        res.json({msg: "Successfully saved", order: savedOrder, state: true})
})

router.delete('/delete/:id', async(req, res) => {
    try {
        const deleteOrder = await Orders.findByIdAndRemove(req.params.id)
        res.json({
            msg: 'Order was deleted',
            order: deleteOrder,
            state: true
        })
    }

    catch(err) {
        res.json('err')
    }
})

module.exports = router