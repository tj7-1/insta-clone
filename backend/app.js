const express= require('express');
const app=express();

const port=process.env.PORT || 7000;

const mongoose=require('mongoose');
const {MONGOOSEKEY} = require('./keys');
mongoose.connect(MONGOOSEKEY,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoose");
});
mongoose.connection.on('error',(err)=>{
    console.log("connected to mongoose",err);
});

require('./schemas/user');
require('./schemas/post');

app.use(express.json());

app.use(require('./router/auth'));
app.use(require('./router/post'));
app.use(require('./router/user'));

// if(process.env.NODE_ENV=="production"){
//     app.use(express.static('frontend/build'))     //static means our javascript and html file
//     const path=require('path')
//     app.get("*",(req,res)=>{        //* means if client make any request we'll send the index.html file in build which includes entire react application.
//         res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
//     })
// }

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})
