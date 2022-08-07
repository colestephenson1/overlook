import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/classes/hotel';
import rooms from '../src/mockData/mock-rooms'
import bookings from '../src/mockData/mock-bookings'
import customers from '../src/mockData/mock-bookings'

describe('Hotel', () => {

let hotel;

  beforeEach( () => {
    hotel = new Hotel(0, rooms, bookings);
  })

  it('Should be an instantiation of Hotel', () => {
    expect(hotel).to.be.an.instanceOf(Hotel);
  })

  it('Should be able to hold all the current bookings', () => {
    expect(hotel.bookings[0]).to.deep.equal({
        id: '5fwrgu4i7k55hl6sz',
        userID: 9,
        date: '2022/04/22',
        roomNumber: 15
      }
    );
    expect(hotel.bookings.length).to.equal(1008);

  })

  it('Should be able to hold all the current rooms', () => {
    expect(hotel.rooms.length).to.equal(25);
    expect(hotel.rooms[0]).to.deep.equal({
        number: 1,
        roomType: 'residential suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 358.4
    });

  })

  it('Should be able to return all bookings for each customer', () => {
    const bookingIDs1 = (hotel.returnAllBookings()).map(booking => booking.userID)
    expect(bookingIDs1.every(id => id === 1)).to.equal(true)
  })

  it('Should be able to return past bookings for a customer', () => {
    let pastBookings1 = hotel.returnPastBookings();
    expect(pastBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(pastBookings1[0].date).to.equal('2022/02/05')
    expect(pastBookings1[1].date).to.equal('2022/01/19')
    expect(pastBookings1[2].date).to.equal('2022/01/18')
    expect(pastBookings1[3].date).to.equal('2022/01/26')
  })

  it('Should be able to return future bookings for a customer', () => {
    let futureBookings1 = hotel.returnFutureBookings();
    expect(futureBookings1.every(booking => booking.userID === 1)).to.equal(true)
    expect(futureBookings1[0].date).to.equal('2023/01/11')
    expect(futureBookings1[1].date).to.equal('2022/11/06')
    expect(futureBookings1[2].date).to.equal('2023/12/22')
    expect(futureBookings1[3].date).to.equal('2023/02/12')
  })

  it("Should be able return the total amount a customer has spent on bookings.", () => {
    expect(hotel.returnTotalAmountSpent()).to.equal(8806)
  })

  it('Should be able to return all rooms available on a selected date', () => {
    const filteredRooms = hotel.showRoomsByDate('2023/01/08')
    expect(filteredRooms.length).to.equal(24);
    expect(filteredRooms).to.not.include(rooms[4]);

  })

  it('should be able to tell the user if the date they enter is invalid', () => {
    expect(hotel.showRoomsByDate('2022/04/22')).to.equal('Sorry! Either this is a past date or no rooms are available. Please try again.');
  })

  it('Should be able to return all rooms by type available on a selected date', () => {
    hotel.showRoomsByDate('2023/01/08');
    hotel.showRoomsByType('suite');
    expect(hotel.filteredRoomsByType.length).to.equal(3);
    expect(hotel.filteredRoomsByType.every(room => room.roomType === 'suite')).to.equal(true);
  })

  it('should be able to tell the user if a desired room type is invalid', () => {
    hotel.showRoomsByDate('2023/01/08');
    expect(hotel.showRoomsByType('thunderdome')).to.equal('Sorry! This is not a valid room type (suite, junior suite, residential suite, single bedroom). Please try again.')
  })

})
