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
    seeFutureBookings()
  })
}


window.addEventListener('load', getPromiseData);
seePastBookingsButton.addEventListener('click', seePastBookings)
seeFutureBookingsButton.addEventListener('click', seeFutureBookings)
// window.addEventListener('load', showFutureBookings);


function showFutureBookings() {
  let futureBookings = customer.returnFutureBookings();
  console.log(futureBookings)
}



function populatePastBookings() {
  const bookingsWithRoomInfo = customer.returnPastBookingRoomInfo()
  pastBookingsContainer.innerHTML  = '';
  let count = 0;
  bookingsWithRoomInfo.forEach(booking => {
    count++
    pastBookingsContainer.innerHTML += `
    <section class ='booking-box'>
      <p class='booking-info'>Booking ${count}</p>
      <p class='booking-info'>${booking}</p>
    </section>`
  })
}


function populateFutureBookings() {
  const bookingsWithRoomInfo = customer.returnFutureBookingRoomInfo()
  futureBookingsContainer.innerHTML  = '';
  let count = 0;
  bookingsWithRoomInfo.forEach(booking => {
    count++
    futureBookingsContainer.innerHTML += `
    <section class ='booking-box'>
      <p class='booking-info'>Booking ${count}</p>
      <p class='booking-info'>${booking}</p>
    </section>`
  })
}




// functions to hide and show elements


function seePastBookings() {
  hide([seePastBookingsButton, futureBookingsContainer]);
  show([seeFutureBookingsButton, pastBookingsContainer])
  populatePastBookings()
}

function seeFutureBookings() {
  show([seePastBookingsButton, futureBookingsContainer]);
  hide([seeFutureBookingsButton, pastBookingsContainer])
  populateFutureBookings()
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add('hidden');
  })
}

function show(elements) {
  elements.forEach((element) => {
    element.classList.remove('hidden');
  })
}
