const assertChai = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
const request = require('request');
const supertest = require('supertest');
const app = require('../app');

describe('The / route', () => {
    it('loads / screen', function(done) {
        supertest(app)
            .get('/')
            .expect(200)
            .expect(/Enter Bus Route Number:/, done)
    });
});
//
describe('The / route', () => {
    it('loads /submit-bus-route screen', function() {
        return supertest(app)
            .post('/submit-bus-route')
            .send({busRoute: 5})
            .then(res => {
                expect(res.status).to.equal(200);
            })
    });
});

describe('GET All Buses', () => {
    it('should grab all bus routes', (done) => {
        const allBuses = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus';
        const options = {json: true};
        request(allBuses, options, (error, response, body) => {
            body.should.be.a('array');
            done();
        });
    });
});

describe('POST Bus Route', () => {
    it('should grab buses on route 5', (done) => {
        const busesSpecificRoute = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute/5';
        const options = {json: true};
        request(busesSpecificRoute, options, (error, response, body) => {
            assertChai.typeOf(body, 'array');
            done();
        });
    });
});