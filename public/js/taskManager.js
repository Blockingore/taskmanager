import Task from "./task.js";

class TaskManager{
    
    constructor (){
        this.tasks = [];
    }
/*
    addTask(task){
        return new Promise((resolve, reject) => {
            fetch('/tasks', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task), //stringify remove undefined fields 
            }).then((response) => {
            if(response.ok){
                resolve(null);
            }else{
                //analyze the cause of error
                response.json()
                .then((obj) => { reject(obj); }) // error message in response body
                .catch((err) => {reject({errors: [{ param : "Application", msg : "Cannot parse server response"}] } ) }); //something else  
            }
            }).catch((err) => {reject({errors : [{param : "Server", msg: "Cannot communicate"}] }) });
        });
    }
    */

      async getPassedTasks(){
        
        let response = await fetch('/api/tasks');
        const tasksJson = await response.json();

        if(response.ok){
            this.tasks = tasksJson.map( (tsk) => Task.from(tsk));
        }else{ 
            throw tasksJson;
        }
        return this.tasks;
    }

    async getTask(){
        let response = await fetch('/api/tasks');
        const taskJson = await response.json();
        if(response.ok){
            return taskJson;
        }
        else{
            throw taskJson;
        }
    }

    getByImportance(){
        return this.tasks.filter(element => element.important.toLowerCase() === 'si'.toLowerCase());
    }

    getByExpired(){
        return this.tasks.filter(element => element.deadline._i === moment().format('DD-MM-YYYY'));
    }
        
    getBy7Days(){
        return this.tasks.filter(element => element.deadline.isBetween(moment(), moment().add(7,'days')));
    }

    getByPrivate(){
        return this.tasks.filter(element => element.privat.toLowerCase() === 'privato');
    }

    getByShare(){
        return this.tasks.filter(element => element.privat.toLowerCase() === 'condiviso');
    }


}

export default TaskManager;


/*
new Task("Tanjiro", "NO", moment("12-07-2023", "DD-MM-YYYY"), "condiviso"),
new Task("Inosuke", "Si", moment("02-07-2023", "DD-MM-YYYY"), "privato"),
new Task("Muichiro", "no", moment("04-07-2023", "DD-MM-YYYY"),"privato"),
new Task("Zenitsu", "Si", moment("20-07-2023", "DD-MM-YYYY"), "privato"),
new Task("Tomioka", "No", moment("05-07-2023", "DD-MM-YYYY"), "condiviso"),
new Task("Akaza",   "Si", moment("08-07-2023", "DD-MM-YYYY"), "condiviso") 
            */