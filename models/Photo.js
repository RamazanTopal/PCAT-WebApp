const mongoose=require("mongoose")
const { Schema } = mongoose;
const photoSchema=new Schema({
    title:String,
    description:String,
    image:String,
    date:{
        type:Date,
        default:Date.now
    }
})

const Photo=mongoose.model("Photo",photoSchema);
module.exports=Photo;