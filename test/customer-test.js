import chai from 'chai';
const expect = chai.expect;
import Customer from '../src/classes/customer';
import customers from '../src/mockData/mock-customers'

describe('Customer', () => {

let customer;
let customer2;

  beforeEach( () => {
    customer = new Customer(customers[0]);
    customer2 = new Customer(customers[1]);
  })

  it('Should be an instance of Customer', () => {
    expect(customer).to.be.an.instanceOf(Customer);
  })

  it('Should start with no amount spent before checking past bookings', () => {
    expect(customer.amountSpent).to.equal(0);
    expect(customer2.amountSpent).to.equal(0);
  })

})
