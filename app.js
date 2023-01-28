const express=require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1/bankdb",{useNewUrlParser:true});
const app=express();
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));


const userschema=mongoose.Schema({
    name:String,
    account_no:Number,
    balance:Number,
    user_id:String
})

const User=mongoose.model('User',userschema);

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})
app.post("/",(req,res)=>{
    let firstname=req.body.Fname;
    let lastname=req.body.Lname;
    let password=req.body.Pass;
    
    const user=new User({
        name:"firstname"+"lastname",
        balance:0,
        user_id:{
            type:Number,
            unique:true,
            
        }
        
    })
    
})
app.listen(3000,()=>{
    console.log("server started at port 3000");
})