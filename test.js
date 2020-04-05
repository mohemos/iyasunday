const express = require('express'),
    app = express(),
    {encodeJwt,decodeJwt, randomString} = require('./index');

    encodeJwt({
        data : {username : "Moses", password : "peter"},
        secreteKey : "moses",
        duration : "20m"
    }).then(async token=>{
        console.log("=========result : "+token+"==============");
        const data = await decodeJwt(token,"moses");
        console.log(data);
    }).catch(err=>console.log(err));
    
app.listen(9000,()=>console.log("Iya sunday now running "+randomString(10)))