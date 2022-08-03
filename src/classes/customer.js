import bookings from '../mockData/mock-bookings';
class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.amountSpent = 0;
    this.seeFutureBookings = true;
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

}

export default Customer;
