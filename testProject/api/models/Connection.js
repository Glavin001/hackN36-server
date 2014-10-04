/**
* Connection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    dateMet: {
      type: 'date'
    },
    nymi1: {
      type: 'string'
    },
    nymi2: {
      type: 'string'
    }
  },

  afterCreate: function(record, callback) {

    console.log(sails.config.linkedin);
    var c = sails.config.linkedin;
    var Linkedin = require('node-linkedin')(c.apiKey, c.apiSecret, c.callbackUri);
    console.log('linkedin setup', arguments);

    var myAccessToken = '';
    var linkedin = Linkedin.init(myAccessToken);

    linkedin.people.invite({
          "recipients": {
              "values": [{
                  "person": {
                      "_path": "/people/email=mistryrn@mcmaster.ca",
                      "first-name": "Rakesh",
                      "last-name": "Mistry"
                  }
              }]
          },
          "subject": "Invitation to connect.",
          "body": "Say yes!",
          "item-content": {
              "invitation-request": {
                  "connect-type": "friend"
              }
          }
      }, function(err, data) {
          console.log('INVITED?', err, data);
          callback();
      });
  }

};
