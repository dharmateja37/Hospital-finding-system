const mongoose = require("mongoose");

/* const appoSchema = new mongoose.Schema({
    Firstname: {
        type: String,
    },
    Lastname: {
        type: String,
    },
    Email: {
        type: String,
        unique: true
    },
    Phone: {
        type: String,
    },
    age: {
        type: String,
    },
    date: {
        type: String,
    },
    timeslot: {
        type: String,
    },
    problem: {
        type: String,
    },
    hname: {
        type: String,
    },
    dname: {
        type: String,
    },
}) */

const appSchema= {
    /* _id:mongoose.Schema.Types.ObjectId, */
    Firstname: String,
    Lastname: String,
    Email: String,
    Phone: String,
    date: String,
    Problem: String,
    age: String,
    timeslot: String,
    fee: String,
    Hospital: String,
    dname: String,
    dno: String,
    hid: String,
}

const appo = new mongoose.model("Appointment", appSchema);

module.exports = appo;