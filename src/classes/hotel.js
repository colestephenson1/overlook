import rooms from '../mockData/mock-rooms';
import bookings from '../mockData/mock-bookings';
import customers from '../mockData/mock-customers';


class Hotel {
  constructor(index, rooms, bookings) {
    this.rooms = rooms;
    this.bookings = bookings;
    this.customer = customers[index];
    this.filteredRoomsByDate = null;
    this.filteredRoomsByType = null;
    this.amountSpent = 0;
  }

  returnAllBookings() {
    return this.bookings.filter(booking => this.customer.id === booking.userID);
  }

  returnPastBookings() {
    let date = new Date().toJSON().slice(0, 10);
    return this.bookings.filter(booking => {
      if (this.customer.id === booking.userID) {
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
    return this.bookings.filter(booking => {
      if (this.customer.id === booking.userID) {
        let splitCurrentDate = date.split('-').map(time => parseInt(time));
        let splitBookingDate = booking.date.split('/').map(time => parseInt(time));
        if (splitCurrentDate[0] < splitBookingDate[0] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] < splitBookingDate[1] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] === splitBookingDate[1] && splitCurrentDate[2] < splitBookingDate[2]) {
          return true;
        }
      }
    })
  }

  returnPastBookingRoomInfo() {
    const pastBookings = this.returnPastBookings();
    return pastBookings.reduce((array, booking) => {
      this.rooms.forEach(room => {
        if (booking.roomNumber === room.number) {
          let yesOrNo;
          if (room.bidet) {
            yesOrNo = 'Yes';
          } else {
            yesOrNo = 'No';
          }
          let roomInfo = `Date: ${booking.date},\nRoom: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`;
          array.push(roomInfo);
        }
      })
      return array
    }, [])
  }

  returnFutureBookingRoomInfo() {
    const futureBookings = this.returnFutureBookings();
    return futureBookings.reduce((array, booking) => {
      this.rooms.forEach(room => {
        if (booking.roomNumber === room.number) {
          let yesOrNo;
          if (room.bidet) {
            yesOrNo = 'Yes';
          } else {
            yesOrNo = 'No';
          }
          let roomInfo = `Date: ${booking.date},\nRoom: ${room.number},\nRoom Type: ${room.roomType},\nBidet: ${yesOrNo},\nBed Size: ${room.bedSize},\n# of Beds: ${room.numBeds}, \nCost Per Night: $${room.costPerNight}`;
          array.push(roomInfo);
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
    let parsedAmount = parseInt(amount.toFixed(2));
    this.amountSpent = parsedAmount;
    return parsedAmount;
  }


  showRoomsByDate(desiredDate) {
    let date = new Date().toJSON().slice(0, 10);
    let splitCurrentDate = date.split('-').map(date => parseInt(date));
    let splitBookingDate = desiredDate.split('/').map(date => parseInt(date));
    if (splitCurrentDate[0] > splitBookingDate[0] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] > splitBookingDate[1] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] === splitBookingDate[1] && splitCurrentDate[2] > splitBookingDate[2] || desiredDate === '') {
      this.filteredRoomsByDate = null;
      return 'Sorry! Either this is a past date or no rooms are available. Please try again.';
    } else {
      const bookingsOnDate = this.bookings.filter(booking => booking.date === desiredDate).map(booking => booking.roomNumber);
      const filteredRooms = this.rooms.filter(room => !bookingsOnDate.includes(room.number));
      this.filteredRoomsByDate = filteredRooms;
      return filteredRooms;
    }
  }

  showRoomsByType(type) {
    const filteredMatchingType = this.rooms.filter(room => type === room.roomType)
    if (filteredMatchingType.length === 0) {
      this.filteredRoomsByType = null;
      return 'Sorry! This is not a valid room type (suite, junior suite, residential suite, single bedroom). Please try again.';
    } else {
      const filteredRooms = this.filteredRoomsByDate.filter(room => room.roomType === type);
      this.filteredRoomsByType = filteredRooms;
      return filteredRooms;
    }
  }
}

export default Hotel
