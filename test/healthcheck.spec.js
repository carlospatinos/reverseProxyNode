process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

var redisMock = require("redis-mock");
let app = require('../server');
var redisClient = require('../modules/redisModule')(app);


chai.use(chaiHttp);

//Our parent block
describe('Health', () => {
    beforeEach((done) => { //Before each test we empty the database
        done();   
    });

    /*
    * Test the /GET route
    */
    describe('Basic route', () => {
        it('it should GET response', (done) => {
            chai.request(app)
                .get('/health')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('statusConnectionRedis');
                    res.body.should.have.property('statusConnectionBack');
                    redisClient.getClient().quit();
                done();
                });
        });
    });
});