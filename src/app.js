const express = require("express");
const axios = require("axios");
//const mongoose = require("mongoose");
const path =require("path");
const app = express();
//const router = express.Router();
//const hbs = require("hbs");
const ejs= require("ejs");
require("./db/conn");
const customer = require("./models/SignUp");
const Doctors = require("./models/Doctors");
//const login = require("./models/login");
const { json, response } = require("express");
const hospitals = require("./models/Hospitals");
const { stringify } = require("querystring");
const speciality = require("./models/Speciality");
const emergency = require("./models/Emergency");
const appo = require("./models/Appointment");
const hlogin = require("./models/Hlogin");
const category = require("./models/category");
//const appointment = require("./models/appcard");
const fast2sms = require("fast-two-sms");
require('dotenv').config();
const port=process.env.PORT || 3000;

const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const options = {format:"A4"};
app.use(bodyParser.urlencoded({extended:false}));
const fs = require("fs");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
//const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
/* app.set("view engine", "hbs"); 
app.set("views" , template_path);
hbs.registerPartials(partials_path); */

app.set("view engine", "ejs"); 
app.set("views" , template_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get("/", (req,res) => {
    res.render("index")
});

app.listen(port,() =>{
    console.log('server at '+ port);
})

// user interface webpages
app.get("/Hsearch", (req,res) =>{
    res.render('Hsearch');
})

app.get("/appcard", (req,res) =>{
    res.render('appcard');
})

app.get("/Dsearch", (req,res) =>{
    res.render('Dsearch');
})
 
app.post("/Hospitals", (req,res) => {
    hospitals.find({$text :{$search : req.body.address}},function(err,hosp) {
        res.render('Hospitals',{ list:hosp})
    })  
})

app.post("/doctors", (req,res) => {
      speciality.find({$text :{$search : req.body.value }},function(err,Doc) {
        res.render('doctors',{list:Doc})
      })
})

app.get("/Hospitals", (req,res) =>{
    res.render('Hospitals');
})

app.post("/Speciality", (req,res) => {
      speciality.find({address: req.body.Dsearch , Speciality: req.body.Speciality },function(err,spl) {
        res.render('Speciality',{list:spl})
      })
})

app.get("/Speciality", (req,res) =>{
    res.render('Speciality');
})

app.get("/doctors", (req,res) =>{
    res.render('doctors');
})

app.get("/Appointment", (req,res) =>{
    res.render('Appointment');
})

app.get("/index", (req,res) => {
        category.find({},function(err,cat) {
            res.render('index',{lis:cat})
        })
})

app.post("/login", async (req,res) => {
    
    try{
        const password = req.body.password;
        const email= req.body.email;

        const useremail= await customer.findOne({email:email});

        if(useremail.password === password){
            const token = await useremail.generateAuthToken();
            console.log(token);
            category.find({},function(err,cat) {
                res.render('index',{lis:cat})
            })
        }else{
            res.send("Invalid password");
        }

    }catch(err){
        res.status(400).send(error);
    }
})

app.get("/login", (req,res) =>{
    res.render('login');
})

app.get("/about", (req,res) =>{
    res.render('about');
})

app.get("/signup", (req,res) =>{
    res.render('signup');
})

app.post("/signup" , async (req,res) =>{

    try{
         const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){ 

            const login = new customer({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })

            const token = await login.generateAuthToken();
            res.cookie("jwt",token,{
               expires:new Date(Date.now()+30000000),
              httpOnly:true
            });
            const cust = await login.save();
            category.find({},function(err,cat) {
                res.render('index',{lis:cat})
            })
            
         }else{
            res.send("password not matching")
        } 
    }catch (error){
        res.status(400).send(error);
    }
}
)

app.post("/Appointment" , (req,res) =>{

           const dno = req.body.value;
           speciality.find({dno : dno },function(err,spl) {
            res.render('Appointment',{list:spl})
           });

})

app.post("/booked" , async (req,res) =>{

    try{
            /* const Firstname = req.body.Firstname;
            const Hospital= req.body.value2;
            const date = req.body.date;
            const Phone = req.body.Phone; */

            const hid= await speciality.findOne({Hospital: req.body.value2});

            const appointment = await new appo({
                Firstname: req.body.Firstname,
                Lastname: req.body.Lastname,
                Email: req.body.Email,
                Phone: req.body.Phone,
                Problem: req.body.Problem,
                date: req.body.date,
                age: req.body.age,
                timeslot: req.body.timeslot,
                fee: req.body.value1,
                Hospital: req.body.value2,
                dname: req.body.value,
                hid: hid.hid,
            })
            
           // const messages = 'Hi '+Firstname+', You have successfully booked an appointment at '+Hospital+' on '+date; 
           /* const API_KEY= NziramxFGXKk027lpUOH3BcJhEtMs9wLdTq1PnSv5bAW8QugCy56qQc9TOH4faoJySnvzehUx1ZkXlPC ;
            const reply = await fast2sms.sendMessage({authorization: API_KEY , message: messages , numbers : [Phone]})
            res.send(reply); */
            
/* 
const options = {
  method: 'POST',
  url: 'https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com/sms-verification-code',
  params: {phoneNumber: '6363322833', verifyCode: messages},
  headers: {
    'X-RapidAPI-Key': 'dde14e6befmsh3cbdcef76935266p1e05b8jsnb7ba36b45e5c',
    'X-RapidAPI-Host': 'telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
}); */
            const Appo  = await appointment.save();
            res.status(201).render("booked");
         }catch (error){
        res.status(400).send(error);
    }
}
)

app.get("/booked", (req,res) =>{
    res.render('booked');
})

app.post("/index", (req,res) => {
        appo.deleteOne({Phone : req.body.value },function(err) {
            res.render('deleted')
          })
})

app.post("/appcard", (req,res) => {
     appo.find({ Phone: req.body.phoneno },function(err,app) {
        res.render('appcard',{list:app})
      })
})

app.post("/emecard", (req,res) => {
    emergency.find({ Phone: req.body.phoneno },function(err,eme) {
       res.render('Emergencycard',{list:eme})
     })
})

app.get("/appcard", (req,res) =>{
    res.render('appcard');
})

app.get("/Edit", (req,res) =>{
    res.render('Edit');
})

app.get("/view1", (req,res) =>{
    res.render('view1');
})

app.get("/views", (req,res) =>{
    res.render('views');
})

app.post("/Edit" , async (req,res) =>{

    try{
           /* const appointment = new appo({
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            Email: req.body.Email,
            Phone: req.body.Phone,
            date: req.body.date,
            age: req.body.age,
            timeslot: req.body.timeslot,
            problem: req.body.problem,
            hname: req.body.hname,
            dname: req.body.dname,
        })

            const Appo  = await appointment.save(); */
            //res.status(201).render("index"); 
            appo.deleteOne({ Email: req.body.value }, function(err) {
                res.render('Appointment')
        })  
         }catch (error){
        res.status(400).send(error);
    }
}
)

/* employeeschema.pre("save",async function(next){
    if(this.isModified("password")){
         console.log('the current password is${this.password}');
         this.password=await bcrypt.hash(this.password,10);
         console.log('the current password is${this.password}');
         this.confirmpassword=undefined;
 })
    }
     next(); */

/* app.post('/view',(req,res) => {
        res.render("view",{result:req.body.view},function(err,html){
            pdf.create(html,options).toFile("./public/uploads/view.pdf",function(err,res){
            if(err)
                return console.log(err);
            else
            {
              console.log(res);
            const datafile = fs.readFileSync("./public/uploads/view.pdf");
            res.header('content-type','application/pdf');
            res.send(datafile);
            }
 } )})
}); */

app.post('/views',(req,res)=>{
    res.render('view1',{data: req.body.article,date: req.body.date,fname: req.body.fname,email: req.body.email,age: req.body.age,dname: req.body.dname,problem: req.body.problem,timeslot: req.body.timeslot,hospital: req.body.hospital,fee: req.body.fee},function(err,html){
        pdf.create(html, options).toFile('./public/uploads/views.pdf', function(err, result) {
            if (err){
                return console.log(err);
            }
             else{
            console.log(res);
            var datafile = fs.readFileSync('./public/uploads/views.pdf');
            res.header('content-type','application/pdf');
            res.send(datafile);
             }
          });
    })
})

app.get("/new_entry",(req,res) => {
    speciality.find({},function(err,spl) {
        res.render('new_entry',{list:spl})
    })
})

app.post("/deleted",(req,res) => {
    speciality.find({cno : req.body.value },function(err,spl) {
        res.render('Speciality',{list:spl})
    })
})

// Hospital interface 
app.get("/Hlogin", (req,res) =>{
    res.render('Hlogin');
})

app.post("/HLogin", async (req,res) => {
    
    try{
        const password = req.body.password;
        const hid= req.body.hospitalno;

        const user= await hlogin.findOne({hid: hid});

        if(user.password === password){
           speciality.find({hid: hid},function(err,spl) {
            res.render('hosppage',{list:spl})
        })
        }else{
            res.send("Invalid password");
        }

    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/new_entry" , async (req,res) =>{

    try{
            const special = req.body.Speciality;
            const cno = special.slice(0,3);
            const Speciality = special.slice(4);
            const Spl = await new speciality({
                dname: req.body.name,
                address: req.body.value2,
                Speciality: Speciality,
                Hospital: req.body.value,
                photo: req.body.photo,
                cno: cno,
                fee: req.body.fee,
                dno: req.body.value4,
                hid: req.body.value1,
            })
            
            const spl  = await Spl.save();
            speciality.find({ hid: req.body.value1},function(err,spl) {
                res.render('bookeddoc',{list:spl})
            })

         }catch (error){
        res.status(400).send(error);
    }
})

app.post("/deletedoctor" , async (req,res) =>{

    try{ 
            const del =  await speciality.deleteOne({ dno: req.body.doctorno });
            speciality.find({ hid: req.body.value},function(err,spl) {
                res.render('deleteddoc',{list:spl})
        })  
         }catch (error){
        res.status(400).send(error);
    }
})

app.get("/deletedoctor", (req,res) =>{
    res.render('deletedoctor');
})

app.get("/bookeddoc", (req,res) =>{
    res.render('bookeddoc');
})

app.get("/deleteddoc", (req,res) =>{
    res.render('deletedddoc');
})

app.post("/deletedoc",(req,res) => {
    const hid=req.body.value3;
    speciality.find({hid : hid },function(err,spl) {
        res.render('deletedoctor',{list:spl})
 } )
})

app.post("/viewer",(req,res) => {
    const Phone=req.body.value1;
    appo.find({Phone : Phone },function(err,app) {
        res.render('views',{list:app})
 } )
})

app.post("/hospcard", (req,res) => {
     appo.find({ hid: req.body.value},function(err,app) {
        res.render('appcard',{list:app})
      })
})

app.get("/startpage", (req,res) =>{
        res.render('startpage');
})

app.get("/hosppage", (req,res) =>{
        res.render('hosppage');
})

app.post("/newentry", (req,res) => {
         speciality.find({ hid: req.body.value},function(err,spl) {
            res.render('new_entry',{list:spl})
          })
})

app.post("/hosppage",(req,res) => {
    const hid=req.body.value;
    speciality.find({hid : hid },function(err,spl) {
        res.render('hosppage',{list:spl})
 } )
})

app.get("/Emergencybook", (req,res) =>{
    res.render('Emergencybook');
})

app.post("/Emergency" , async (req,res) =>{

    try{    
            const dt = req.body.value;
            const data = dt.split(' ');
            const time = data[1];
            const date = data[0];
            const hno =  await speciality.findOne({ address: req.body.address });
            const Eme  = new emergency({
                hid: hno.hid,
                name: req.body.name,
                address: req.body.address,
                paddress: req.body.paddress,
                Phone: req.body.Phone,
                hospital: hno.Hospital,
                time: time,
                date: date,
            })

            const Emer = await Eme.save();
            res.render('booked');

    }catch (error){
        res.status(400).send(error);
    }
}
)

app.get("/Emergencycard", (req,res) =>{
    res.render('Emergencycard');
})

app.post("/Emergencycard", (req,res) => {
    emergency.find({ hid: req.body.value},function(err,eme) {
       res.render('Emergencycard',{list:eme})
     })
})