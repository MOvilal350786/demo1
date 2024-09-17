const mongoose = require("mongoose");

// mongoose.connect("`mongodb+srv://movilal893:bXjcDv6S6NVyjU5V@cluster0.ibrtp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`"
// );
const PORT=process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("mongodb is connected"));

const plm = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
  fullname: String,
  username: String,
  password: String,
  email: String,
  profileImage: String,
  

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
