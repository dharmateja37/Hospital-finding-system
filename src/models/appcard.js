const mongoose = require("mongoose");

const appSchema= {
    Firstname: String,
    Lastname: String,
    Email: String,
    Phone: String,
    date: String,
    age: String,
    timeslot: String,
    problem: String,
    hname: String,
    dname: String,
}
const appointment = mongoose.model("Appointment", appSchema);

module.exports = appointment;