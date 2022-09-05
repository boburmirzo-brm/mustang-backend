// @ts-nocheck
const express = require("express");
const router = express.Router();
const { Product, productValidate } = require("../../models/productSchema");
const auth = require("../../middleware/auth");
const fs = require("fs");
const cloudinary = require("../../cloudinary");
const uploads = require("../../multer");

// Method: GET
// Desc:   Get all Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({_id: -1});

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

router.get("/page", async (req, res) => {
  try {
    let { pageSize, pageNumber, filter } = req.query
    // const productsLength = await Product.countDocuments({})
    // const btnCount = Math.ceil(productsLength / pageSize)
    const {color, type, season, price: {from, to}} = JSON.parse(filter)

    let filterType =  type === "barchasi" ? {} : {type}
    let filterColor =  color === "barchasi" ? {} : {color}
    let filterSeason =  season === "barchasi" ? {} : {season}
    const productsSize = await Product
      .find({...filterType, ...filterColor, ...filterSeason, price: {$gte: +from, $lte: +to} })
      .countDocuments({})

    const products = await Product
        .find({...filterType, ...filterColor, ...filterSeason, price: {$gte: +from, $lte: +to} })
        .sort({_id: -1})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
    res.json({msg:"successfuly", data: { products, btnCount: Math.ceil(productsSize / pageSize) }, state: true})
  } catch (e) {
    res.json(`something went wrong: ${e}`);
  }
});


// Method: Get
// Desc:   Get one product by id
router.get("/one/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        state: false,
        msg: "not found",
        data: product,
      });
    }

    res.status(200).json({
      state: true,
      msg: "successfully found",
      data: [product],
    });
  } catch (err) {
    res.send(err);
  }
});

// Method: POST
// Desc:   Create a new product
router.post("/", auth, uploads.array("image"), async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "photos");
    let urls = [];
    if (req.files) {
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
    }

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

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body);

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

router.get('/search', async(req, res) => {
  try {
    const value = req.query.searchingValue.toLocaleLowerCase();
      const products = await (await Product.find().select({title: 1, productId: 1, urls: 1})).filter(i=> i.title.toLocaleLowerCase().includes(value) || i.productId.toLocaleLowerCase().includes(value)).filter((_, inx) => inx <= 4)

      if( !products.length ) {
          return res.json({msg: 'This product is not defined', data: products, state: false})
      }

      return res.json({msg: 'This product is defined', data: products, state: true})  
  }

  catch(e) {
      res.json(`something went wrong: ${e}`)
  }
})

router.patch("/view/:id", async(req, res)=>{
  try{
    const {id} = req.params
    const updateProductOne = await Product.findById(id)
    const updateProduct = await Product.updateOne(
      {_id: id},
      {
        $set: {
          view: updateProductOne.view + 1 
        }
      }
    );
    res.json({msg: 'This product is updated', data: updateProduct, state: true})
  }
  catch(err){
    res.json(err)
  }
})

module.exports = router;
