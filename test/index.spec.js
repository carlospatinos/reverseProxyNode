process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../server');


chai.use(chaiHttp);

//Our parent block
describe('Server', () => {
    beforeEach((done) => { //Before each test we empty the database
        done();   
    });

    /*
    * Test the /GET route
    */
    it('should provide a message on / GET', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
            });
    }); 
});