const express = require('express'),
    app = express(),
    {randomString,fileExists,deleteFile} = require('./index');

    (async()=>{
        const a = await deleteFile('./mm.txt');
        console.log("==============",a)
    })();
    console.log("moses")

app.listen(9000,()=>console.log("Iya sunday now running "+randomString(10)))