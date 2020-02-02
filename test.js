const express = require('express'),
    app = express(),
    {slugify, randomString} = require('./index');

    console.log(slugify("Moses peter,-,,,` &*()oladel",true));
    

app.listen(9000,()=>console.log("Iya sunday now running "+randomString(10)))