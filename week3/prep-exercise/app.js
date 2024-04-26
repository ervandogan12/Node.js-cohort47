import express from "express";
// Use below import statement for importing middlewares from users.js for your routes
import { register, login, getProfile, logout } from "./users.js";

let app = express();

app.use(express.json());
// Create routes here, e.g. app.post("/register", .......)
app.post("/register", (req, res)=>{
  register(req,res)
})

app.post("/login", (req, res)=>{
  login(req,res)
})
app.get('/profile', (req, res)=>{
  getProfile(req,res)
})
app.post('/logout', (req, res)=>{
  logout(req,res)
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
