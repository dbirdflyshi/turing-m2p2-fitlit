var User = require('./User.js')
class UserRepository {
    constructor(data){
        this.users = data;
    }
    getUserData(id){
        // probably a find or filter function
        // something like this.users.find((user) => {user.id === id});
    }
    getAvgStepGoal(){
        // Probably a map for all step goals in a list
        // then sum them
        // then divide by length 
        // return avg variable
        return avg;
    }
}
module.exports = UserRepository
//export default UserRepository;