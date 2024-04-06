const mongoose = require("mongoose");

const internshipmodel = new mongoose.Schema(
  {
    students: [{
      type:mongoose.Schema.Types.ObjectId,ref:"student"
  }],
    employe: {
      type:mongoose.Schema.Types.ObjectId,ref:"employe"
  },
    profile:String,
    skills:String,
    internshiptype: {
        type:String,
        enum:["In office","Remote"]
    },
    openings:Number,
    from:String,
    to:String,
    duration:String,
    responsibility:String,
    stipend:{
        status:{
            type:String,
            enum:["Fixed","Negotiable","Performance Based","unpaid"]
        },
        amount:Number,
    },
    perks:String,
    assesments:String,
  });
  
const internship = mongoose.model("internship", internshipmodel);
module.exports = internship;
