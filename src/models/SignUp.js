const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token: {
        type: String,
        required: true
    }}]
})

customerSchema.methods.generateAuthToken = async function(){
try{
    console.log(this._id);
    const token = jwt.sign({_id:this._id.toString()},"mynameisvinodbahadurthapayoutuber")
    this.tokens=this.tokens.concat({token:token})
    await this.save();
    return token;
}catch(error){
    res.send("the error part"+error);
    console.log("the error part"+error);
}
}

const customer = new mongoose.model("Login", customerSchema);

module.exports = customer;