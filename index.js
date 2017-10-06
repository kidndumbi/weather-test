const express = require("express");

const app = express();



const PORT = process.env.PORT || 4119
app.listen(PORT, () => {
   
    console.log(`connected to port ${PORT}`)

});