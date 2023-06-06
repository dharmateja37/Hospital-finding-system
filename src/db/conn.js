const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Fahad_H_S:fahad786@cluster0.9zoziff.mongodb.net/Hospitals?retryWrites=true&w=majority"
).then(() => {
    console.log('connection successful');
}).catch((e) => {
    console.log(e);
})