import rooms from '../mockData/mock-rooms'
import bookings from '../mockData/mock-bookings'


class Hotel {
  constructor(rooms, bookings) {
    this.rooms = rooms;
    this.bookings = bookings;
    this.filteredRoomsByDate = null;
    this.filteredRoomsByType = null;
  }

  showRoomsByDate(desiredDate) {
    let date = new Date().toJSON().slice(0, 10);
    let splitCurrentDate = date.split('-').map(date => parseInt(date));
    let splitBookingDate = desiredDate.split('/').map(date => parseInt(date));
    if (splitCurrentDate[0] > splitBookingDate[0] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] > splitBookingDate[1] || splitCurrentDate[0] === splitBookingDate[0] && splitCurrentDate[1] === splitBookingDate[1] && splitCurrentDate[2] > splitBookingDate[2] || desiredDate === '') {
      this.filteredRoomsByDate = null;
      return 'Sorry! Either this is a past date or no rooms are available. Please try again.'
    } else {
      const bookingsOnDate = bookings.filter(booking => booking.date === desiredDate).map(booking => booking.roomNumber);
      const filteredRooms = rooms.filter(room => !bookingsOnDate.includes(room.number));
      this.filteredRoomsByDate = filteredRooms;
      return filteredRooms;
    }
  }

  showRoomsByType(type) {
    const filteredMatchingType = rooms.filter(room => type === room.roomType)
    if (filteredMatchingType.length === 0) {
      this.filteredRoomsByType = null;
      return 'Sorry! This is not a valid room type. Please try again.'
    } else {
      const filteredRooms = this.filteredRoomsByDate.filter(room => room.roomType === type)
      this.filteredRoomsByType = filteredRooms;
      return filteredRooms;
    }
  }
}

export default Hotel
