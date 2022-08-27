const mongoose = require("mongoose")
const Joi = require("joi")

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    tel: {
        type: String,
        required: true,
        min: 13,
        max: 13
    },
    address: {
        type: String,
        required: true,
        min: 8
    },
    orders: {
        type: Array,
        required: true
    }
})

const Orders = mongoose.model("order", orderSchema)

const orderValidate = (body)=>{
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        tel: Joi.string().required().min(13).max(13),
        address: Joi.string().required().min(8),
        orders: Joi.array().required()
    })
    return schema.validate(body)
}

exports.Orders = Orders
exports.orderValidate = orderValidate