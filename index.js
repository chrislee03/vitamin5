const express = require('express');
const fs = require('fs');
const port = 3000;
const app = express();

app.use(express.json());
let todos = [];


// GET /todos: Retrieves all to-do items
app.get('/todos', (req, res) => {
    try {
        res.json(todos);
     } catch (error) {
        next(error);
     }
});

app.get('/todos/:id', (req, res) => {
    try{ 
        const {id} = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        res.json(todo);
    } catch(error) { 
        next(error);
    }
})

// POST /todos: Adds a new to-do item
app.post('/todos', (req, res) => {
    try {
        const {task} = req.body;
        if (!task || task.trim() === "") { 
            return res.status(401).json({error: "Cannot publish empty task"});
        }
        const newTodo = {id: todos.length + 1, task};
        todos.push(newTodo);
        res.status(201).json(newTodo); //responds with the newly created todo
    } catch (error) { 
        next(error);
    }
})

//PUT / todos: Updates existing - to-do item
app.put('/todos/:id', (req, res) => {
    try { 
        const {id} = req.params;
        const {task} = req.body;
        const todo = todos.find((t) => t.id === parseInt(id));
        
        if (todo) { 
            todo.task = task;
            res.json(todo);
        } else { 
            res.status(404).send('To-do item not found');
        }
    }
    catch (error) {
        next(error);
    }
})


//DELETE /todo: Deletes a to-do item
app.delete('/todos/:id', (req, res) => {
    try { 
        const {id} = req.params;
        todos.filter((t) => t.id !== parseInt(id));
        res.status(204).send('Deleted Todo');
    } catch (error) {
        next(error);
    }
})

//global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "An unexpected error occured",
        message: err.message
    })
})



app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
})