const mongoose = require("mongoose");

const splSchema={
    hid: String,
    dname:String,
    Speciality:String,
    address:String,
    dno: String,
    cno: String,
    photo:String,
    phone:String,
    fee:String,
    Hospital:String,
    hname: String,
    haddress: String,
}

const speciality = mongoose.model('speciality',splSchema);

module.exports = speciality;