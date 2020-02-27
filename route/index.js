const express=require('express')



module.exports=(dbase, ObjectId, jsonParser, encodeParser)=>{

    let Route=express.Router();

    Route.get("/", (req, res, next)=>{
        let ts=dbase.collection("tasks").find();
        ts.toArray((err, t)=>{
            let tasks=[];
            t.map((d)=>{
                let j={
                    task : d,
                    url: {
                        url_name : "http://localhost:3000/task/"+d._id,
                        method: "GET"
                    },
                    delete: {
                        url_name: "http://localhost:3000/task/"+d._id,
                        method: "DELETE"
                    },

                    update: {
                        url: "http://localhost:3000/task",
                        method: "PUT",
                        property: {
                            task_name: '',
                            id: '',
                            priority: ''
                        }
                    }

                }
                tasks.push(j)
            })
            res.json({tasks,  new: {
                    url: "http://localhost:3000/task",
                    method: "POST",
                    property: {
                        task_name: '', priority: ''
                    }
                },})
        })

    })

    Route.get("/task/:id", (req, res, next)=>{
        const id=req.params.id;
        let myId=ObjectId(id)
        let ts=dbase.collection("tasks").find({_id: myId})
        ts.toArray((err, t)=>{
            t.map((d)=>{
                let data={
                    task : d,
                    tasks : "http://localhost:3000",
                    delete: {
                        url_name: "http://localhost:3000/task/"+id,
                        method: "DELETE"
                    },

                    update: {
                        url: "http://localhost:3000/task",
                        method: "PUT",
                        property: {
                            task_name: '',
                            id: '',
                            priority: ''
                        }
                    }
                }
                res.json(data)
            })
        })

    });

    Route.delete("/task/:id", (req, res, next)=>{
        let id=req.params.id;
        let myId=ObjectId(id);
        let ts=dbase.collection("tasks").remove({_id: myId});
        if(ts){
            res.json({message : "The selected task have been removed."})
        }
    })

    Route.post("/task",jsonParser, encodeParser,(req, res, next)=>{
        const task_name=req.body.task_name;
        const priority=req.body.priority;
        let ts=dbase.collection("tasks").insert({
            task_name,
            priority
        })
        if(ts){
            res.json({message: "The new task have been save."})
        }
    })

    Route.put("/task", jsonParser, encodeParser, (req, res, next)=>{
        let task={
            task_name: req.body.task_name,
            priority: req.body.priority
        }

        let t=dbase.collection("tasks").update({_id: ObjectId(req.body.id)}, {$set : task})
        if(t){
            res.json({message: "The selected task have been updated."})
        }else{
            res.json({error: "Updated failed."})
        }
    })

    return Route;

}