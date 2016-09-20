var should = require('should'),
    request = require('supertest'),
    app = require('../server.js'),
    chai = require('chai');
    
var config = require('../config');
    
    //app.address = function () {return configTest.base_url;};
    
var expect = chai.expect;
var roomlist = [];
var room_id = "Y2lzY29zcGFyazovL3VzL1JPT00vMjczODU4MzAtNzNmMy0xMWU2LTk4MzAtYzljZjRhZjc0Nzg0";
describe('Dummy Test', function(){ //describe your object type

        it('Should check if 5 = 5 pass.', function(done){  //write tests
            expect(5).to.equal(5);
            done();

        });
});
/* ****************
   DB API Test case start from here
   1. 
   
   ****************/

// Code Test starts here.

describe('Fetch Users Information :', function(){ //describe your object type

    
    it('Fetch All Users information : ', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/dbapi/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                //console.log('Inside End :::');
                //console.log(res);
                //console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});

describe('Fetch User Information --> surender.bisht@aricent.com :', function(){ //describe your object type

    it('Fetch Data for user', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/dbapi/user/surender.bisht@aricent.com')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                //console.log('Inside End :::');
                //console.log(res);
                //console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                //res.body.should.be.array;
                done();
            });
    });
});


describe('Fetch Logged In User Email ', function(){ //describe your object type

    it('Fetch Data for user', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/dbapi/userLoggedIn')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                //console.log('Inside End :::');
                //console.log(res);
                //console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                //res.body.should.be.array;
                done();
            });
    });
});

describe('Fetch Logged In User avatar ', function(){ //describe your object type

    it('Fetch Data for user', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/dbapi/userAvatarPath')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, res) {
                //console.log('Inside End :::');
                //console.log(res);
                //console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                //res.body.should.be.array;
                done();
            });
    });
});

describe('Update User information ', function(){ //describe your object type
    // todo : UPDATE THIS TEST CASE TO MATCH THE EXACT RESPONSE, WRITE NOW IT IS NOT SETTING THE REQUEST
    //     BODY

    it('Update Data for user : surender.bisht@aricent.com', function(done) {

     request(app)
        .post('/dbapi/updUsr')
        .field('email','surender.bisht@aricent.com')
        .field('name','Surender Bisht')
        .field('company','Aricent')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err,res){
            if(err){
                throw err;
            }
            expect(err).to.not.exist;
            res.should.have.property('status', 200);
            
            done();
        });
     
    });
});
/******************************************
 * SPARK API (spark.js test cases starts from here 
 * 
 * 
 */
 

describe('SPARK API Test Cases :', function(){ //describe your object type

    it('Defualt Command Case', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/NoMatchFound')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                done();
            });
    });    
});


('SPARK API Test Cases :', function(){ //describe your object type
    it('List Rooms', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/list rooms')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                //console.log(res.body);
                
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});
describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Create Room', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/create room sampleroom')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});


describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Add Member Invalid', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/add member surender bisht to samroom')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Add Member Invalid Case 2', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/add member surender bisht 2 samroom')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Add Member Valid', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/add member Gurpreet to sampleroom')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});


describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Post Msg', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/post message ' + room_id + ' Sample message')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                expect(err).to.not.exist;
                console.log(res.text);
                                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});





describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Invalid Msg', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/create rommtest newroom')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
               
                expect(err).to.not.exist;
                res.body.should.have.property('data','INVALID COMMAND');
                res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});


describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Get members', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/get members ' +room_id)
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                res.body.should.be.array;
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Get Person Details', function() {
    request(app)
            .get('/processcmd/get members ' +room_id)
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                res.body.should.be.array;
                //console.log(res.body);

                it('Get Person Detail', function(done) {
                    console.log("SB:");
                    //console.log(app.address);
                        request(app)
                            .get('/processcmd/person details ' + res.body[0].personId)
                            .set('Accept', 'aaplication/json')
                            .expect('Content-Type', 'application/json; charset=utf-8')
                            .expect(200)
                            .end(function(err, res) {
                                console.log('Inside End :::');
                                console.log('Inside End <<<');
                                        expect(err).to.not.exist;
                                            res.should.have.property('status', 200);
                                res.body.should.be.array;
                                done();
                            });
                    });


            });
                
    });
        
    });

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Get messages', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/get messages ' +room_id)
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('add email', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/add email test6.test1@aricent.com ' +room_id)
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Leave Room Invalid', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/leave room does not exist')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                
                done();
            });
    });
});

describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Leave Room', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/leave room sampleroom')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                console.log('Inside End <<<');
                        expect(err).to.not.exist;
                            res.should.have.property('status', 200);
                
                done();
            });
    });
});


describe('SPARK API Test Cases :', function(){ //describe your object type
    it('Exit Rooms', function(done) {
    console.log("SB:");
    //console.log(app.address);
        request(app)
            .get('/processcmd/list rooms')
            .set('Accept', 'aaplication/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
                console.log('Inside End :::');
                //console.log(res);
                res.body.forEach(function(item){
                
                if (item.title == "sampleroom"){
                    
                    request(app)
                        .get('/processcmd/delete room ' + item.id)
                        .set('Accept', 'aaplication/json')
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(200)
                        .end(function(err, res) {
                            expect(err).to.not.exist;
                        });
                }
                    //console.log(res.body);
                    
                    console.log('Inside End <<<');
                    expect(err).to.not.exist;
                    
                    res.should.have.property('status', 200);
                    res.body.should.be.array;
                      
                    });
                
                    done();  
            });
    });
});
