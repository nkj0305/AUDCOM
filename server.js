
var config = require('./config');
var stkn = "";
var rtkn = "";
var userEmails = "";
var usrAvPth = "";



// ## SimpleServer `SimpleServer(obj)`
// TO RUN MONGODB : /usr/bin/mongod --smallfiles
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//


var express = require('express');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var CiscoSparkStrategy = require('passport-cisco-spark').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Cisco Spark profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});


// Use the SparkStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Spark
//   profile), and invoke a callback with a user object.
passport.use(new CiscoSparkStrategy({
    clientID: config.app_client_id,
    clientSecret: config.app_client_secret,
    callbackURL: "https://audcom-nkj0305.c9users.io/auth/spark/callback",
    scope: [
        'spark:rooms_read',
        'spark:memberships_read',
        'spark:messages_write',
        'spark:messages_read',
        'spark:rooms_write',
        'spark:people_read',
        'spark:memberships_write'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(" Access Token: "+ accessToken);
    console.log(" Refresh Token:"+ refreshToken);
    console.log(" Profile Email: "+ profile);
    console.log(profile);
    console.log(" Done:   " + done);
    stkn = accessToken;
    rtkn = refreshToken;
    userEmails = profile.emails;
    usrAvPth = profile.avatar;
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Cisco Spark profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Cisco Spark account with a user record in your database,
      // and return that user instead.      
      return done(null, profile);
    });
  }
));

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname +'/client');
app.use(logger('dev'));


app.use(express.static(__dirname+'/client'));
app.use(express.static(__dirname+'/client/img'));
app.use(express.static(__dirname+'/client/css'));
app.use(express.static(__dirname+'/client/js'));
app.use(express.static(__dirname+'/client/lib'));
app.use(express.static(__dirname+'/client/partials'));
app.use('/coverage', express.static(__dirname + '/reports'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res) {
        console.log('In root request');
    res.render('index', {title: 'Spark development page',user: req.user});
});



// app.get('/protected', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info){
//     if (err) { return next(err) }
//     if (!user) { return res.redirect('/signin') }
//     res.redirect('/account');
//   })(req, res, next);
// });
app.get('/login', function(req, res){
  res.render('/', { user: req.user });
});

// GET /auth/spark
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Cisco Spark authentication will involve
//   redirecting the user to ciscospark.com (https://api.ciscospark.com/v1/authorize).  After authorization, Cisco Spark
//   will redirect the user back to this application at /auth/spark/callback
app.get('/auth/spark',
  passport.authenticate('cisco-spark'));

// GET /auth/spark/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/spark/callback', 
  passport.authenticate('cisco-spark', { failureRedirect: '/' }),
  function(req, res) {
    console.log("Saved Access Token : " + stkn);
//    app.use(session({secret: stkn, resave: false, saveUninitialized: true}));
    // Successful authentication, redirect home.
    req.session['AccessToken'] = stkn;
    req.session['RefreshToken'] = rtkn;
    req.session['userEmails'] = userEmails;
    req.session['usrAvPth'] = usrAvPth;

    // after setting the variables in session variables.
    res.redirect('/account');
  });


app.get('/logout', function(req, res){
  req.session.AccessToken = undefined;
  console.log("logging out");
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get('/index', function(req,res) {
    res.sendfile('client/index.html');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

app.get('/account*', ensureAuthenticated, function(req, res){
  res.sendfile('client/account.html' );
});

app.get('/views/scripts/:flag2', function(req, res) {
    console.log('in here');
    res.sendfile('client/views/scripts/webspeechdemo.html', {root: __dirname });
});

/*
// Update database 
// Data Base operations
var Members = require('./models/members');
Members.remove({}, function(err){
    if(err)throw err;
    console.log('Database emptied');
});

var membersDetails = require('./models/data.json');

membersDetails.forEach(function(item){
    console.log(item);
    var newMem = Members (item);

    newMem.save(function(err){
        if (err) throw err;
        console.log ('New Member created');
    });
});
*/

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("AudSpark server listening at", addr.address + ":" + addr.port);
});

console.log("AUDCOM INFO: LOADING PROCESS CMD API");

var spark = require('./routes/spark');
app.get('/processcmd/:id', spark.handleReq);
console.log("AUDCOM INFO: LOADING DB API");
var dbapi=  require('./routes/dbapi')(app,express); 
app.use('/dbapi',dbapi);




module.exports = app;
