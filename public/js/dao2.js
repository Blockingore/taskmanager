'use strict';

// DAO (Data Access Object) module for accessing course and exams

const sqlite = require('sqlite3');
const db = new sqlite.Database('tasks.db', (err) => {
  if (err) throw err;
});

// 6
exports.getAllTasks = function() {
  return new Promise((resolve , reject) => {
const sql = 'SELECT * FROM tasks';
    db.all(sql, (err, rows) => {
        if (err){
          reject(err) ;
          return;
        }
        resolve(rows);
      });
    });
}

// 1 ok
exports.createNewTask = function(task){
  return new Promise((resolve,reject) => {
    
    const sql = 'INSERT INTO tasks(description, important, project, deadline, completed) VALUES(?, ?, ?, DATE(?), ?)';

    db.run(sql, [task.description, 
      task.important, 
      task.project, 
      task.deadline, 
      task.completed
    ],
     (err, rows) => {
      if(err)
          reject(err);
      else
          resolve(rows);

  
    });
  });
}

// 4 ok
exports.updateTaskById = function(req){
  return new Promise( (resolve, reject) =>{

    const sql = 'UPDATE tasks SET description = ?, important = ?, privat = ?, project = ?, deadline = DATE(?),  completed = ? WHERE id = ?';
    
    db.run(sql,  [
      req.body.description,
      req.body.important,
      req.body.privat,
      req.body.project,
      req.body.deadline,
      req.body.completed,
      req.params.id
       ], (err, rows) =>{
        if(err)
          reject(err);

        resolve(rows);
       });
  });
}

// 2 ok
exports.getTaskByImportance = function(filt){

  return new Promise((resolve, reject) =>{

    const sql = 'SELECT * FROM tasks WHERE important = ?';
    db.all(sql, [filt] ,(err, rows) => {

      if (err)
         reject(err);

      resolve(rows);
    }); 
  });
}

// 3 ok
exports.getTaskById = function(idTask){

  return new Promise((resolve, reject) =>{
  
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.get(sql, [idTask] ,(err, row) => {
      
      if (err)
        reject(err);
      
      if (row) {
        resolve(row);
      }
      else{
        res.status(404).json({error : "La task non esiste"});
      }
    });
  });
  }

// 5. ok
exports.setTaskCompleteById = function(taskId){
  return new Promise((resolve, reject) => {

    const sql = 'UPDATE tasks SET completed = 1 WHERE id = ?';
    
    db.run(sql, [taskId], (err) => {
      if(err){
        reject(err);
      }
      resolve();
    });
  });
}

// 7 ok
exports.deleteTask = function (taskId){
  return new Promise((resolve, reject) => {

    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(sql, [taskId], (err, rows) =>{
        if(err){
           reject(err);
           return;
        }
        const r = this.changes;

        if(r === 0){
            resolve({error : 'Errore! Nessun cambiamento nel database'});
        }else{
            resolve(rows); 
        }
  
    });
  });  
}