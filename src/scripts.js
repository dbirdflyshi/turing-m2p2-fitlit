                    //===============================\\
                   // |           FitLit            | \\
                  //  |    Turing Mod 2 Project 2   |  \\
                 //   |        Dane Anderson        |   \\
                //    ===============================    \\
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// JS File Imports 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var User = require('./User');
var UserRepository = require('./UserRepository');
import './css/styles.css';
import './images/water.png'
import './images/exercise.png'
import './images/sleep.png'
import './images/logo.png'
import{
    fetchUserData,
    fetchSleepData,
    fetchHydrationData,
    fetchActivityData
} from './apiCalls';


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// query selector variables go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var title = document.querySelector('#title');
var userCard = document.querySelector('#userData');
var userList = document.querySelector('#users');
var friendsCard = document.querySelector('#friends-list')
var hydrationButton = document.querySelector('#hydration');
var activityButton = document.querySelector('#activity');
var sleepButton = document.querySelector('#sleep');
var metric1 = document.querySelector('#metric1');
var metric2 = document.querySelector('#metric2');
var metric3 = document.querySelector('#metric3');
var metric4 = document.querySelector('#metric4');
var metric5 = document.querySelector('#metric5');
var metric6 = document.querySelector('#metric6');
var metric7 = document.querySelector('#metric7');
var metric8 = document.querySelector('#metric8');
var metric9 = document.querySelector('#metric9');
var dateDrop1 = document.querySelector('#dateDrop1');
var dateDrop2 = document.querySelector('#dateDrop2');
var chartTitle = document.querySelector('#chartTitle');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Global Variables Go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var myChart = null;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Loads the function orchestrator 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('load', loadAllData());


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The main function that orchestrates everything 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadAllData(){
    Promise.all([fetchUserData(), 
                 fetchSleepData(),
                 fetchHydrationData(),
                 fetchActivityData()
    ]).then(data => {


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Build User Data 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const userDataList = buildRepo(data[0].userData);
        const userSleepData = data[1].sleepData;
        const userHydrationData = data[2].hydrationData;
        const userActivityData = data[2].activityData;


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Variables 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let currentId = 1;
        let currentMetric = 'hydration'

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event listeners 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        hydrationButton.addEventListener('click', () => {
            loadMetrics('hydration',userHydrationData, currentId)
            currentMetric = 'hydration';
        });
        // activityButton.addEventListener('click', () => {
        //     loadMetrics('activity', userActivityData, currentId)
        //     currentMetric = 'activity';
        // });
        sleepButton.addEventListener('click', () => {
            loadMetrics('sleep', userSleepData, currentId)
            currentMetric = 'sleep';           
        });

        document.getElementById("users").onchange = () => {
            chooseUser(userDataList);
            currentId = returnUserID(userDataList);
            switch(currentMetric){
                case 'hydration': loadMetrics(currentMetric, userHydrationData, currentId);
                break
                case 'activity': loadMetrics(currentMetric, userActivityData, currentId);
                break
                case 'sleep': loadMetrics(currentMetric, userSleepData, currentId);
                break
            }
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Load Defaults 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        loadUserData(userDataList, 1);
        loadMetrics('hydration',userHydrationData, 1)


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Load User DropDown 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        loadUserListDropdown(userDataList);


    })
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// All functions that run in the orchestrator 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Creating the repo object 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function buildRepo(data){
    // Creating the repo skeleton
    var userClasses = [];
    // converting the object array to a class instance of User array
    data.map((user) => userClasses.push(new User(user)))
    // Creating the class instance of UserRepository object
    return new UserRepository(userClasses);
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Loading User Info Card 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadUserData(userRepo, id){
    var user = userRepo.users.find((user) => user.id === id);
    var stepGoalRating;
    user.dailyStepGoal > getStepGoalAvg(userRepo) ? stepGoalRating = 'Above Average' : stepGoalRating = 'Above Average'
    
    userCard.innerHTML = `<ul id="userData">
                    <li>Name :<span style=\"color:rgba(230, 196, 157, 1)\"> ${user.name}</span></li>
                    <li>Address :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.address}</span></li>
                    <li>Email :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.email}</span></li>
                    <li>Stride :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.strideLength}</span></li>
                    <li>Step Goal :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.dailyStepGoal}</span></li>
                    <li>Goal Rating:<span style=\"color:rgba(230, 196, 157, 1)\">  ${stepGoalRating}</span></li>
                </ul>`
    loadFriends(userRepo, user);            
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Calulating Avg Step Goal 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getStepGoalAvg(userRepo) {
    var total = userRepo.users.reduce((acc, user) => {
        acc += user.dailyStepGoal;
        return acc;
    }, 0)
    var userCount = userRepo.users.length;
    var avg = total / userCount
    return avg;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Populating Friends List 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadFriends(userRepo, user){
    var friendIDs = user.friends
    friendsCard.innerHTML = '';
    friendIDs.forEach((friend) => {
        var user = userRepo.users.find((user) => user.id === friend);
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(user.name));
        friendsCard.appendChild(li);
    })
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Populating User Drop Down 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadUserListDropdown(userRepo){
    var userSelectList ='';
    userRepo.users.forEach((user) => {userSelectList+=`<option value=${user.id}>${user.name}</option>`});
    userList.innerHTML = `<select name="users" id="users">${userSelectList}</select>`
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Load User From Drop Down Selection 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function chooseUser(userDataList) {
    var selection = document.getElementById("users");
    var option = parseInt(selection.options[selection.selectedIndex].value);
    loadUserData(userDataList, option);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Gets The Active User ID 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function returnUserID(userDataList){
    var selection = document.getElementById("users");
    var option = parseInt(selection.options[selection.selectedIndex].value);
    return option;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Central Hub Of Metrics 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadMetrics(type,data,id){
    switch(type){
        case 'hydration': hydration(data,id);
        break
        case 'sleep': sleep(data,id);
        break
        case 'activity': activity(data,id);
        break
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Pull Specific User Metrics 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function queryUserMetric(data,id){
    var userMetric = data.reduce((acc,dataPoint) =>{
        dataPoint.userID === id? acc.push(dataPoint):null;
        return acc;
    },[])
    return userMetric;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Populate Date Drop Down 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function dateDropDates(data, instance) {
    var dateList = '';
    data.forEach((point) => { dateList += `<option value=${point.date}>${point.date}</option>` });
    switch (instance) {
        case '1': dateDrop1.querySelector("#dates1").innerHTML = `<select name="dates" id="dates1">
                                                                  <option value="none" selected disabled hidden>Select a Date</option>
                                                                  ${dateList}
                                                                  </select>`
        case '2': dateDrop1.querySelector("#dates1").innerHTML = `<select name="dates" id="dates1">
                                                                  <option value="none" selected disabled hidden>Select a Date</option>
                                                                  ${dateList}
                                                                  </select>`
                 dateDrop2.querySelector("#dates2").innerHTML = `<select name="dates" id="dates1">
                                                                 <option value="none" selected disabled hidden>Select a Date</option>
                                                                 ${dateList}
                                                                 </select>`
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Return Chosen Date Data 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function chooseDate(data, instance, metric) {
    var selection = document.getElementById(`dates${instance}`);
    var option = selection.options[selection.selectedIndex].value;
    var foundPoint = data.find((point) => point.date === option);
    switch(metric){
        case 'hydration': return foundPoint.numOunces;
        break
        case 'sleep': return foundPoint.hoursSlept;
        break
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Draw The Line Chart 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function drawChart(data,metric) {
    if (myChart != null) {
        myChart.destroy();
    }
    switch (metric) {
        case 'hydration': var labels = [
            data[data.length - 7].date,
            data[data.length - 6].date,
            data[data.length - 5].date,
            data[data.length - 4].date,
            data[data.length - 3].date,
            data[data.length - 2].date,
            data[data.length - 1].date
        ];
        break
        case 'sleep': var labels = [
            data[data.length - 7].week,
            data[data.length - 6].week,
            data[data.length - 5].week,
            data[data.length - 4].week,
            data[data.length - 3].week,
            data[data.length - 2].week,
            data[data.length - 1].week
        ];
        break
    }
    switch(metric){
        case 'hydration': data = [data[data.length - 7].numOunces,
                            data[data.length - 6].numOunces,
                            data[data.length - 5].numOunces,
                            data[data.length - 4].numOunces,
                            data[data.length - 3].numOunces,
                            data[data.length - 2].numOunces,
                            data[data.length - 1].numOunces]
        break
        case 'sleep': data = [data[data.length - 7].hoursSlept,
                            data[data.length - 6].hoursSlept,
                            data[data.length - 5].hoursSlept,
                            data[data.length - 4].hoursSlept,
                            data[data.length - 3].hoursSlept,
                            data[data.length - 2].hoursSlept,
                            data[data.length - 1].hoursSlept]
        }
    
    const dataTest = {
        labels: labels,
        datasets: [{
            backgroundColor: '#616e76',
            borderColor: 'rgba(230, 196, 157, 1)',
            data: data
        }]
    };
    const config = {
        type: 'line',
        data: dataTest,
        options: {
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgb(223, 223, 223)' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: 'rgb(223, 223, 223)' }
                }
            },
            layout: {
                padding: {
                    top:20,
                    right: 50,
                    bottom: 20,
                    left: 20
                }
            }
        }
    };
    myChart = new Chart(
        document.getElementById('line-chart'),
        config
    );
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Hydration   👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The main method to orchestrate all hydration tasks
function hydration(data,id){
    title.innerHTML = '🚰 Hydration🚰'
    chartTitle.innerHTML = 'Water Consumption Over The Last 7 Days'
    var userHydrationData = queryUserMetric(data, id)
    dateDropDates(userHydrationData, '1');
    metric1.style.display = 'flex';
    metric2.style.display = 'flex';
    metric3.style.display = 'flex';
    metric4.style.display = 'none';
    metric5.style.display = 'none';
    metric6.style.display = 'none';
    metric7.style.display = 'none';
    metric8.style.display = 'none';
    metric9.style.display = 'none';
    dateDrop1.style.display = 'flex';
    dateDrop2.style.display = 'none';

    metric1.querySelector('.metric-title').querySelector('p').innerHTML = 'Water oz Consumed Today';
    metric1.querySelector('.metric-metric').querySelector('p').innerHTML = waterConsumedToday(userHydrationData);
    metric2.querySelector('.metric-title').querySelector('p').innerHTML = 'Total Water oz Consumed';
    metric2.querySelector('.metric-metric').querySelector('p').innerHTML = totalWaterConsumed(userHydrationData);
    metric3.querySelector('.metric-title').querySelector('p').innerHTML = 'Avg Daily oz Consumed';
    metric3.querySelector('.metric-metric').querySelector('p').innerHTML = avgWaterConsumed(userHydrationData);
    dateDrop1.querySelector('.metric-title').querySelector('p').innerHTML = 'Water oz Consumed On This Date';
    dateDrop1.querySelector('.metric-metric').querySelector('p').innerHTML = '';
    document.getElementById("dates1").onchange = () => {
        dateDrop1.querySelector('.metric-metric').querySelector('p').innerHTML = chooseDate(userHydrationData, '1', 'hydration');
    };
    
    drawChart(userHydrationData,'hydration')
}


// Getting today's water consumption
function waterConsumedToday(data){
    var today = data.slice(-1)[0]
    var waterConsumedToday = data.find((point) => point === today);
    return waterConsumedToday.numOunces;
}


// Getting the average water consumed
function avgWaterConsumed(data) {
    var total = totalWaterConsumed(data);
    var days = data.length;
    var avg = total / days;
    return Math.round(avg);
};


// Getting the total water consumed
function totalWaterConsumed(data) {
    var total = data.reduce((acc, point) => {
        acc += point.numOunces;
        return acc;
    }, 0)
    return total;
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sleep   👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function sleep(data, id) {
    title.innerHTML = '💤 Sleep 💤'
    chartTitle.innerHTML = 'Hours Slept Over The Last 7 Weeks'
    data = weekSleep(data);
    var userSleepData = queryUserMetric(data, id)
    metric1.style.display = 'flex';
    metric2.style.display = 'flex';
    metric3.style.display = 'flex';
    metric4.style.display = 'flex';
    metric5.style.display = 'flex';
    metric6.style.display = 'flex';
    metric7.style.display = 'none';
    metric8.style.display = 'none';
    metric9.style.display = 'none';
    dateDrop1.style.display = 'flex';
    dateDrop2.style.display = 'flex';
    dateDropDates(userSleepData, '1');
    weekDropDates(userSleepData);
    var weeklyAggregate = aggregateSleep(userSleepData);
    metric1.querySelector('.metric-title').querySelector('p').innerHTML = 'Hours Slept Today';
    metric1.querySelector('.metric-metric').querySelector('p').innerHTML = hoursSleptToday(userSleepData);
    metric2.querySelector('.metric-title').querySelector('p').innerHTML = 'Avg Hours Slept';
    metric2.querySelector('.metric-metric').querySelector('p').innerHTML = avgSlept(userSleepData);
    metric3.querySelector('.metric-title').querySelector('p').innerHTML = 'Total Hours Slept';
    metric3.querySelector('.metric-metric').querySelector('p').innerHTML = totalSleep(userSleepData);
    metric4.querySelector('.metric-title').querySelector('p').innerHTML = 'Sleep Quality Today';
    metric4.querySelector('.metric-metric').querySelector('p').innerHTML = todaySleepQuality(userSleepData);
    metric5.querySelector('.metric-title').querySelector('p').innerHTML = 'Avg Sleep Quality';
    metric5.querySelector('.metric-metric').querySelector('p').innerHTML = avgSleepQuality(userSleepData);
    metric6.querySelector('.metric-title').querySelector('p').innerHTML = 'Avg Sleep Quality For All Users';
    metric6.querySelector('.metric-metric').querySelector('p').innerHTML = avgSleepQuality(data);
    dateDrop1.querySelector('.metric-metric').querySelector('p').innerHTML = '';
    dateDrop1.querySelector('.metric-title').querySelector('p').innerHTML = 'Hours Slept For This Day';
    document.getElementById("dates1").onchange = () => {
       dateDrop1.querySelector('.metric-metric').querySelector('p').innerHTML = chooseDate(userSleepData, '1', 'sleep');
    };
    dateDrop2.querySelector('.metric-metric').querySelector('p').innerHTML = '';
    dateDrop2.querySelector('.metric-title').querySelector('p').innerHTML = 'Hours Slept For This Week';
    document.getElementById("dates2").onchange = () => {
        dateDrop2.querySelector('.metric-metric').querySelector('p').innerHTML = chooseWeek(weeklyAggregate);
    };
    drawChart(weeklyAggregate,'sleep');
}


// Getting today's sleep
function hoursSleptToday(data) {
    var today = data.slice(-1)[0]
    var todayNum = data.find((point) => point === today);
    return todayNum.hoursSlept;
}


// Getting the total sleep
function totalSleep(data) {
    var total = data.reduce((acc, point) => {
        acc += point.hoursSlept;
        return acc;
    }, 0)
    return Math.round(total);
};


// Getting the average sleep
function avgSlept(data) {
    var total = totalSleep(data);
    var days = data.length;
    var avg = total / days;
    return Math.round(avg);
};


// Getting today's sleep quality
function todaySleepQuality(data) {
    var today = data.slice(-1)[0]
    var todayNum = data.find((point) => point === today);
    return todayNum.sleepQuality;
}


// Getting the total sleep quality
function totalSleepQuality(data) {
    var total = data.reduce((acc, point) => {
        acc += point.sleepQuality;
        return acc;
    }, 0)
    return Math.round(total);
};


// Getting the average sleep quality
function avgSleepQuality(data) {
    var total = totalSleepQuality(data);
    var days = data.length;
    var avg = total / days;
    return Math.round(10*avg)/10;
};

function weekSleep(data){
    var newData = data.reduce((acc,point) =>{
        const year = +point.date.substring(0, 4);
        const month = +point.date.substring(5, 7);
        const day = +point.date.substring(8, 10);
        const date = new Date(year, month-1, day);
        var startDate = new Date(date.getFullYear(), 0, 1);
        var days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        var weekNumber = Math.ceil((date.getDay() + 1 + days) / 7);
        point['week'] = `${year}-${weekNumber}`;
        acc.push(point);
        return acc
    },[])
    return newData;
}

// Populate week drop down
function weekDropDates(data) {
    var dateList = '';
    data.forEach((point) => { dateList += `<option value=${point.week}>${point.week}</option>` });
    dateDrop2.querySelector("#dates2").innerHTML = `<select name="dates" id="dates1">
                                                    <option value="none" selected disabled hidden>Select a Date</option>
                                                    ${dateList}
                                                    </select>`;
}

function aggregateSleep(data){
    var agg = data.reduce((acc, point) => {
        const index = acc.findIndex(obj => obj.week === point.week);
        if (index !== -1) {
            acc[index].hoursSlept += Math.round(point.hoursSlept);
        } else {
            acc.push({
                week: point.week,
                hoursSlept: point.hoursSlept
            });
        };
        return acc;
    }, []);
    return agg;
};

function chooseWeek(data) {
    var selection = document.getElementById("dates2");
    var option = selection.options[selection.selectedIndex].value;
    var foundPoint = data.find((point) => point.week === option);
    return foundPoint.hoursSlept;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Activity   👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function activity(id) {
}