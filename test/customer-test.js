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

  it('Should be an instance of Customer', () => {
    expect(customer).to.be.an.instanceOf(Customer);
  })

  it('Should be able to return all bookings for each customer', () => {
    const bookingIDs1 = (customer.returnAllBookings()).map(booking => booking.userID)
    const bookingIDs2 = (customer2.returnAllBookings()).map(booking => booking.userID)
    expect(bookingIDs1.every(id => id === 1)).to.equal(true)
    expect(bookingIDs2.every(id => id === 2)).to.equal(true)
  })

  it('Should be able to return past bookings for a customer', () => {
    let pastBookings1 = customer.returnPastBookings();
    expect(pastBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(pastBookings1[0].date).to.equal('2022/02/05')
    expect(pastBookings1[1].date).to.equal('2022/01/19')
    expect(pastBookings1[2].date).to.equal('2022/01/18')
    expect(pastBookings1[3].date).to.equal('2022/01/26')
  })

  it('Should be able to return future bookings for a customer', () => {
    let futureBookings1 = customer.returnFutureBookings();
    expect(futureBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(futureBookings1[0].date).to.equal('2023/01/11')
    expect(futureBookings1[1].date).to.equal('2022/11/06')
    expect(futureBookings1[2].date).to.equal('2023/12/22')
    expect(futureBookings1[3].date).to.equal('2023/02/12')
  })

  // it("Should be able return the room info for each of the customer's past bookings", () => {
  //   let roomInfo = customer.returnPastBookingRoomInfo()
  //   console.log(roomInfo[0])
  //
  //   expect(roomInfo[0]).to.equal(`Date: 2022/02/05,\nRoom: 12,\nRoom Type: single room,\nBidet: No,\nBed Size: twin,\n# of Beds: 2, \nCost Per Night: $172.09`)
  // })

})
