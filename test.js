const express = require('express'),
    app = express(),
    {slugify, randomString, getContent} = require('./index');

    console.log(slugify("Moses peter,-,,,` &*()oladel",true));

    getContent({
        url : "http://localhost:9200/jobs/_count",
        data : {
            "query" : {
                "term" : { "id" : 1 }
            }
        }
    }).then(res=>console.log(res)).catch(err=>console.log(err));


    
app.listen(9000,()=>console.log("Iya sunday now running "+randomString(10)))