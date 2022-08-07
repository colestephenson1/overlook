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

  it('Should start with no amount spent before checking past bookings', () => {
    expect(customer.amountSpent).to.equal(0)
  })

})
