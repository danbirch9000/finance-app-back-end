/**
 * Routing configuration
 */
'use strict';

var jwt         = require('jwt-simple');
var config      = require('../../../../config/database'); // get db config file
var User        = require('../models/user.server.models'); // get the mongoose model
var SavingsAccount  = require('../../../savings_accounts/server/models/savings_accounts.server.models'); // get the mongoose model

exports.memberinfo = function(req, res){
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

          res.json({success: true, msg: 'Welcome in the member area ' + user.email + '!', User: user});


          
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
};

exports.authenticate = function(req, res){
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {

      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
}

exports.signup = function(req, res){
  if (!req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass email and password.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
}

exports.addusersavings = function(req, res){
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          
            var newSavings = { "savings": { 
              name: req.body.name,
              interestRate: req.body.interestRate,
              accountNo: req.body.accountNo,
              sortCode: req.body.sortCode
            } };

            User.findByIdAndUpdate(
                user._id,
                { $push: newSavings },
                { safe: true, upsert: true, new: true },
                function(err, model) {
                    console.log(err);
                }
            );

            res.json({success: true, msg: 'Done!'});
          
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
};






