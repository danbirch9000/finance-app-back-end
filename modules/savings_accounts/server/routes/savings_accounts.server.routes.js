/**
 * Routing configuration
 */
'use strict';

var jwt             = require('jwt-simple');
var config          = require('../../../../config/database'); // get db config file
var User            = require('../../../../models/user'); // get the mongoose model
var SavingsAccount  = require('../models/savings_accounts.server.models'); // get the mongoose model

exports.addsavings = function(req, res){
    var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

            var newSavingsAccount = new SavingsAccount({
                name : req.body.name,
                balance : req.body.balance,
                interestRate : req.body.interestRate,
                accountNo: req.body.accountNo,
                sortCode: req.body.sortCode
            });

            newSavingsAccount.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.json({success: false, msg: 'error saving Savings account.'});
                } else {
                res.json(newSavingsAccount);
                }
            });

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
}