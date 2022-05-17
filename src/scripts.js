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
var waterButton = document.querySelector('#water');
var exerciseButton = document.querySelector('#water');
var sleepButton = document.querySelector('#water');


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
        //const userSleepData = buildRepo(data[1]);
        const userHydrationData = data[2].hydrationData;
        console.log(userHydrationData[0]);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event listeners 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //waterButton.addEventListener('click', outputSomething);
        //document.getElementById("users").onchange = chooseUser;
        document.getElementById("users").onchange = () => chooseUser(userDataList);


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Load User Info Sidebar 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        loadUserData(userDataList, 1);


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Load User DropDown 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        loadUserListDropdown(userDataList);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Load Default Hydration 👇
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //loadHydrationMetrics();
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

