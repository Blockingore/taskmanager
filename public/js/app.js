import TaskManager from './taskManager.js';
import { createTaskRow, createTaskTable } from './templates/task-template.js';
import createNavLinks from './templates/navTemplate.js';
import page from '//unpkg.com/page/page.mjs';

class App{
    constructor(mainContainer, navLinks){

      this.mainContainer = mainContainer;

      page('/', () => {
        navLinks.innerHTML = '';
        navLinks.insertAdjacentHTML("beforeend", createNavLinks('tasks'));
        this.showTasks();
      });

      page();

      /*

        this.mainContainer = mainContainer;
        this.sidebarContainer = sidebarContainer;

        this.taskManager = new TaskManager();
        
        this.taskManager.getPassedTasks().then(tasks =>{

          this.sidebarContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) =>{
              const el = event.target;
              const filterType = el.dataset.id;
  
              this.sidebarContainer.querySelector('a.active').classList.remove('active');
              el.classList.add('active');
  
              this.onYearSelected(filterType);
            });
          });
  
        const addForm = document.getElementById('add-form');
        this.initForm(addForm);
  
        this.showTasks(tasks);
  
        });
        */
    }

async initForm(form){
  
  const tasks = await this.taskManager.getTask();

  tasks.forEach((t) => {
    form.task.appendChild(new Option(t.description, t.important));
  });

  form.task.addEventListener('change', function(){
    const selectedTask = form.task.options[form.task.selectedIndex];
    form.importance.value = tasks.find(task => task.description === selectedTask.text).important;
  });

  form.addEventListener('submit',this.onFormSubmitted);
}
/*
initForm(form){
  const tasks = this.taskManager.getTask();
  tasks.forEach((t) => {
    form.task.appendChild(new Option(t.description, t.important));
  });
  form.task.addEventListener('change', function(){
    const selectedTask = form.task.options[form.task.selectedIndex];
    form.importance.value = tasks.find(task => task.description === selectedTask.text).important;
  });
  form.addEventListener('submit',this.onFormSubmitted);
}
*/


onFormSubmitted = async (event) =>{
  
  event.preventDefault();

  document.getElementById('error-message').innerHTML = '';

  const form = event.target;

  const selectedTask = form.task.options[form.task.selectedIndex];

  if(form.checkValidity()){
    const task = new Task(selectedTask.text, selectedTask.value, form.importance.value, form.privato.value,  moment(form.scadenza.value));
    try{

     await this.taskManager.addTask(task);
     const tasks = await this.taskManager.getPassedTasks();
     
     this.mainContainer = '';
     this.showTasks(tasks);

    }
    catch(error){
      if (error){
        const errorMsg = error.error;
        document.getElementById('error-message').innerHTML = 
        `<div class = "alert alert-danger alert-dimissible fade show" role = "danger">
        <strong>Errore:</strong> <span>${errorMsg}</span>
        <button type = "button" class = "close" data-dimiss ="alert" aria-label ="Close">
          <span aria-hidden = "true" > &times;</span>
        </button></div>`
      }

    }finally{
      form.reset();
      document.getElementById('close-modal').click();
    }
    
  }
}
/*
onFormSubmitted = (event) =>{
  event.preventDefault();
  const form = event.target;
  const selectedTask = form.task.options[form.task.selectedIndex];

  if(form.checkValidity()){
    const task = new Task(selectedTask.text, selectedTask.value, moment(form.scadenza.value), form.privato.value);

    this.taskManager.addTask(task);
    const tasks = this.taskManager.getPassedTasks();

    this.showTasks(tasks);

    form.reset();
    document.getElementById('close-modal').click();
  }
}
*/

    onYearSelected(elementId){

      let tasks = [];

      if(this.mainContainer.innerHTML !== ''){
        this.mainContainer.innerHTML = '';
      }

      if(elementId === 'tutti'){
        tasks = this.tasks;
      }else if(elementId === 'oggi'){
        tasks = this.taskManager.getByExpired();
      }
      else if (elementId === 'importanti'){
        tasks = this.taskManager.getByImportance();
      }
      else if (elementId === 'prossimi_7_giorni'){
        tasks = this.taskManager.getBy7Days();
      }
      else if(elementId === 'privati'){
        tasks = this.taskManager.getByPrivate();
      }
      else if(elementId === 'condivisi'){
        tasks = this.taskManager.getByShare();
      }
      
      this.showTasks(tasks);
    }


    showTasks = async () => {

      const tasks = await TaskManager.getPassedTasks();

      this.mainContainer.innerHTML = createTaskTable();
      const taskTable = document.querySelector('#my-tasks');

      for(let task of tasks){
        const taskRow = createTaskRow(task);
        taskTable.insertAdjacentHTML("beforeend", taskRow);
      }
    }

/* vecchia showtsask


      let i = 1;

      if(this.mainContainer.innerHTML !== '') {
        this.mainContainer.innerHTML = '';
    }

        for(let task of tasks){
        
            //creazione nuovi elementi
            const li = document.createElement('li');
            const div_1 = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('label');
            const span = document.createElement('span');
            const small = document.createElement('small');
            const p_1 = document.createElement('p');
            const p_2 = document.createElement('p');

            //gestione classi 

            li.classList.add('list-group-item');

            div_1.classList.add('d-flex', 'w-100', 'justify-content-between');         
        
    
            input.type = 'checkbox';
            input.classList.add('custom-control-input');
            input.id = 'check-t' + i;

            label.classList.add('custom-control-label');
            label.setAttribute('for','check-t' + i );

            span.classList.add('badge','badge-primary');

            //gestione contenuto
            label.innerText = task.description;
            span.innerText = task.important;
            p_1.innerText = moment(task.deadline).format('DD-MM-YYYY');
            p_2.innerText = task.privat;

            //inserimento in HTML
            this.mainContainer.appendChild(li);
            li.appendChild(div_1);
            
            div_1.appendChild(input);
            div_1.appendChild(label);
            div_1.appendChild(span);
            div_1.appendChild(p_1);
            div_1.appendChild(p_2);
          
           i++; 
        }

    }
    */
}

export default App;
/*<li class="list-group-item">
<div class="d-flex w-100 justify-content-between">
  <div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" id="check-t1">
    <label class="custom-control-label" for="check-t1">Completare lab 2</label>
    <span class="badge badge-primary ml-4">UPO</span>   
  </div>
  <small>Venerd&igrave; 24 Aprile 2020 alle 16:00</small>
</div>
</li>
*/