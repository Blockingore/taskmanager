class Task{
 
    constructor(description, important, privat, project, deadline, completed){
        
        this.description = description;
        this.important = important;
        this.privat = privat;
        this.project = project;
        this.deadline = moment(deadline).format('DD-MM-YYYY');
        this.completed = completed;
    }

    static from(geison){
        const t = Object.assign(new Task(), geison);
        t.deadline = moment(t.deadline);
        return t;    
    }
}

export default Task;