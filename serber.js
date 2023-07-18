//import 
const express = require('express');
const { check, validationResult} = require('express-validator');
const morgan = require('morgan');
const dao =  require('./public/js/dao2');
const path =  require('path');


//init
const app = express();

const port = 3000;

//set up dei middleware  tiny -> la più compatta
app.use(morgan('tiny'));

app.use(express.json());

app.use(express.static('public'));

//app.get('/', (req,res) => res.redirect('/index.html'));


// 1 Creare un nuovo task, fornendo tutte le informazioni rilevanti (eccetto l’id).
//post di tasks
app.post('/tasks', (req, res) => {
 
    const task = {
        description : req.body.description,
        important : req.body.important,
        privat : req.body.privat,
        project : req.body.project,
        deadline : req.body.dealdline,
        completed : req.body.completed
    }
dao.createNewTask(task)
    .then((result) => res.status(201).header('Location', `/tasks/${result}`).end())
    .catch((err) => res.status(503).json({ error: 'Database error during the creation'}));
  });

// POST /tasks
// Create a new task
// Request body: { "code": "MF0162", "score": 30, "date": "2020-05-15" }
// Response body: empty (but set the relative path of the new item in the location header)

app.post('/tasks', [
  check('important').isInt({min: 0, max: 1}),
  check('completed').isInt({min: 0, max: 1}),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const task = {
        description: req.body.description,
        important: req.body.important,
        privat: req.body.privat,
        project: req.body.project,
        deadline: req.body.deadline,
        completed: req.body.completed
  };
  dao.createTask(task)
  .then((result) => res.status(201).header('Location', `/tasks/${result}`).end())
  .catch((err) => res.status(503).json({ error: 'Database error during the creation'}));
});


// 2 Recuperare un singolo task, dato important. OK
app.get('/tasks/importance/:filt', (req, res) => {
    const filt = req.params.filt;
    dao.getTaskByImportance(filt)
    .then((result) =>{
        res.json(result);
    }).catch((error) => {
        res.status(500).json({error : 'Database error during creation'});
    });
});

// 3 Recuperare un singolo task, dato il suo id. OK
app.get('/tasks/id/:id', (req, res) => {
    const idTask = req.params.id;

    dao.getTaskById(idTask)
    .then((result) =>{
        res.json(result);
    }).catch((error) =>{
        res.status(503).json({error : 'Task non trovato'});
    });
  
});

/* 4 • Aggiornare un task esistente, fornendo tutte le informazioni rilevanti (tutte le proprietà tranne l’id
sovrascriveranno le proprietà correnti del task esistente con lo stesso ‘id’).*/
// OK
app.put('/tasks/:id', (req, res) => {
    dao.updateTaskById(req)
    .then((result) => {
        res.status(201).header(`Location`,`/tasks/${result}`).end();
    }).catch((error) => { res.status(503).json({error:'Database error during creation'});
 });
});

// 7 cancellare un task dato il suo id
app.delete('/tasks/:id', (req, res) =>{
    const taskId = req.params.id;
    dao.deleteTask(taskId)
    .then((result) => {
        res.status(201).header(`Location`, `/tasks/${result}`).end();
    })
    .catch((error) => {res.status(503).json({error : 'Database error during creation'})})
});

// 5 segnare un task completato tramite id
app.put('/tasks/:id/completed', (req,res)=>{
    const taskId = req.params.id;
    dao.setTaskCompleteById(taskId)
    .then((result) => {
            res.status(201).header(`Location`,`/tasks/${result}`).end()
    }).catch((error) => { res.status(503).json({error:'Database error during creation'})
    
    });
});


// 6 Recuperare tutte le tasks CON DAO
app.get('/api/tasks', (req, res) => {
    dao.getAllTasks()
    .then((tasks) =>{
        res.json(tasks);
    }).catch(() =>{
        res.status(500).end();
        });
    });

// 6 Recuperare tutte le tasks CON DAO
app.get('*', function(req, res) {
    // __dirname => variabile speciale di node.js che indica il percorso assoluto della directory del file corrente
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});




//start the server
app.listen(port, () =>
console.log(`SerBer listening at http://localhost:${port}`)
);



/* {"id": "10", "description": "farsi un tic", "privat": "0", 
"important": "1", "project": "Personal", "deadline": "2023-07-21 16:20:00",
"completed": "0"}
*/
