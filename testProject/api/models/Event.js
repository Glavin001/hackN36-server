/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    dateSent: {
      type: 'date'
    },
    gesture: {
      type: 'string'
    },
    nymi: {
      type: 'string'
    }
  },

  afterCreate: function(event, callback){
    console.log(event);
    sails.models.event
    .find()
    .where({
      dateSent: {
        '<=': new Date(event.dateSent),
        '>=': new Date(+new Date(event.dateSent) - 10000)
      },
      id: {
        '!': [event.id]
      },
      gesture: event.gesture
    })
    .exec(function(err, results){
      if(results.length == 1){
        sails.models.connection
        .create({
          nymi1: results[0].nymi,
          nymi2: event.nymi,
          dateMet: event.dateSent
        })
        .exec(function(err, connection){
          console.log(connection);
          callback();
        });
      }else{
        callback();
      }
    });
  }
};
