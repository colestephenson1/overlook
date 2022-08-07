import bookings from '../mockData/mock-bookings';
import rooms from '../mockData/mock-rooms';

class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.amountSpent = 0;
  }
}

export default Customer;
