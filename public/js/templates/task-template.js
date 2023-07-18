"use strict";

function createTaskTable(){
    return `<table class = "table">
                <thead class="thead-light">
                    <tr>
                        <th>Descrizione</th> 
                        <th>Importanza</th> 
                        <th>Privato</th> 
                        <th>Progetto</th> 
                        <th>Scadenza</th> 
                        <th>Completato</th> 
                    </tr>
                </thead>
                <tbody id="my-tasks">
                </tbody>
            </table>`
}


function createTaskRow(task){
    return `<tr>
                <td>${task.description}</td>
                <td>${task.important}</td>
                <td>${task.privat}</td>
                <td>${task.project}</td>
                <td>${task.deadline.format('DD-MM-YYYY')}</td>
                <td>${task.completed}</td>
            </tr>`
}

export {createTaskRow, createTaskTable};