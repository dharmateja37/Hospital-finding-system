const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required:true
    }
})

const login = new mongoose.model("Login", customerSchema);

module.exports = login;