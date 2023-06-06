const mongoose = require("mongoose");
const catSchema={
    category:String,
    info:String,
    photo:String,
    cno:String,
}
const category=mongoose.model('category',catSchema);
module.exports=category;