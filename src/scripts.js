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
var userCard = document.querySelector('#userData')
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Global Variables Go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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
        case 'sleep': sleep(id);
        break
        case 'activity': activity(id);
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
// Hydration   👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function hydration(data,id){
    var userHydrationData = queryUserMetric(data, id)
    metric1.style.display = 'flex';
    metric2.style.display = 'flex';
    metric3.style.display = 'flex';
    dateDrop1.style.display = 'flex';
    metric1.querySelector('.metric-title').querySelector('p').innerHTML = 'Water Consumed Today';
    metric1.querySelector('.metric-metric').querySelector('p').innerHTML = waterConsumedToday(userHydrationData);
    metric2.querySelector('.metric-title').querySelector('p').innerHTML = 'Total Water Consumed';
    metric2.querySelector('.metric-metric').querySelector('p').innerHTML = totalWaterConsumed(userHydrationData);
    metric3.querySelector('.metric-title').querySelector('p').innerHTML = 'Avg Daily Consumed';
    metric3.querySelector('.metric-metric').querySelector('p').innerHTML = avgWaterConsumed(userHydrationData);
}

function waterConsumedToday(data){
    var today = data.slice(-1)[0]
    var waterConsumedToday = data.find((point) => point === today);
    return waterConsumedToday.numOunces;
}

function avgWaterConsumed(data) {
    var total = data.reduce((acc, point) => {
        acc += point.numOunces;
        return acc;
    }, 0)
    var days = data.length;
    var avg = total / days;
    return Math.round(avg);
};

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
function sleep(id) {
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Activity   👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function activity(id) {
}