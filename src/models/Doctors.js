const mongoose = require("mongoose");
const speciality = require("./Speciality");

const DocSchema = {
    hid : String,
    name: String,
    hname : String,
    haddress : String,
    hphone : String,
    link: String,
    dname: String,
    Speciality: String,
    photo: String,
    docname1: String,
    Speciality1: String,
    photo1: String,
    docname2: String,
    Speciality2: String,
    photo2: String,
    docname3: String,
    Speciality3: String,
    photo3: String,
    docname4: String,
    Speciality4: String,
    photo4: String,
}

const Doctors = mongoose.model("Doctor", DocSchema);
Doctors.aggregate([
    {
        $lookup:{
                            from:"speciality",
                            localField:"hid",
                            foreignField:"hid",
                            as: "doctors"
        }                         
    }])

module.exports = Doctors;