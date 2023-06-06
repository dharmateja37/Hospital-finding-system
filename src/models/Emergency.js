const mongoose = require("mongoose");
const emergencySchema={
    hid: String,
    name: String,
    address: String,
    paddress: String,
    Phone: String,
    time: String,
    date: String,
    hospital: String,
}
const emergency=mongoose.model('emergency',emergencySchema);
module.exports=emergency;