const mongoose = require("mongoose")
const Joi = require("joi")

const adminSchema = new mongoose.Schema({
    name: String,
    owner:Boolean,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model("adminbrm", adminSchema)

const adminValidate = (body)=>{
    const schema = Joi.object({
        name: Joi.string(),
        owner: Joi.boolean(),
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(8).max(50)
    })
    return schema.validate(body)
}

exports.Admin = Admin
exports.adminValidate = adminValidate