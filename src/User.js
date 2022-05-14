class User {
    constructor(userData){
        this.id = userData.id;
        this.name = userData.name;
        this.address = userData.address;
        this.email = userData.email;
        this.strideLength = userData.strideLength;
        this.dailyStepGoal = userData.dailyStepGoal;
        this.friends = userData.friends;
    }
    returnFirstName(){
        var first = this.name.split(' ');
        first = first[0];
        return first;
        
    }
}
module.exports = User
//export default User;