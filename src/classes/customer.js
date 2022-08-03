import bookings from '../mockData/mock-bookings';
class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.name = customer.name;
  }

  returnAllBookings() {
    return bookings.filter(booking => this.id === booking.userID)
  }

  returnPastBookings() {
    return bookings.filter(booking => {
      if (this.id === booking.userID) {
        let splitDate = booking.date.split('/').map(date => parseInt(date));
        if (splitDate[0] <= 2022 && splitDate[1] <= 8  && splitDate[1] <= 3) {
          return true;
        }
      }
    })
  }

  returnFutureBookings() {
    return bookings.filter(booking => {
      if (this.id === booking.userID) {
        let splitDate = booking.date.split('/').map(date => parseInt(date));
        if (splitDate[0] === 2022 && splitDate[1] >= 8  && splitDate[1] >= 3 || splitDate[0] >= 2023 ) {
          return true;
        }
      }
    })
  }

}

export default Customer;
