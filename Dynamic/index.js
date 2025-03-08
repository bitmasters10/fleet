const express=require("express")
const app=express()
const path=require("path")
const port=3001;




const {Server}=require("socket.io")
const {createServer}=require("http")


const server = new createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost/usersite/views/dashboard.php","*"], // Use an array
      methods: ["GET", "POST"]
    }
  });
  
io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("room",(room)=>{
        socket.join(room)
        console.log(room);
    })
    socket.on("loc",(data)=>{
       
        socket.to(data.room).emit("otherloc", data);
        console.log(data);
    })
})


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"/public")))

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/pranv",(req,res)=>{
    res.render("prnav")
})


server.listen(port,()=>{
console.log(`server running on http://localhost:${port}`);
})