// @ts-nocheck
const express = require("express");
const router = express.Router();
const { Product, productValidate } = require("../../models/productSchema");
const auth = require("../../middleware/auth");

// Method: GET
// Desc:   Get all Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    // checking
    if (!products.length) {
      return res.status(404).json({
        state: false,
        msg: "not found",
        data: products,
      });
    }

    res.status(200).json({
      state: true,
      msg: "successfully found",
      data: products,
    });
  } catch (e) {
    res.json(`something went wrong: ${e}`);
  }
});

// Method: POST
// Desc:   Create a new product
router.post("/", auth, async (req, res) => {
  try {
    const { body } = req;
    const { error } = productValidate(body);

    // checking
    if (error) {
      return res.status(400).json({
        state: false,
        msg: error.details[0].message,
        data: [],
      });
    }

    let {
      title,
      price,
      desc,
      season,
      type,
      color,
      stars,
      view,
      urls,
      productId,
      size,
      brand,
    } = body;

    const newProduct = await Product.create({
      title,
      price,
      desc,
      season,
      type,
      color,
      stars,
      view,
      urls,
      productId,
      size,
      brand,
    });

    // checking
    if (!newProduct) {
      return res.status(400).json({
        state: false,
        msg: "can not create",
        data: newProduct,
      });
    }

    const savedProduct = await newProduct.save();
    // checking
    if (!savedProduct) {
      return res.status(400).json({
        state: false,
        msg: "can not saved",
        data: savedProduct,
      });
    }

    res.status(201).json({
      state: true,
      msg: "successfully created",
      data: savedProduct,
    });
  } catch (e) {
    res.json(`something went wrong: ${e}`);
  }
});

// Method: DELETE
// Desc:   Remove a product by id (params)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const removedProduct = await Product.findByIdAndDelete(id);

    // checking
    if (!removedProduct) {
      return res.status(404).json({
        state: false,
        msg: "not found",
        data: [],
      });
    }

    res.status(200).json({
      state: true,
      msg: "successfully deleted",
      data: removedProduct,
    });
  } catch (e) {
    res.json(`something went wrong: ${e}`);
  }
});

// Method: PUT
// Desc:   Update a product by id (params)

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      price,
      desc,
      season,
      type,
      color,
      stars,
      view,
      urls,
      productId,
      size,
      brand,
    } = req.body;

    const updatedProduct = await Products.findByIdAndUpdate(id, {
      title,
      price,
      desc,
      season,
      type,
      color,
      stars,
      view,
      urls,
      productId,
      size,
      brand,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        state: false,
        msg: "not found",
        data: [],
      });
    }

    res.status(200).json({
      state: true,
      msg: "successfully updated",
      data: updatedProduct,
    });
  } catch (e) {
    res.json(`something went wrong: ${e}`);
  }
});

module.exports = router;
