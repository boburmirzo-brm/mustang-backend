const jwt = require("jsonwebtoken")
require("dotenv/config")

module.exports = function  auth(req, res, next){
    const token = req.header("token")
    if(!token){
        return res.json({msg:"Token is not defined", state: false})
    }
    try{
        const decoded = jwt.verify(token, process.env.private_key)
        req.isOwner = decoded
        next()
    }
    catch{
        return res.json({msg: "Invalid token", state: false})
    }

}
