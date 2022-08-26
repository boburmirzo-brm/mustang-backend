const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")

router.get("/", [auth, admin], async(req, res)=>{
    res.send("Lorem ipsum dolor")
})

module.exports = router