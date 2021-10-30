const socket = io('ws://localhost:3000');
socket.on('connect', () =>
{
    socket.send('Hello server');
});

socket.on('render', data =>
    {
        console.log(data);
        showTodosRows(data);
        console.log(`after function call`)
    }
);

// add button click
$("#addBtn").click( () => {
    console.log('inside add');
    const todo = {};
    todo.name = $("#name").val();
    todo.isChecked = false;
    socket.emit("add", todo);
});

/**
 * it toggles the checkbox
 * @param {number} id 
 * @param {boolean} isChecked 
 */
function toggleChecked(id, isChecked){
    console.log(id, isChecked);
    socket.emit('toggleTodo', {id, isChecked});
}

/**
 * it deletes the selected todo
 * @param {number} id 
 */
 function deleteTodo(id){
    console.log('inside delete');
    socket.emit('deleteTodo', id);
}

/**
 * it shows all the rows afte getting data from server
 * @param {object} data 
 */
function showTodosRows(todos){
    console.log(`inside showTodoRows`);
    const todosTable = $("#todosTable");
    todosTable.html('');
    for (todo of todos){
        todosTable.append(`
            <tr>
                <td><input type = "checkbox" ${todo.isChecked?'checked':''} onchange='toggleChecked("${todo._id}", ${todo.isChecked})'/></td>
                <td>${todo.name}</td>
                <td><button class = "deleteBtn" type = "submit" class="btn btn-danger" onclick='deleteTodo("${todo._id}")'><i class="material-icons">X</i></button></td>
            </tr>
        `);
    }
}