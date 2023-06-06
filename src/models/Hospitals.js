const mongoose = require("mongoose");

const hospSchema = {
    name: String,
    address: String,
    photo: String,
    phoneno: String,
    hid: String,
    link: String
}

const hospitals = mongoose.model("Bangalore", hospSchema);

module.exports = hospitals;