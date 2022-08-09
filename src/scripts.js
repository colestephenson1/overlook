//****** IMPORTS ********

import './css/styles.css';
import {fetchData} from './apiCalls';
import Customer from './classes/customer';
import Hotel from './classes/hotel';


//******** QUERY SELECTORS *********

const amountSpent = document.querySelector('.amount-spent');
const seeFutureBookingsButton = document.querySelector('.toggle-bookings-button2');
const seePastBookingsButton = document.querySelector('.toggle-bookings-button1');
const futureBookingsContainer = document.querySelector('.future-bookings-container');
const pastBookingsContainer = document.querySelector('.past-bookings-container');
const dateSearchInput = document.querySelector('.dates-search-input');
const checkDatesButton = document.querySelector('.check-dates-button');
const filteredContainer = document.querySelector('.filtered-bookings-container');
const searchByDateInput= document.querySelector('.dates-search-input');
const navBarInstructions = document.querySelector('.instructions');
const navBar = document.querySelector('.nav-bar');
const searchRoomTypeButton = document.querySelector('.search-room-type-button');
const searchRoomInputBox= document.querySelector('.search-room-input-box');
const searchByRoomTypeInput= document.querySelector('.room-search-input');
const homeButton = document.querySelector('.home-button');
const instructionsBox = document.querySelector('.instructions-box');
const loginContainer = document.querySelector('.login-container');
const usernameInput = document.querySelector('.username-input');
const passwordInput = document.querySelector('.password-input');
const loginButton = document.querySelector('.login-button');
const loginGreeting = document.querySelector('.login-greeting');
const userWelcome = document.querySelector('.user-welcome');


//******* GLOBAL VARIABLES *******

let roomData;
let bookingsData;
let customerData;
let customer;
let hotel;
let desiredDate;

//******* PROMISE ALL ********

function getPromiseData() {
  Promise.all( [fetchData('rooms'), fetchData('bookings'), fetchData('customers')]).then(data => {
    roomData = data[0].rooms;
    bookingsData = data[1].bookings;
    customerData = data[2].customers;
    customer = new Customer(customerData[1]);
    hotel = new Hotel(2, roomData, bookingsData);
  })
}

// ***** Event Listeners ******

window.addEventListener('load', getPromiseData);
seePastBookingsButton.addEventListener('click', seePastBookings);
seeFutureBookingsButton.addEventListener('click', seeFutureBookings);
checkDatesButton.addEventListener('click', seeFilteredBookings);
searchRoomTypeButton.addEventListener('click', populateFilteredRooms);
homeButton.addEventListener('click', seeUpdatedFutureBookings);
filteredContainer.addEventListener('click', checkForCheckmark);
loginButton.addEventListener('click', login)

// ***** Functions *****

//Functions to populate the different containers

function populatePastBookings() {
  const bookingsWithRoomInfo = hotel.returnPastBookingRoomInfo();
  instructionsBox.innerHTML = ''
  instructionsBox.innerHTML += `<p class='instructions'>Click the Button below to Toggle between your Past and Future Bookings!</p>
  <p class='instructions'>Or, Search for a Date to Book with the Button on the Right!</p>`;
  pastBookingsContainer.innerHTML  = '';
  let count = 0;
  bookingsWithRoomInfo.forEach(booking => {
    count++;
    pastBookingsContainer.innerHTML += `
    <section role='gridcell' class='booking-box'>
      <p tabindex='0' class='booking-info'>Booking ${count}</p>
      <p tabindex='0' class='booking-info'>${booking}</p>
    </section>`
  })
}


function populateFutureBookings() {
  if (customer.amountSpent === 0) {
    amountSpent.innerText = `Amount Spent: $${hotel.returnTotalAmountSpent()}`;
  } else {
    amountSpent.innerText = `Amount Spent: $${customer.amountSpent}`;
  }
  const bookingsWithRoomInfo = hotel.returnFutureBookingRoomInfo();
  let count = 0;
  futureBookingsContainer.innerHTML  = '';
  bookingsWithRoomInfo.forEach(booking => {
    count++
    futureBookingsContainer.innerHTML += `
    <section role='gridcell' class='booking-box'>
      <p tabindex='0' class='booking-info'>Booking ${count}</p>
      <p tabindex='0' class='booking-info'>${booking}</p>
    </section>`
  })
}

function populateAvailableRooms() {
  let rejoinedDate = searchByDateInput.value.split('-').join('/')
  const availableRooms = hotel.showRoomsByDate(rejoinedDate)
  desiredDate = rejoinedDate;
  filteredContainer.innerHTML = '';
  if (availableRooms === 'Sorry! Either this is a past date or no rooms are available. Please try again.') {
    filteredContainer.innerHTML += `<p class='filtered-error-response'>${availableRooms}</p>`;
    show([searchRoomInputBox]);
    hide([searchRoomTypeButton, searchByRoomTypeInput]);
  } else {
    show([searchRoomInputBox, searchRoomTypeButton, searchByRoomTypeInput])
    const availableRoomStrings = availableRooms.reduce((array, room) => {
        let yesOrNo;
        if (room.bidet) {
          yesOrNo = 'Yes';
        } else {
          yesOrNo = 'No';
        }
        let roomInfo = `Room: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`;
        array.push(roomInfo);
      return array;
    }, [])

    availableRoomStrings.forEach(string => {
      let parsedID = parseInt(string.substring(6, 9));
      filteredContainer.innerHTML += `<section role='gridcell' class='booking-box'>
        <p tabindex='0' class='booking-info'>${string}</p>
        <input type="image" src='./assets/checkmark.png' name="checkmark" class="checkmark" id=${parsedID}/>
      </section>`;
      instructionsBox.innerHTML = '';
      instructionsBox.innerHTML += '<p tabindex="0" class="instructions">Click a green checkmark to book a room!</p>';
    })
  }
}

function populateFilteredRooms() {
  const filteredRooms = hotel.showRoomsByType(searchByRoomTypeInput.value);
  filteredContainer.innerHTML = '';
  if (filteredRooms === 'Sorry! This is not a valid room type (suite, junior suite, residential suite, single bedroom). Please try again.') {
    instructionsBox.innerHTML = '';
    filteredContainer.innerHTML += `<p class='filtered-error-response'>${filteredRooms}</p>`;
  } else {
    instructionsBox.innerHTML = '';
    instructionsBox.innerHTML = '<p class="instructions">Click a green checkmark to book a room!</p>';
    const filteredRoomStrings = filteredRooms.reduce((array, room) => {
        let yesOrNo;
        if (room.bidet) {
          yesOrNo = 'Yes';
        } else {
          yesOrNo = 'No';
        }
        let roomInfo = `Room: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`;
        array.push(roomInfo);
      return array
    }, [])

    filteredRoomStrings.forEach(string => {
      let parsedID = parseInt(string.substring(6, 9));
      filteredContainer.innerHTML += `<section role='gridcell' class='booking-box'>
        <p tabindex='0' class='booking-info'>${string}</p>
        <input type="image" src='./assets/checkmark.png' name="checkmark" class="checkmark" id=${parsedID}/>
      </section>`;
    })
  }
}

// Function for our event.target

function checkForCheckmark(event) {
  event.preventDefault();
  if (event.target.classList.contains('checkmark')) {
    postBooking(event.target.id);
  }
}

//Functions to post a booking to the local server and update total amount spent

function postBooking(roomNum) {
  let rejoinedDate = desiredDate.split('-').join('/');
  let parsedRoom = parseInt(roomNum);
  fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
   headers: {'Content-type': 'application/json'},
   body: JSON.stringify({userID: hotel.customer.id, date: rejoinedDate, roomNumber: parsedRoom})
  })
  .then(response => {
    instructionsBox.innerHTML = '';
  instructionsBox.innerHTML += '<p class="instructions">Room Booked! Search for another day to book another room.</p>';
  getPromiseData2(roomNum);
  })
}

function updateTotalSpent(roomNum) {
  roomData.forEach(room => {
    let parsedNum = parseInt(room.number);
    let parsedInput = parseInt(roomNum);
    if(parsedNum === parsedInput) {
      hotel.amountSpent = hotel.amountSpent += room.costPerNight;
    }
  })
  amountSpent.innerText = `Amount Spent: $${parseInt(hotel.returnTotalAmountSpent().toFixed(2))}`;
}

//Functions for logging in

function login() {
  customerData.forEach(customer => {
    let customerID = parseInt(usernameInput.value.substring(8, 10));
    let reqCustomerString = usernameInput.value.substring(0, 8);
    if (reqCustomerString === 'customer' && customerID === customer.id && passwordInput.value === 'overlook2021' ) {
      hotel = new Hotel(customer.id - 1, roomData, bookingsData);
      customer = new Customer(customerData[customer.id - 1]);
      seeFutureBookings();
      greetCustomer(customer);
    } else if (usernameInput.value === '' || passwordInput.value === '') {
      loginGreeting.innerText = 'Error: Please fill out the required fields and resubmit.';
    } else if (reqCustomerString !== 'customer' || customerID > 50 || isNaN(customerID)) {
      loginGreeting.innerText = 'Error: Invalid Username.'
    } else if (passwordInput.value !== 'overlook2021') {
      loginGreeting.innerText = 'Error: Invalid Password.'
    }
  })
}

// function logout () {
//   hide([navBar, seePastBookingsButton, seeFutureBookingsButton, futureBookingsContainer, filteredContainer, searchRoomInputBox, pastBookingsContainer])
//   show([loginContainer])
// }

function getPromiseData2(roomNum) {
  Promise.all( [fetchData('rooms'), fetchData('bookings'), fetchData('customers')]).then(data => {
    roomData = data[0].rooms;
    bookingsData = data[1].bookings;
    customerData = data[2].customers;
    customerData.forEach(customer => {
      let customerID = parseInt(usernameInput.value.substring(8, 10));
      let reqCustomerString = usernameInput.value.substring(0, 8);
      if (reqCustomerString === 'customer' && customerID === customer.id) {
        hotel = new Hotel(customer.id - 1, roomData, bookingsData);
        seeFutureBookings();
        updateTotalSpent(roomNum)
      }
    })
  })
}


function greetCustomer(customer) {
  userWelcome.innerText = '';
  userWelcome.innerText = `Welcome to Overlook, ${customer.name}!`;
}

// Functions to hide and show elements

function seePastBookings() {
  hide([seePastBookingsButton, futureBookingsContainer, filteredContainer, searchRoomInputBox]);
  show([seeFutureBookingsButton, pastBookingsContainer]);
  populatePastBookings()
}

function seeFutureBookings() {
  show([seePastBookingsButton, futureBookingsContainer, navBar]);
  hide([seeFutureBookingsButton, pastBookingsContainer, filteredContainer,  searchRoomInputBox, loginContainer]);
  populateFutureBookings();
}

function seeUpdatedFutureBookings() {
  seeFutureBookings();
  instructionsBox.innerHTML = ''
  instructionsBox.innerHTML += `<p class='instructions'>Click the Button below to Toggle between your Past and Future Bookings!</p>
  <p class='instructions'>Or, Search for a Date to Book with the Button on the Right!</p>`;
}

function seeFilteredBookings() {
  hide([seeFutureBookingsButton, seePastBookingsButton, pastBookingsContainer, futureBookingsContainer]);
  show([filteredContainer, searchRoomInputBox]);
  populateAvailableRooms();
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
