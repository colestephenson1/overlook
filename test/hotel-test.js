import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/classes/hotel';
import rooms from '../src/mockData/mock-rooms'
import bookings from '../src/mockData/mock-bookings'

describe('Hotel', () => {

let hotel;

  beforeEach( () => {
    hotel = new Hotel(rooms, bookings);
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
    expect(hotel.showRoomsByType('thunderdome')).to.equal('Sorry! This is not a valid room type. Please try again.')
  })

})
