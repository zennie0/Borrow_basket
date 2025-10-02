const mongoose= require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); // this will automatically hash the password and username and also salt it

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
   
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

