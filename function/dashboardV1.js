var response2;
indexDB.set('recentStories', recentStories);
indexDB.set('userDashboard', userDashboard);
//console.log(userDashboard)
var newStorageInstance = new StorageHelper('userDashboard', userDashboard);
console.log(newStorageInstance);
//var activeListernersInstance = new ActionEvent(activeListerners);
//console.log(activeListernersInstance);

//var currentSessionHistory = newStorageInstance.set('currentSessionHistory',[window.location]);
//StorageHelper.set('userDashboard', userDashboard);
//var userDashboardFromStorage = StorageHelper.get('userDashboard');
//console.log(newStorageInstance.entity)

var actionSpaceElementInstanceIndom = document.getElementById('actionSpaceContainer');
var actionSpaceInstance = new Entity(userDashboard, actionSpaceElementInstanceIndom);

console.log("active", activeListerners);

let events = operate.find(activeListerners, 'on', 'values')

console.log("active listener", events);

let windowEvents = operate.find(window, 'on', 'keys')

console.log(windowEvents);

window.onload = function () {
    var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log('Dahsboard.js Page load time is ' + loadTime);
}