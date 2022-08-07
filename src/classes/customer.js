import rooms from '../mockData/mock-rooms'

let bookings;

fetch('http://localhost:3001/api/v1/bookings')
  .then(response => response.json())
  .then(data => {
    bookings = data.bookings;
  })
  .catch(err => console.log(error))

class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.amountSpent = 0;
    // this.seeFutureBookings = true;
  }

  returnAllBookings() {
    return bookings.filter(booking => this.id === booking.userID)
  }

  returnPastBookings() {
    let date = new Date().toJSON().slice(0, 10);
    return bookings.filter(booking => {
      if (this.id === booking.userID) {
        let splitBookingDate = booking.date.split('/').map(date => parseInt(date));
        let splitCurrentDate = date.split('-').map(date => parseInt(date));
        if (splitCurrentDate[0] > splitBookingDate[0] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] > splitBookingDate[1] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] === splitBookingDate[1] && splitCurrentDate[2] > splitBookingDate[2]) {
          return true;
        }
      }
    })
  }

  returnFutureBookings() {
    let date = new Date().toJSON().slice(0, 10);
    return bookings.filter(booking => {
      if (this.id === booking.userID) {
        let splitCurrentDate = date.split('-').map(time => parseInt(time));
        let splitBookingDate = booking.date.split('/').map(time => parseInt(time))
        if (splitCurrentDate[0] < splitBookingDate[0] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] < splitBookingDate[1] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] === splitBookingDate[1] && splitCurrentDate[2] < splitBookingDate[2]) {
          return true;
        }
      }
    })
  }

  returnPastBookingRoomInfo() {
    const pastBookings = this.returnPastBookings();
    return pastBookings.reduce((array, booking) => {
      rooms.forEach(room => {
        if (booking.roomNumber === room.number) {
          let yesOrNo;
          if (room.bidet) {
            yesOrNo = 'Yes'
          } else {
            yesOrNo = 'No'
          }
          let roomInfo = `Date: ${booking.date},\nRoom: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`
          array.push(roomInfo)
        }
      })
      return array
    }, [])
  }

  returnFutureBookingRoomInfo() {
    const pastBookings = this.returnFutureBookings();
    return pastBookings.reduce((array, booking) => {
      rooms.forEach(room => {
        if (booking.roomNumber === room.number) {
          let yesOrNo;
          if (room.bidet) {
            yesOrNo = 'Yes'
          } else {
            yesOrNo = 'No'
          }
          let roomInfo = `Date: ${booking.date},\nRoom: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`
          array.push(roomInfo)
        }
      })
      return array
    }, [])
  }

  returnTotalAmountSpent() {
    const allUserBookings = this.returnAllBookings()
    const amount = allUserBookings.reduce((total, booking) => {
        rooms.forEach(room => {
          if (room.number === booking.roomNumber) {
            total += room.costPerNight;
          }
        })
      return total
    }, 0)
    let parsedAmount = parseInt(amount.toFixed(2))
    this.amountSpent = parsedAmount;
    return parsedAmount;
  }

}

export default Customer;
