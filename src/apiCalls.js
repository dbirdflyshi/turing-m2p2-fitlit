//Your fetch requests will live here!
export let fetchUserData = () => {
    return fetch("https://fitlit-api.herokuapp.com/api/v1/users")
    .then(response => response.json())
}
export let fetchSleepData = () => {
    return fetch("https://fitlit-api.herokuapp.com/api/v1/sleep")
        .then(response => response.json())
}
export let fetchHydrationData = () => {
    return fetch("https://fitlit-api.herokuapp.com/api/v1/hydration")
        .then(response => response.json())
}
export let fetchActivityData = () => {
    return fetch("https://fitlit-api.herokuapp.com/api/v1/activity")
        .then(response => response.json())
}