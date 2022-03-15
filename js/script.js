let note_ = (function(){
    const addText = document.querySelector("#addText");
    const addDate = document.querySelector("#addDate");
    const addTime = document.querySelector("#addTime");
    const btn = document.querySelector("#btn");
    const btn2 = document.querySelector("#btn2");
    const taskDate = document.querySelector("#taskDate");
    const taskTime = document.querySelector("#taskTime");
    const taskNote = document.querySelector("#task");
    const formContent = document.querySelector("#formContent");
    const tasks = document.querySelector(".tasks");
    const alarm = document.querySelector(".alarm")
    const myAlarm = document.querySelector(".my-alarm");
    const listItems = document.querySelector("#listItems");
    const listItem = document.querySelector("#listItem")
    let originalX;
    let originalY;
    
    let ringAlarmInterval;
    


    // window.onload = function(){
    //     saveIncompletedTasks();
    // }
    
    createTables()
    

    //function that creates the table
    function createTables(){
        let storedTasks = localStorage.getItem("stored_tasks");
        storedTasks = JSON.parse(storedTasks);

        if(storedTasks != null){

            let ulElement = "<ul id='listItems'>";
            for(let i = 0; i < storedTasks.length; i++){

                ulElement +=`
                <li draggable="true" id = 'listItem'>
                <input type='checkbox' id='checkbox_${storedTasks[i]['timeCreated']}' class='checkbox'>
                <input type = 'text' id='taskDate_${storedTasks[i]['timeCreated']}' class='taskDate' value ='${storedTasks[i]['noteDate_']}' readonly>
                <input type = 'text' id='taskTime_${storedTasks[i]['timeCreated']}' class='taskTime' value ='${storedTasks[i]['noteTime_']}' readonly>
                <input type='text' id='task_${storedTasks[i]['timeCreated']}' class='task' value ='${storedTasks[i]['taskNote_']}' readonly>
                <a id='deleteTask_${storedTasks[i]['timeCreated']}' onclick = "note_.deleteMessage(this.id)"> <i class="fas fa-trash-alt trash"></i></a>
                <a id='editTask_${storedTasks[i]['timeCreated']}' onclick = "note_.editMessage(this.id)"><i class="fas fa-edit edit"></i></a>
            </li>
                `
            }
            ulElement += "</ul>";
            tasks.innerHTML =ulElement;
           // console.log(ulElement);

        }
    }


    // ******function to store object in the local storage
    function saveTask(taskNote,noteDate,noteTime){
        let savedTask = localStorage.getItem("stored_tasks");

        let date = new Date();
        let timeSaved = date.getTime();

        let checkTime = new Date(`${noteDate} ${noteTime}`);

        setDateTimeStamp = checkTime.getTime();
        
        //console.log("check: ", setDateTimeStamp)

        
       
       let setDateTime = {
           taskNote_ : taskNote,
           noteDate_ : noteDate,
           noteTime_ : noteTime,
           stamp_ : setDateTimeStamp
       }

       console.log(setDateTime);
     

        let newObject = {
            taskNote_ : taskNote,
            noteDate_: noteDate,
            noteTime_: noteTime,
            timeCreated: timeSaved,
            stamp : setDateTimeStamp
        }
      

        if(savedTask == null || savedTask == undefined){
            savedTaskArray = [];
            savedTaskArray.push(newObject);
            savedTaskArray = JSON.stringify(savedTaskArray);
            localStorage.setItem("stored_tasks", savedTaskArray)

            location.reload();
           
        }else{
            savedTask = JSON.parse(savedTask);
            savedTask.push(newObject);
            savedTaskArray = JSON.stringify(savedTask);
            localStorage.setItem("stored_tasks", savedTaskArray);
           
            location.reload();
        }
      
       return setDateTimeStamp, checkTime, setDateTime
      
          
    }
    
    //////////Add list of task //////////////////////////////////////////////////////////////////////////////////


    function createTask(){

       // tasks.innerHTML = "";

        if(addText.value.trim().length > 0 && addTime.value.length > 0 && addDate.value.length > 0){
            new_addText = addText.value.trim();
            new_addTime = addTime.value.trim();
            new_addDate = addDate.value.trim();

             checkTime =saveTask(new_addText, new_addDate, new_addTime);
           
          
            //The above line means when u r done performing the action in saveTask function, assign the value that is 
            //resurned to be equal to setDateTime....ie setDateTime= SetDateTime(from the saveTask function)
           
            
            saveIncompletedTasks();
          
            return checkTime;

            // storage();

            // addText.value = "";
            // addDate.value = "";
            // addTime.value = "";

           
        }

       
      
    }

    btn.onclick = createTask;


    ///////////Delete any task in the list////////////////////////////////////////////////////////////////////

    function deleteMessageFunction(timeIdCreated){
       // console.log(deleteMessageFunction);
       
        
        let confirmDel = confirm("Delete this note");
        
        if(confirmDel){
            let removeMesage = localStorage.getItem("stored_tasks");
            removeMesage = JSON.parse(removeMesage);
            //console.log(typeof(removeMesage));
            for(let i = 0; i < removeMesage.length; i++){
                console.log(removeMesage[i])
                console.log("Time created: ", timeIdCreated)

               timeIdCreatedBox = timeIdCreated.split("_");

                let timeCreated = (timeIdCreatedBox[1])

                if(removeMesage[i].timeCreated == timeCreated){
                    
                    removeMesage.splice(i, 1);
                    removeMesage = JSON.stringify(removeMesage);
                    localStorage.setItem("stored_tasks", removeMesage);

                    location.reload();

                } 
            }
        }


    }

    //////////////Edit any task in the list////////////////////////////////////////////////////////////////////


    function editMessageFunction(timeIdCreated){
        //console.log(timeIdCreated);
        timeIdCreatedBox = timeIdCreated.split("_");

        let timeCreated = (timeIdCreatedBox[1])
        
       document.querySelector(`#taskDate_${timeCreated}`).removeAttribute("readonly");
       document.querySelector(`#taskTime_${timeCreated}`).removeAttribute("readonly");
        document.querySelector(`#task_${timeCreated}`).removeAttribute("readonly");

        document.querySelector(`#editTask_${timeCreated}`).innerHTML = '<a><i class="fas fa-save"></i></a>';
        document.querySelector(`#editTask_${timeCreated}`).setAttribute("onclick", `note_.saveEditedMessage('${timeCreated}')`)
        
    }

    function saveEditedMessageFunction(timeCreated){
        //console.log(timeCreated);


        let new_Date = document.querySelector(`#taskDate_${timeCreated}`).value.trim();
        let new_Time = document.querySelector(`#taskTime_${timeCreated}`).value.trim();
        let new_Task = document.querySelector(`#task_${timeCreated}`).value.trim();

        if(new_Date.length !=0 && new_Time.length !=0 && new_Task.length !=0){
            console.log("ok");
            let savedTask = localStorage.getItem("stored_tasks");
            savedTask = JSON.parse(savedTask);
            for(let i = 0; i < savedTask.length; i++){
            
                if(savedTask[i]['timeCreated']==timeCreated){
                    console.log("timeCreated[i]:",savedTask[i]['timeCreated'] );
                    console.log("timeCreated:", timeCreated);
                    savedTask[i]['noteDate_'] = new_Date;
                    savedTask[i]['noteTime_'] = new_Time;
                    savedTask[i]['taskNote_'] = new_Task;
                    console.log(savedTask[i]['taskNote_']);
                    console.log(new_Task);

                    savedTask = JSON.stringify(savedTask);
                    localStorage.setItem("stored_tasks", savedTask);
                    //console.log(savedTask);
                    break
                }
            }
            location.reload()

        }

    }

 

    ////////////check every second on the current time whenever the incompleted storage is not empty//////////

    function saveIncompletedTasks(){
   
        let feedBack = incompletedTasksStorage(setDateTimeStamp);
        if(feedBack==true){
           ringAlarmInterval = setInterval(ringAlarm,1000)
        }
       

    }

///////////////create a storage for all the tasks yet to ring alarm///////////////////////////////////////////

    function incompletedTasksStorage(setDateTimeStamp){
      
       
        let incompleted = localStorage.getItem("incompleted_Tasks");
       
            if(incompleted==null || incompleted==undefined){
                incompleted = [setDateTimeStamp];
                incompleted = JSON.stringify(incompleted);
                localStorage.setItem("incompleted_Tasks", incompleted);
              //  location.reload()

                return true;
            }else{
                incompleted = JSON.parse(incompleted);
                incompleted.push(setDateTimeStamp);
               
                incompleted.sort();
                incompleted = JSON.stringify(incompleted);
                localStorage.setItem("incompleted_Tasks", incompleted)
              
              //  location.reload()
                return true;
            }
        
    }


///////////////////Get the present date and time and check if the time is up for alarm or if the time has passed to remove///


    function ringAlarm(){
        
        
        //Get The Current time
        let current = new Date();
       let currentYear = current.getFullYear();
       let currentMonth = current.getMonth();
       let currentDay = current.getDate();
       currentHours = current.getHours();
       currentMinutes = current.getMinutes();

     // getMonth method counts from 0 - 11, so add 1 to each month to get the actual current month
      let x = 1
      currentMonth += x;

       // change to string to add 0 infront of the months and days with single numbers

        currentMonth = currentMonth.toString();
        if(currentMonth.length == 1){
            currentMonth = "0"+currentMonth;
        }

        currentDay = currentDay.toString();
        if(currentDay.length == 1){
            currentDay = "0"+currentDay;
        }

       
        let currentDate = currentYear + "-" + currentMonth + "-" + currentDay;
         let currentTime = currentHours + ":" + currentMinutes;

         let currentTimeDate = new Date(`${currentDate} ${currentTime}`);
         currentTimeDateStamp = currentTimeDate.getTime();
         console.log("currentCheck: ", currentTimeDateStamp)
      

         nextTask = getNextIncompletedAlarm();
         console.log("Next Task 2: ", nextTask);
         checkNextAlarm = nextTask.stamp;
        
          console.log("Next Alarm: ", checkNextAlarm);
          

        if(checkNextAlarm < currentTimeDateStamp){
            clearInterval(ringAlarmInterval);

            removeCompletedAlarm(checkNextAlarm);
            
        }

        if(checkNextAlarm == currentTimeDateStamp){
            clearInterval(ringAlarmInterval)
            //mark as completed
            markAsCompleted(nextTask, currentTimeDateStamp);

             //start alarm
             let audioAlert = "<div>" ;
             audioAlert += `
             <audio controls autoplay hidden>
             <source src="../images/the-future-bass-15017.mp3" type="audio/mpeg">
         </audio>
             ` 
             audioAlert+="</div>";
             myAlarm.innerHTML = audioAlert ;

            //  return checkNextAlarm, currentTimeDateStamp
        }
           
         
    }

    ///////////////// Select the next task that should be alarmed///////////////////////////////////////////////

    function getNextIncompletedAlarm(){
        let incompleted = localStorage.getItem("incompleted_Tasks");
        incompleted = JSON.parse(incompleted);

        console.log(incompleted);

        associatedTask = getAssociatedTask(incompleted[0]);

        console.log("Associated: ", associatedTask);
       
         return associatedTask;
    
         //console.log("Stored Task: ", associatedTask);
    
    }

///////////////////////////check if the next task is equal to the stamp/////////////////////////////////////////////

    function getAssociatedTask(incompleted){
        stored_tasks = localStorage.getItem("stored_tasks")
        stored_tasks = JSON.parse(stored_tasks);

        for(let i = 0; i < stored_tasks.length; i++){
            if(stored_tasks[i].stamp == incompleted){
               return stored_tasks[i]; 
            }
        }
       
    }

 
    ///////////////////// Remove the completed tasks/////////////////////////////////////////////////////////////////

    function removeCompletedAlarm(completed){
        let incompleted = localStorage.getItem("incompleted_Tasks");
        incompleted = JSON.parse(incompleted);

        for(let i = 0; i < incompleted.length; i++){
            if(incompleted[i] == completed){
                incompleted.splice(i,1);

                //Save to CompletedAlarms
                saveToCompletedAlarms(completed);

                incompleted.sort();
                incompleted = JSON.stringify(incompleted);
      
                localStorage.setItem("incompleted_Tasks", incompleted);

            }
        }

    }

    ////////////Save completed tasks  to a separate storage////////////////////////////////////////////////////////


    function saveToCompletedAlarms(completed){
        let completedAlarms = localStorage.getItem("completed_Tasks");
        if(completedAlarms == null || completedAlarms == undefined){
            completedAlarms = [];
            console.log(completedAlarms);

            completedAlarms.push(completed);

            completedAlarms = JSON.stringify(completedAlarms);
            localStorage.setItem("completed_Tasks", completedAlarms);
            
          //  location.reload();
        }else{
            completedAlarms = JSON.parse(completedAlarms);
            completedAlarms.push(completed);
            completedAlarms.sort();
            completedAlarms = JSON.stringify(completedAlarms);
            localStorage.setItem("completed_Tasks", completedAlarms)
            console.log("completed :", completedAlarms);
          //  location.reload();
        }

    }



    //////////////////////Mark all the completed task///////////////////////////////////////////////////////////////

    function markAsCompleted(nextTask,currentTimeDateStamp){
        checkNextAlarm = nextTask.stamp;
        if(checkNextAlarm==currentTimeDateStamp){
            console.log( "next:",checkNextAlarm);
            console.log("current:", currentTimeDateStamp);
            let savedTask = localStorage.getItem("stored_tasks");
            savedTask = JSON.parse(savedTask);
            for(let i =0; i<savedTask.length; i++){
                console.log(savedTask);
                 console.log("timeCreated:",timeCreated);
                if(savedTask[i]['stamp']==checkNextAlarm){
                   // alert("checked")
                   document.querySelector(`#checkbox_${nextTask.timeCreated}`).setAttribute("checked")
                   
                }
            }

       
        }
        

    }

    //////////////////////Drag and Drop///////////////////////////////////////////////////////////////////////

    // listItem.addEventListener("drop", handleDropEvent);
    // listItem.addEventListener("dragstart", handleDragStartEvent);
    // listItem.addEventListener("dragover", handleDragOverEvent);

    // function handleDragStartEvent(event){

    //     console.log("Drag started");

    // }


    // function handleDragOverEvent(event){

    //     event.preventDefault(); 

    // }


    // function handleDropEvent(event){
    //     console.log("dropped");


    // }



    // check = new DataTransfer();
    // console.log(check);

    // check.setData("testing", "this is testing");

    // testing_data = check.getData("testing");

    // console.log(testing_data);



  


    return{
        deleteMessage:deleteMessageFunction,
        editMessage:editMessageFunction,
        saveEditedMessage:saveEditedMessageFunction
    }
    

}())