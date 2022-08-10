const express = require("express");
const app = express();



app.get('/', async(req,res)=> {
    res.send('App is running perfectly!')
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
