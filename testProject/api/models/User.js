/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    nymi: {
      type: 'string',
      unique: true
    },
    firstName: {
      type: 'string',
      unique: true,
      required: true
    },
    lastName: {
      type: 'string',
      unique: true,
      required: true
    },
    emailAddress: {
      type: 'string',
      unique: true,
      required: true
    },
    linkedinAccessToken: {
      type: 'string',
      unique: true,
      required: true
    }
  }
};
