// process.env.NODE_ENV = 'test';

// //Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let should = chai.should();
// let app = require('../server');


// chai.use(chaiHttp);

// //Our parent block
// describe('APP', () => {
//     beforeEach((done) => { //Before each test we empty the database
//         done();   
//     });

//     /*
//     * Test the /GET route
//     */
//     describe('Basic route', () => {
//         it('it should GET response', (done) => {
//             chai.request(app)
//                 .get('/app')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                 done();
//                 });
//         });
//     });
// });