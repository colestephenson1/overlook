//****** IMPORTS ********
import './css/styles.css';
import {fetchData} from './apiCalls';
import Customer from './classes/customer'
import Hotel from './classes/hotel'

//******** QUERY SELECTORS *********
const amountSpent = document.querySelector('.amount-spent');
const seeFutureBookingsButton = document.querySelector('.toggle-bookings-button2');
const seePastBookingsButton = document.querySelector('.toggle-bookings-button1');
const futureBookingsContainer = document.querySelector('.future-bookings-container');
const pastBookingsContainer = document.querySelector('.past-bookings-container');
const dateSearchInput = document.querySelector('.dates-search-input');
const checkDatesButton = document.querySelector('.check-dates-button');
// const = document.querySelector('');
// const = document.querySelector('');
// const = document.querySelector('');
// const = document.querySelector('');
// const = document.querySelector('');
// const = document.querySelector('');


//******* GLOBAL VARIABLES *******
let roomData;
let bookingsData;
let customerData;
let customer;
let hotel;

//******* PROMISE ALL ********
function getPromiseData() {
  Promise.all( [fetchData('rooms'), fetchData('bookings'), fetchData('customers')]).then(data => {
    roomData = data[0].rooms;
    bookingsData = data[1].bookings;
    customerData = data[2].customers;
    customer = new Customer(customerData[0]);
    hotel = new Hotel(roomData, bookingsData);
    showFutureBookings()
  })
}


window.addEventListener('load', getPromiseData);
// window.addEventListener('load', showFutureBookings);


function showFutureBookings() {
  let futureBookings = customer.returnFutureBookings();
  console.log(futureBookings)
}
