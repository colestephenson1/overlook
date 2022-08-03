import chai from 'chai';
const expect = chai.expect;
import Customer from '../src/classes/customer';
import customers from '../src/mockData/mock-customers'

describe('Customer', () => {

let customer;
let customer2;
let splitCurrentDate;

  beforeEach( () => {
    customer = new Customer(customers[0]);
    customer2 = new Customer(customers[1]);
    splitCurrentDate = new Date().toJSON().slice(0, 10);
  })

  it('Should be able to return all bookings for each customer', () => {
    const bookingIDs1 = (customer.returnAllBookings()).map(booking => booking.userID)
    const bookingIDs2 = (customer2.returnAllBookings()).map(booking => booking.userID)
    expect(bookingIDs1.every(id => id === 1)).to.equal(true)
    expect(bookingIDs2.every(id => id === 2)).to.equal(true)
  })

  it('Should be able to return past bookings for a customer', () => {
    let pastBookings1 = customer.returnPastBookings();
    console.log(pastBookings1)
    expect(pastBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(pastBookings1[0].date).to.equal('2022/02/05')
    expect(pastBookings1[1].date).to.equal('2022/01/19')
    expect(pastBookings1[2].date).to.equal('2022/01/18')
    expect(pastBookings1[3].date).to.equal('2022/01/26')
    // pastBookings1.forEach(booking => {
    //   let splitDate = booking.date.split('/')
    //     if(splitDate[0] === 2022) {
    //     expect(splitDate[1]).to.be.below(9)
    //   } else if (splitDate[0] === 2022 && splitDate[1] === 8) {
    //     expect(splitDate[2]).to.be.below(3)
    //   } else if (splitDate[1] > 8) {
    //     expect(parseInt(splitDate[0])).to.be.below(2022)
    //   } else if (splitDate[0] === 2022 && splitDate[2] >= 3) {
    //     expect(splitDate[1]).to.be.below(8)
    //   }
    // })
  })

  it('Should be able to return future bookings for a customer', () => {
    let futureBookings1 = customer.returnFutureBookings();
    expect(futureBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(futureBookings1[0].date).to.equal('2023/01/11')
    expect(futureBookings1[1].date).to.equal('2022/11/06')
    expect(futureBookings1[2].date).to.equal('2023/12/22')
    expect(futureBookings1[3].date).to.equal('2023/02/12')
    // futureBookings1.forEach(booking => {
    //   let splitDate = booking.date.split('/')
    //     if(splitDate[0] === splitCurrentDate[0] && splitDate[2] < splitCurrentDate[2]) {
    //     expect(splitDate[1]).to.be.above(splitCurrentDate[1])
    //   } else if (splitDate[0] === 2022 && splitDate[1] === 8) {
    //     expect(splitDate[2]).to.be.above(2)
    //   } else if (splitDate[0] < 8 && splitDate[2] < 3) {
    //     expect(parseInt(splitDate[0])).to.be.above(2022)
    //   }
    // })
  })

})
