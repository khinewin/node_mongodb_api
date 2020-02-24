const express=require('express')



module.exports=(dbase)=>{

    let Route=express.Router();

    Route.get("/", (req, res, next)=>{
        let ts=dbase.collection("tasks").find();
        ts.toArray((err, t)=>{
            const tasks={
                tasks : t
            }
            res.json(tasks)
        })

    })

    return Route;

}