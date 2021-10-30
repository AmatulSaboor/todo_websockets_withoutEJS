console.log('hi');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const {Server} = require('socket.io');
const io = new Server(http);
const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb+srv://Admin:admin123@cluster0.vzs9g.mongodb.net/TODOS?retryWrites=true&w=majority';
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

http.listen(port, () => console.log(`Example app listening at port ${port}`));
app.use(express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
io.on('connection', socket =>
{
    console.log(`${socket.id} is online`);
    // ========================================- read ==========================================================
    renderTodoList(socket);

    // ========================================== add ==========================================================
    socket.on('add', todo =>
    {
        console.log(`inside add listener`)
        console.log(todo);
        client.connect(async (err) => {
            if (err) throw err;
            const todoWSCollection = client.db('TODOS').collection('todoWSCollection');
            todoWSCollection.insertOne(todo, (err, result) => {
                if (err) throw err;
                renderTodoList(socket);    
            });
        });
    });

    // ===================================== toggle todo ======================================================
    socket.on('toggleTodo', (data) =>
    {
        console.log(`inside toggle todo listener`)
        console.log(data);
        client.connect(async (err) => {
            if (err) throw err;
            const todoWSCollection = client.db('TODOS').collection('todoWSCollection');
            todoWSCollection.updateOne({_id:new ObjectId(data.id)}, {$set: {isChecked:!data.isChecked}}, (err, result) => {
                if (err) throw err;
                renderTodoList(socket);    
            });
        });
    });
    
    // ===================================== delete todo ======================================================
    socket.on('deleteTodo', (id) =>
    {
        console.log(`inside delete todo listener`)
        console.log(id);
        client.connect(async (err) => {
            if (err) throw err;
            const todoWSCollection = client.db('TODOS').collection('todoWSCollection');
            todoWSCollection.deleteOne({_id:new ObjectId(id)}, (err, result) => {
                if (err) throw err;
                renderTodoList(socket);    
            });
        });
    });
});

/**
 * 
 * @param {*} socket 
 */
function renderTodoList(socket){
    client.connect(async (err) => {
        if (err) throw err;
        const todoWSCollection = client.db('TODOS').collection('todoWSCollection');
        const todos = await todoWSCollection.find({}).toArray();
        socket.emit('render', todos)    
    });
}