const express = require("express");
const app = express();
const errorHandler=require("errorhandler")
const cors = require('cors');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";

app.use(cors({
    origin: "*"
}))

app.use(express.json());


app.use(errorHandler({dumpExceptions: true, showStack:true}))

// let tasks = []


app.get("/list_all_todo", async function (req, res) {
    try {
        // Connect the Database
        let client = await mongoClient.connect(url)

        // Select the DB
        let db = client.db("todo_app");

        // Select the collection and perform action
        let data = await db.collection("tasks").find({}).toArray();

        // Close the Connection
        client.close();

        res.json(data)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.post("/create_task", async function (req, res) {
    try {
        // Connect the Database
        let client = await mongoClient.connect(url)

        // Select the DB
        let db = client.db("todo_app")

        // Select the Collection and perform the action
        let data = await db.collection("tasks").insertOne(req.body)

        // Close the Connection
        await client.close();

        res.json({
            message: "Task Created"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }

})

app.put("/update_task/:id", async function (req, res) {
    try {
        // Connect the Database
        let client = await mongoClient.connect(url)

        // Select the DB
        let db = client.db("todo_app")

        // Select the Collection and perform the action
        let data = await db.collection("tasks")
            .findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body })

        // Close the Connection
        await client.close();

        res.json({
            message: "Task Updated"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.delete("/delete_task/:id", async function (req, res) {
    try {
        // Connect the Database
        let client = await mongoClient.connect(url)

        // Select the DB
        let db = client.db("todo_app")

        // Select the Collection and perform the action
        let data = await db.collection("tasks")
            .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) })

        // Close the Connection
        await client.close();

        res.json({
            message: "Task Deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
})

app.listen(3000, function () {
    console.log(`The app is listening in port in the number 3000`)
})

   