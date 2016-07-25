var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./modules/user/server/models/user.server.models'); // get the mongoose model
var cors = require('cors');
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var user_routes      = require('./modules/user/server/routes/user.server.routes');
var savings_routes      = require('./modules/savings_accounts/server/routes/savings_accounts.server.routes');



// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize());
 

 app.use(cors());
 
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});
 
// connect to database
mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);
 
 
// bundle our routes
var apiRoutes = express.Router();
 
apiRoutes.post('/signup', function(req, res) {
  user_routes.signup(req,res);
});

apiRoutes.post('/authenticate', function(req, res) {
  user_routes.authenticate(req,res)
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  user_routes.memberinfo(req,res);
});
 
apiRoutes.post('/addsavings', passport.authenticate('jwt', { session: false}), function(req, res) {
    savings_routes.addsavings(req,res);
});

apiRoutes.post('/addusersavings', function(req, res) {
  user_routes.addusersavings(req,res)
});



 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
 


// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Start the server
app.listen(port);

console.log('There will be dragons: http://localhost:' + port);