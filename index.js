const express = require("express");
const app = express();
//const errorHandler=require("errorhandler")
const cors = require("cors");
const mongodb = require("mongodb");
const bcryptjs = require("bcryptjs");
const mongoClient = mongodb.MongoClient;
//const url ="mongodb+srv://auxilia:admin123@cluster0.bg8rf.mongodb.net?retryWrites=true&w=majority";
const url = "mongodb://localhost:27017";
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

//app.use(errorHandler({dumpExceptions: true, showStack:true}))

// let tasks = []

app.post("/register", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    //to hash the password
    let salt = bcryptjs.genSaltSync(10);
    //console.log(salt);
    let hash = bcryptjs.hashSync(req.body.password, salt);
    //console.log(hash);
    req.body.password = hash;

    // Select the collection and perform action
    let data = await db.collection("users").insertOne(req.body);

    // Close the Connection
    await client.close();

    res.json({
      message: "User Registered",
      id: data._id
    });
  } catch (error) {}
});

app.post("/login", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    //find the user with email id
    let user =await db.collection("users").findOne({ username: req.body.username });

    if (user) {
        console.log(req.body)
        console.log(user.password)
      //hash the incoming password
      //compare that password with users password
      let matchpassword = bcryptjs.compareSync(
        req.body.password,
        user.password
      );
      if (matchpassword) {
        //generate JWT token //this one passed to react application
        res.json({
          message: true
        });
      } else {
        res.status(404).json({
          message: "username/password is incorrect"
        });
      }

      //if both are correct then allow them.
    } else {
      res.status(404).json({
        message: "username/password is incorrect"
      });
    }
  } catch (error) {
      console.log(error)
  }
});

app.get("/list_all_todo", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    // Select the collection and perform action
    let data = await db.collection("tasks").find({}).toArray();

    // Close the Connection
    client.close();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

app.post("/create_task", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    // Select the Collection and perform the action
    let data = await db.collection("tasks").insertOne(req.body);

    // Close the Connection
    await client.close();

    res.json({
      message: "Task Created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

app.put("/update_task/:id", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    // Select the Collection and perform the action
    let data = await db
      .collection("tasks")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );

    // Close the Connection
    await client.close();

    res.json({
      message: "Task Updated"
    });
  }
   catch (error) {
    res.status(500).json({
      message: "Something Went Wrong"
    });
  }
});

app.delete("/delete_task/:id", async function (req, res) {
  try {
    // Connect the Database
    let client = await mongoClient.connect(url);

    // Select the DB
    let db = client.db("todo_app");

    // Select the Collection and perform the action
    let data = await db
      .collection("tasks")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });

    // Close the Connection
    await client.close();

    res.json({
      message: "Task Deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong"
    });
  }
});

app.listen(PORT, function () {
  console.log(`The app is listening in port in the number ${PORT}`);
});
//console.log(process);
