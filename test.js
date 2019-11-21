const express = require('express'),
    app = express(),
    {randomString} = require('./index');

app.listen(9000,()=>console.log("Iya sunday now running "+randomString(10)))