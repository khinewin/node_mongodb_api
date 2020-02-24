const express=require('express')

const app=express();

const Route=require('./route')

const MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID; // we will use this later

MongoClient.connect('mongodb://localhost:27017', (err, db) => {
    var dbase = db.db("test");
    if (err) return console.log(err)
    app.use("/",Route(dbase))
    app.listen(3000, () => {
        console.log('app working on 3000')
    })
})

