const socket = io('ws://localhost:3000');

// ================================= socket events and event listeners ================================
socket.on('connect', () =>
{
    socket.send('Hello server');
});

// socket.on("addResponse", data => {
//     console.log("inside add response listener");
//     for (let todo of data)
//     {
//         console.log("inside loop");
//         $("#todoRow").append(`<tr><td>${todo.id}</td><td><input type ="checkbox" ${todo.isChecked}/></td><td>${todo.name}</td></tr>`);
//     }
// });
socket.on('render', data =>
    {
        console.log(data);
        showTodosRows(data);
        console.log(`after function call`)
    }
);

// ===================================== js functions =================================================

// add
$("#addBtn").click( () => {
    console.log('inside add');
    const todo = {};
    todo.name = $("#name").val();
    todo.isChecked = false;
    socket.emit("add", todo);
});

// delete
$("#deleteIcon").on('click', (e) => {
    console.log('inside delete');
    const todoId = e;
    console.log(e);
    socket.emit("delete", {todoId});
});

// toggle checked
function toggleChecked(id, isChecked){
    console.log(id, isChecked);
}
/**
 * 
 * @param {*} data 
 */
function showTodosRows(todos){
    console.log(`inside showTodoRows`);
    const todosTable = $("#todosTable");
    for (todo of todos){
        todosTable.append(`
            <tr>
                <td><input type = "checkbox" ${todo.isChecked?'checked':''} onchange='toggleChecked(${todo.isChecked}, ${todo._id})'/></td>
                <td>${todo.name}</td>
                <td><a id="deleteIcon" class="delete"><i class="material-icons" title="">X</i></a></td>
            </tr>
        `);
    }
}