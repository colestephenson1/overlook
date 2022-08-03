// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import {fetchData} from './apiCalls';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)

let roomData;
let bookingsData;
let customerData;
let customer;

function getPromiseData() {
  Promise.all( [fetchData('rooms'), fetchData('bookings'), fetchData('customers')]).then(data => {
    roomData = data[0].rooms;
    bookingsData = data[1].bookings;
    customerData = data[2].customers;
    console.log(roomData)
    console.log(bookingsData)
    console.log(customerData)
  })
}


window.addEventListener('load', getPromiseData)
