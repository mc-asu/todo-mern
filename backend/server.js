
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const todoRoutes = express.Router()
const PORT = 4000

let Todo = require('./todo.model')

//Adding middleware to the server
app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/todos',{ useNewUrlParser: true })
const connection = mongoose.connection
connection.once('open', function(){
    console.log("MongoDb database connection established successfully")
})

// todoRoutes are extending "/todos"
//first endpoint
app.get('/todos', function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    })
});

app.route('/todo/:id')

    .get(function(req, res) {
        let id = req.params.id;
        Todo.findById(id, function(err, todo) {
            if (err) {
                console.log(err);
                res.status(404, 'Todo not found!');
            } else {
                res.json(todo);
            }
        })
    })

    .delete(function(req, res) {
        let id = req.params.id;
        Todo.findByIdAndDelete(id, function(err) {
            if (!err) {
                res.sendStatus(200);
            } else {
                res.status(500).json({
                    error: err
                })
            }
        })
    });

app.route('/todo')
    .post(function(req, res) {
        let todo = new Todo(req.body);
        todo.save()
            .then( todo => {
                res.status(200).json('New todo added');
            })
            .catch( err => {
                res.status(400, 'Adding new todo failed');
            });
    })

app.route('/update/:id').post(function(req, res){
    Todo.findById(req.params.id, function(err, todo){
        if(!todo) 
            res.status(404).send('data is not found')
        else    
            todo.todo_description = req.body.todo_description
            todo.todo_responsible = req.body.todo_responsible
            todo.todo_priority = req.body.todo_priority
            todo.todo_completed = req.body.todo_completed

            todo.save().then(todo => {
                res.json('Todo updated')
            }).catch(err =>{
                res.status(400).send("Update not possible")
            })
    })
})


//inserting the router, attaching it to the urlpath "/todos"
//router is a middleware
// todoRouter is relative to our todos
// app.use('/todos', todoRoutes)

app.listen(PORT, function() {
    console.log("Server is running on PORT: "+ PORT)
})




//mongod
//mongo > use "database"
// run server with 'nodemon server'

//
// Tutorial p1: https://www.youtube.com/watch?v=qvBZevK1HPo&t
// Tutorial p2: https://www.youtube.com/watch?v=_02zK1D4brk
// Tutorial p3: https://www.youtube.com/watch?v=WT67-OETeGU
// Tutorial p4: https://www.youtube.com/watch?v=GIITXvYD7pc