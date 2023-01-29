const express=require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");
const userid=require(__dirname+"/id.js");
const accno=require(__dirname+"/acc_no.js");
const app=express();
const bcrypt = require("bcryptjs");



mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1/bankdb",{useNewUrlParser:true});


app.use(express.static("public"));

app.use(body_parser.urlencoded({extended:true}));


const userschema=mongoose.Schema({
    name:String,

    account_no:{
        type:Number,
        unique:true,
        min:10
    },

    email:{
        type:String,
        unique:true,
        required:true
    },

    balance:Number,
    
    user_id:{
        type:String,
        unique:true
    },
    password:String
})

const User=mongoose.model("User",userschema);

let user1=new User({
    name:"Arpit Mathur",
    account_no: 2412,
    balance:10000,
    user_id:userid.getId(),
    password:2412,
    email:"arpoarkpa@gmail.com"
})
  
let user2 =new User({
    name:"Milan patel",
    account_no: 1234,
    balance:10000,
    user_id:userid.getId(),
    password:2808,
    email:"aafa@gmail.com"

})

let defaultusers=[user1,user2];

// User.insertMany(defaultusers,(err)=>{
//     if(err){
//     console.log(err);
//     }
//     else console.log("inserted the default users");
// })


app.get("/",(req,res)=>{
    res.render("signup")
    console.log("done");
})

app.post("/",async (req,res)=>{
    let pname=req.body.Fname;
    let email=req.body.email;
    let pw=req.body.Pass;

    let salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(pw, salt);

    let user=new User({
        name:pname,
        account_no:accno.getaccno(),
        balance:200,
        user_id:userid.getId(), 
        password:secPass,
        email:email
    })
    user.save();

    res.redirect("/login")
})

app.post("/login2", (req,res)=>{

        res.redirect("/login")
        
    }
)

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async (req,res)=>{
    let name = req.body.Fname
    let email=req.body.email
    let password = req.body.Pass

    let loguser= await User.findOne({email:email})
    console.log(loguser)

    if(loguser){    
        res.redirect("/homepage")
    }
    else{ 
        console.log("error")
    }
})

app.get("/homepage",(req,res)=>{
    res.render("homepage");
})


app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/feedback",(req,res)=>{
    res.render("feedback")
})

app.get("/netbanking",(req,res)=>{
    res.render("netbanking")
})

app.post("/netbanking",async (req,res)=>{
    let sname=req.body.sname;
    let rname=req.body.rname;
    let s_acc=req.body.s_acc;
    let r_acc=req.body.r_acc;
    let amount=req.body.amount;

    let sender = await User.findOne({account_no:s_acc, name:sname})
    let receiver = await User.findOne({account_no:r_acc, name:rname})
    
        sender.balance -=amount
        receiver.balance +=amount 

        await User.updateOne({account_no:s_acc,name:sname} , {$set:{balance : sender.balance}})
        await User.updateOne({account_no:r_acc,name:rname} , {$set:{balance : receiver.balance}})
        console.log("transaction complete");
        res.redirect("/homepage")
        // }
        // else if(s_acc==r_acc){
        //     sender.balance +=amount;
        //     await User.updateOne({account_no:s_acc,name:sname} , {$set:{balance : sender.balance}})
        //     console.log("transaction complete");
        //     res.redirect("/homepage")
        // }
        // else if(s_acc<amount && s_acc!=r_acc){
        //     console.log("insufficient funds");
        //     res.redirect("/netbanking")
        // }
})


app.get("/services",(req,res)=>{
    res.render("services")
})

app.listen(3000,()=>{
    console.log("server started at port 3000");
})