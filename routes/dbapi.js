
var Member = require('../models/members')

module.exports = function (app, express){
    
    var dbapi = express.Router();
    console.log("Loading.. Inside dbapi");
    
    dbapi.post('/updUsr',function(req,res){
        console.log("AUDCOM INFO: Update request of "+ req.body.email +"is received");
        console.log(req);
        Member.findOne({email:req.body.email}, function(err,user){
            
            if (err){
                res.send(err);
                return;
            }
            if(!user)
            {
                user = new Member();
                user.email =  req.body.email;
            }
            console.log("SSB DBAPI1");
            console.log(req.body);
            user.name = req.body.name;
            user.company = req.body.company;
                
            user.workPhone =  req.body.workPhone;
            user.mobile = req.body.mobile;
                
            user.save(function(err) {
                if (err){
                    console.log(err);
                    res.send(err);
                    return;
                }
                var dateObj = new Date().toLocaleString();
                res.json({message: 'User details has been saved successfully at '+ dateObj + '!'});
            });
                
        });
    });

    
    dbapi.get('/user/:email',function(req,res){
        console.log("AUDCOM INFO: Get request of "+ req.params.email +"is received");
        console.log("AUDCOM INFO SESSION: ");
        console.log( req.session);
        Member.findOne({email:req.params.email}, function(err,user){
            if (err){
                res.send(err);
                return;
            }
            res.json(user);
        });
    });
    
    dbapi.get('/userLoggedIn/',function(req,res){
        console.log("AUDCOM INFO: Get request of Current User is received");
        console.log("AUDCOM INFO SESSION: ");
        console.log( req.session.userEmails);

        res.json(req.session.userEmails);
    });
    dbapi.get('/userAvatarPath/',function(req,res){
        console.log("AUDCOM INFO: Get request of Current User is received");
        console.log("AUDCOM INFO SESSION: ");
        console.log( req.session.usrAvPth);

        res.json(req.session.usrAvPth);
    });    
    
    dbapi.get('/users',function(req,res){
        console.log("AUDCOM INFO: ");
        console.log(req.session);
        Member.find({}, function(err,users){
            if (err){
                res.send(err);
                return;
            }
            res.json(users);
        });
    });
    
    return dbapi;
};

