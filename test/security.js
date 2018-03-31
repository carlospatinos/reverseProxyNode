process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../server');

chai.use(chaiHttp);

//Our parent block
describe('SECURITY', () => {
    beforeEach((done) => { //Before each test we empty the database
        done();   
    });

    /*
    * Test the /GET route
    */
    describe('Valid user returns a token', () => {
        it('it should get a token', (done) => {
            chai.request(app)
                .post('/security')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                done();
                });
        });
    });
});