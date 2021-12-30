const mongoose = require("mongoose");

const DB = process.env.DATABASE|| "mongodb+srv://iot:2452@cluster0.f4rpj.mongodb.net/smart-irrigation-IOT?retryWrites=true&w=majoritycd";
console.log(DB);
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("connection successful");
})
.catch((err) => console.log("connection unsuccessful "+err));