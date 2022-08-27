const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  view: {
    type: Number,
    required: true,
  },
  urls: {
    type: Array,
  },
  productId: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("products", productSchema);

const productValidate = (body) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3),
    price: Joi.number().required(),
    desc: Joi.string().required().min(3).max(2000),
    season: Joi.string().required(),
    type: Joi.string().required(),
    color: Joi.string().required(),
    stars: Joi.number().required(),
    view: Joi.number().required(),
    urls: Joi.required(),
    productId: Joi.string().required(),
    size: Joi.string().required(),
    brand: Joi.string().required(),
  });
  return schema.validate(body);
};

exports.Product = Product;
exports.productValidate = productValidate;
