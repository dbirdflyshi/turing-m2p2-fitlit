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
const userData = require('./data/users');
import './css/styles.css';
import './images/water.png'
import './images/exercise.png'
import './images/sleep.png'
import './images/logo.png'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// query selector variables go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var userCard = document.querySelector('#userData')
var waterButton = document.querySelector('#water');
var exerciseButton = document.querySelector('#water');
var sleepButton = document.querySelector('#water');
var userList = document.querySelector('#users');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// event listeners go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//waterButton.addEventListener('click', outputSomething);

document.getElementById("users").onchange = chooseUser;


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Global Variables Go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const userRepo = buildRepo();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// functions and event handlers go here 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

loadUserData(1);

loadUserListDropdown();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Build User Repository 👇
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function buildRepo(){
    // Creating the repo skeleton
    var userClasses = [];
    // converting the object array to a class instance of User array
    userData.map((user) => {
        userClasses.push(new User(user))
    })
    // Creating the class instance of UserRepository object
    return new UserRepository(userClasses);
};

function getStepGoalAvg(){
    var total = userRepo.users.reduce((acc,user) =>{
        acc += user.dailyStepGoal;
        return acc;
    },0)
    var userCount = userRepo.users.length;
    var avg = total / userCount
    return avg;
}

function loadUserData(id){
    var user = userRepo.users.find((user) => user.id === id);
    console.log(user)
    var stepGoalRating;
    user.dailyStepGoal > getStepGoalAvg() ? stepGoalRating = 'Above Average' : stepGoalRating = 'Above Average'
    
    userCard.innerHTML = `<ul id="userData">
                    <li>Name :<span style=\"color:rgba(230, 196, 157, 1)\"> ${user.name}</span></li>
                    <li>Address :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.address}</span></li>
                    <li>Email :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.email}</span></li>
                    <li>Stride :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.strideLength}</span></li>
                    <li>Step Goal :<span style=\"color:rgba(230, 196, 157, 1)\">  ${user.dailyStepGoal}</span></li>
                    <li>Goal Rating:<span style=\"color:rgba(230, 196, 157, 1)\">  ${stepGoalRating}</span></li>
                </ul>`
}

function loadUserListDropdown(){
    var userSelectList ='';
    userRepo.users.forEach((user) => {userSelectList+=`<option value=${user.id}>${user.name}</option>`});
    userList.innerHTML = `<select name="users" id="users">${userSelectList}</select>`
}

function chooseUser() {
    var selection = document.getElementById("users");
    var option = parseInt(selection.options[selection.selectedIndex].value);
    loadUserData(option);
}