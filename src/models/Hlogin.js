const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    hid:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true
    }
})

const hlogin = new mongoose.model("HLogin", hospitalSchema);

module.exports = hlogin;