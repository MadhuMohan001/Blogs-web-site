import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url"; 
import pool from "./models/db.js";
import {getUser,createUser} from "./models/users.js";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

async function validateUser(user_mail,user_password){
    try{
        const user = await getUser(user_mail);
        console.log(user);
        if(!user) return false;
        return user.password === user_password;
    }catch(error){
        return false
    }
}

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/signup",(req,res)=>{
    res.render("signup")
});
app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/myposts",(req,res)=>{
    res.render("myPosts");
});
app.get("/trendposts",(req,res)=>{
    res.render("trendingPosts");
});

app.post("/login",async (req,res)=>{
    const mail = req.body.email;
    const password = req.body.password;
    if(await validateUser(mail,password)){
        res.render("home");
    }else{
        res.render("login",{error:"Invalid email or password"});
    }
});

app.post("/signup",async (req,res)=>{
    const {userName,email,password} = req.body;
    try {
        const newUser = await createUser(userName,email,password);
        console.log(newUser);
        res.render("home");
    }catch(error){
        res.render("signup",{error:"Error"})
    }
});

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}/`);
});
