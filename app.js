// DOM elements
const calendar = document.querySelector('.calendar');
const container = document.querySelector('.container');
const calendarDays = document.querySelector('.calendar__days');
const taskBox = document.querySelector('.task__box');
const taskEl = document.querySelector('.task');
const liveTime = document.querySelector('.liveTime');

// creating date object
let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
// Changing format for a double digit instead 2022-1-1 to 2022-01-01
let currentDay = (date.getDate() < 9 ? '0': '') + (date.getDate());
let fullDate = currentYear + "-" + (date.getMonth() < 9 ? '0': '') + (date.getMonth()+ 1) + "-";

liveTime.innerHTML = `${fullDate}${currentDay}`;

let tasks = sessionStorage.getItem('Tasks') ? JSON.parse(sessionStorage.getItem('Tasks')) : [];


const renderCalendar = (month, year) => {
    taskBox.style.display = 'none';
    taskEl.innerHTML = ``;
    calendarDays.innerHTML = '';
    const daysInMonth = new Date(year, month, 0).getDate()+1;
    const firstWeekDay = (new Date(year, month, 0)).getDay();

    for(let i=1; i < firstWeekDay + daysInMonth; i++)
    {
        if(i > firstWeekDay) {
            let dayCount = i - firstWeekDay;
            let day = (dayCount <= 9 ? '0' : '') + dayCount;
            fullDate = currentYear + "-" + (date.getMonth() < 9 ? '0': '') + (date.getMonth()+ 1) + "-" + day;
            const taskForDay = tasks.find(e => e.date === fullDate);

            if(taskForDay) {
                let taskDiv = document.createElement("div");

                // Checking type and adding right class
                if(taskForDay.eType === 'Out of Office')
                {
                    taskDiv.innerHTML += `${i - firstWeekDay}
                    <span onClick="taskDescription('${taskForDay.date}')"class="day__task outofoffice">${taskForDay.title}</span>`;
                } else if (taskForDay.eType === 'Meeting') {
                    taskDiv.innerHTML += `${i - firstWeekDay}
                    <span onClick="taskDescription('${taskForDay.date}')"class="day__task meeting">${taskForDay.title}</span>`;
                } else {
                    taskDiv.innerHTML += `${i - firstWeekDay}
                    <span onClick="taskDescription('${taskForDay.date}')"class="day__task call">${taskForDay.title}</span>`;
                }

                calendarDays.appendChild(taskDiv);
            } else {
                calendarDays.innerHTML += `<div>${i - firstWeekDay}</div>`;
            }
        } else {
            calendarDays.innerHTML += `<span> </span>`;
        }

    }
}

const submitForm = () => {
    let title = document.querySelector('#event_name').value;
    let taskDay = document.querySelector('#event_day').value;
    let startTime = document.querySelector('#startTime').value;
    let endTime = document.querySelector('#endTime').value;
    let eType = document.querySelector('#event_type').value;
    let description = document.querySelector('#descr').value;

    if(title.length > 50 || title === '') {
        alert("Title can't be longer than 50 characters. Or can't be empty");
        return;
    }
    else if (taskDay === '') {
        alert("Date can't be empty");
        return;
    }
    else if(endTime === startTime || endTime < startTime) {
        alert("End time must be later than start time");
        return;
    } else if(eType === '') {
        alert("Type can't be empty");
        return;
    } else {
        createTask(title, taskDay, startTime, endTime, eType, description);
    }
}
const createTask = (name, date, sDate, eDate, type, descr) => {
    sDate = sDate.replace("T", " ");
    eDate = eDate.replace("T", " ");
    let task = {
        date: date,
        title: name,
        startTime: sDate,
        endTime: eDate,
        eType: type,
        description: descr
    };
    tasks.push(task);
    sessionStorage.setItem('Tasks', JSON.stringify(tasks));
    renderCalendar(currentMonth, currentYear);
}
// Prefiling empty session storage
if(!sessionStorage.getItem('Tasks')) {
    createTask('Visma internship deadline', '2022-01-10', '2022-01-31T9:00', '2022-01-31T17:00', 'call', 'well well well');
}

const taskDescription = (taskD) => {
    taskBox.style.display = 'block';
    const taskForDay = tasks.find(e => e.date === taskD);
    taskEl.innerHTML = `
        <div class="calendar__header">
            <h2>Task Information</h2>
        </div>
        <p>Task: ${taskForDay.title}</p>
        <p>Date: ${taskForDay.date}</p>
        <p>Type: ${taskForDay.eType}</p>
        <p>Start time: ${taskForDay.startTime}</p>
        <p>End time: ${taskForDay.endTime}</p>
        <p>Description: ${taskForDay.description}</p>
        <button id="remove_task" onClick="deleteTask('${taskForDay.date}')">REMOVE</button>
    `;
    container.appendChild(taskBox);
    taskBox.appendChild(taskEl);
}
const deleteTask = (task) => {
    if (confirm('Are you sure you want to delete task?')) {
        tasks = tasks.filter(e => e.date !== task);
        sessionStorage.setItem('Tasks', JSON.stringify(tasks));
        renderCalendar(currentMonth, currentYear);
      }
}
renderCalendar(currentMonth, currentYear);
