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
    }
  },

  afterCreate: function(event, callback){
    console.log(event);
    sails.models.event.find()
    .where({
      dateSent: {
        '<=': new Date(event.dateSent),
        '>=': new Date(+new Date(event.dateSent) - 10000)
      },
      id: {
        '!': [event.id]
      }
    })
    .exec(function(err, results){
      console.log(results);
      callback();
    });
  }
};

