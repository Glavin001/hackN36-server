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

  afterCreate: function(connection, callback) {

    console.log(sails.config.linkedin);
    var c = sails.config.linkedin;
    var Linkedin = require('node-linkedin')(c.apiKey, c.apiSecret, c.callbackUri);
    console.log('linkedin setup', arguments);

    sails.models.user
      .find()
      .where({
        nymi: connection.nymi1
      })
      .exec(function(err, results) {
        if (results.length == 1) {
          var user1 = results[0];

          var myAccessToken = user1.linkedinAccessToken;
          var linkedin = Linkedin.init(myAccessToken);

          sails.models.user
            .find()
            .where({
              nymi: connection.nymi2
            })
            .exec(function(err, results) {
              if (results.length == 1) {
                var user2 = results[0];

                linkedin.people.invite({
                  "recipients": {
                    "values": [{
                      "person": {
                        "_path": "/people/email=" + user2.emailAddress,
                        "first-name": user2.firstName,
                        "last-name": user2.lastName
                      }
                    }]
                  },
                  "subject": "Invitation to connect.",
                  "body": "We met with Mymi",
                  "item-content": {
                    "invitation-request": {
                      "connect-type": "friend"
                    }
                  }
                }, function(err, data) {
                  console.log('INVITED?', err, data);
                  callback();
                });
              } else {
                console.log("did not find user2");
                callback();
              }
            });
        } else {
          console.log("did not find user1");
          callback();
        }
      });
  }
};
