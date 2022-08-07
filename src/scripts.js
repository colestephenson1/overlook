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
const filteredContainer = document.querySelector('.filtered-bookings-container');
const searchByDateInput= document.querySelector('.dates-search-input');
const navBarInstructions = document.querySelector('.instructions');
const searchRoomTypeButton = document.querySelector('.search-room-type-button');
const searchRoomInputBox= document.querySelector('.search-room-input-box');
const searchByRoomTypeInput= document.querySelector('.room-search-input');
const homeButton = document.querySelector('.home-button');


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
    hotel = new Hotel(roomData, bookingsData);
    seeFutureBookings()
  })
}

// ***** Event Listeners ******

window.addEventListener('load', getPromiseData);
seePastBookingsButton.addEventListener('click', seePastBookings)
seeFutureBookingsButton.addEventListener('click', seeFutureBookings)
checkDatesButton.addEventListener('click', seeFilteredBookings)
searchRoomTypeButton.addEventListener('click', populateFilteredRooms)
homeButton.addEventListener('click', seeFutureBookings)
filteredContainer.addEventListener('click', checkForCheckmark)

// ***** Functions *****

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
  if (customer.amountSpent === 0) {
    amountSpent.innerText = `Amount Spent: $${customer.returnTotalAmountSpent()}`;
  } else {
    amountSpent.innerText = `Amount Spent: $${customer.amountSpent}`;
  }
  const bookingsWithRoomInfo = customer.returnFutureBookingRoomInfo();
  let count = 0;
  futureBookingsContainer.innerHTML  = '';
  bookingsWithRoomInfo.forEach(booking => {
    count++
    futureBookingsContainer.innerHTML += `
    <section class ='booking-box'>
      <p class='booking-info'>Booking ${count}</p>
      <p class='booking-info'>${booking}</p>
    </section>`
  })
}

function populateAvailableRooms() {
  const availableRooms = hotel.showRoomsByDate(searchByDateInput.value)
  desiredDate = searchByDateInput.value;
  filteredContainer.innerHTML = '';
  if (availableRooms === 'Sorry! Either this is a past date or no rooms are available. Please try again.') {
    filteredContainer.innerHTML += `<p class='filtered-error-response'>${availableRooms}</p>`;
    hide([searchRoomInputBox])
  } else {
    show([searchRoomInputBox])
    const availableRoomStrings = availableRooms.reduce((array, room) => {
        let yesOrNo;
        if (room.bidet) {
          yesOrNo = 'Yes'
        } else {
          yesOrNo = 'No'
        }
        let roomInfo = `Room: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`
        array.push(roomInfo)
      return array
    }, [])

    availableRoomStrings.forEach(string => {
      let parsedID = parseInt(string.substring(6, 9))
      filteredContainer.innerHTML += `<section class ='booking-box' id=''>
        <p class='booking-info'>${string}</p>
        <img class='checkmark' id=${parsedID} src='./assets/checkmark.png'>
      </section>`
      navBarInstructions.innerText = ''
      navBarInstructions.innerText += 'Click a green checkmark to book a room!'
    })

  }
}

function populateFilteredRooms() {
  const filteredRooms = hotel.showRoomsByType(searchByRoomTypeInput.value)
  filteredContainer.innerHTML = '';
  if (filteredRooms === 'Sorry! This is not a valid room type (suite, junior suite, residential suite, single bedroom). Please try again.') {
    filteredContainer.innerHTML += `<p class='filtered-error-response'>${filteredRooms}</p>`;
  } else {
    const filteredRoomStrings = filteredRooms.reduce((array, room) => {
        let yesOrNo;
        if (room.bidet) {
          yesOrNo = 'Yes'
        } else {
          yesOrNo = 'No'
        }
        let roomInfo = `Room: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`
        array.push(roomInfo)
      return array
    }, [])

    filteredRoomStrings.forEach(string => {
      let parsedID = parseInt(string.substring(6, 9))
      filteredContainer.innerHTML += `<section class ='booking-box'>
        <p class='booking-info'>${string}</p>
        <img class='checkmark' id=${parsedID} src='./assets/checkmark.png'>
      </section>`
    })

  }
}


function checkForCheckmark(event) {
  event.preventDefault();
  if (event.target.classList.contains('checkmark')) {
    postBooking(event.target.id);
  }
}

function postBooking(roomNum) {
  let parsedRoom = parseInt(roomNum);
  fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
   headers: {'Content-type': 'application/json'},
   body: JSON.stringify({userID: customer.id, date: desiredDate, roomNumber: parsedRoom})
  })
  .then(response => response.json())
  .then(response => {
  navBarInstructions.innerText = 'Room Booked! Click another checkmark to book another room on this day.';
  updateData()
  updateTotalSpent(roomNum)
  })

}

function updateTotalSpent(roomNum) {
  roomData.forEach(room => {
    let parsedNum = parseInt(room.number)
    let parsedInput = parseInt(roomNum)
    if(parsedNum === parsedInput) {
      customer.amountSpent += room.costPerNight;
    }
  })
  amountSpent.innerText = `Amount Spent: $${parseInt(customer.amountSpent.toFixed(2))}`
}

function updateData() {
  return fetch('http://localhost:3001/api/v1/bookings')
  .then(response => response.json())
  .then(data => {
    bookingsData = data.bookings;
    console.log(bookingsData)
  })
  .catch(err => console.log(error))
}

function repopulateAvailableRooms() {
  const availableRooms = hotel.showRoomsByDate(desiredDate)
  desiredDate = searchByDateInput.value;
  filteredContainer.innerHTML = '';
  if (availableRooms === 'Sorry! Either this is a past date or no rooms are available. Please try again.') {
    filteredContainer.innerHTML += `<p class='filtered-error-response'>${availableRooms}</p>`;
    hide([searchRoomInputBox])
  } else {
    show([searchRoomInputBox])
    const availableRoomStrings = availableRooms.reduce((array, room) => {
        let yesOrNo;
        if (room.bidet) {
          yesOrNo = 'Yes'
        } else {
          yesOrNo = 'No'
        }
        let roomInfo = `Room: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`
        array.push(roomInfo)
      return array
    }, [])

    availableRoomStrings.forEach(string => {
      let parsedID = parseInt(string.substring(6, 9))
      filteredContainer.innerHTML += `<section class ='booking-box' id=''>
        <p class='booking-info'>${string}</p>
        <img class='checkmark' id=${parsedID} src='./assets/checkmark.png'>
      </section>`
      navBarInstructions.innerText = ''
      navBarInstructions.innerText += 'Congrats! Your room has been booked! Click another green checkmark to book again.'
    })

  }
}

// Functions to hide and show elements


function seePastBookings() {
  hide([seePastBookingsButton, futureBookingsContainer, filteredContainer, searchRoomInputBox]);
  show([seeFutureBookingsButton, pastBookingsContainer]);
  populatePastBookings()
}

function seeFutureBookings() {
  show([seePastBookingsButton, futureBookingsContainer]);
  hide([seeFutureBookingsButton, pastBookingsContainer, filteredContainer,  searchRoomInputBox]);
  populateFutureBookings();
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
