var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var SavingsAccountSchema = new Schema({
    name : { type: String, required: true },
    balance : { type: Number },
    interestRate : { type: String },
    accountNo: { type: Number, unique: true },
    sortCode: { type: Number }
    /*,
    deposits : [
        { 
            date : { type: Date }, 
            amount: { type: Number, required: true }
        }
    ]*/
});

 
module.exports = mongoose.model('SavingsAccount', SavingsAccountSchema);