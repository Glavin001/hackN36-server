module.exports = {

  authorize: function(req, res) {
    console.log('authorize');

    var c = sails.config.linkedin;
    var Linkedin = require('node-linkedin')(c.apiKey, c.apiSecret, c.callbackUri);

    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile',
      'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups',
      'w_messages'
    ]);
  },

  callback: function(req, res) {
    console.log('callback');

    var c = sails.config.linkedin;
    var Linkedin = require('node-linkedin')(c.apiKey, c.apiSecret, c.callbackUri);

    console.log(req.query);

    Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
      if (err)
        return console.error(err);

      /**
       * Results have something like:
       * {"expires_in":5184000,"access_token":". . . ."}
       */

      console.log('results', typeof results, results);
      var json = JSON.parse(results);

      var accessToken = json.access_token;
      console.log('accessToken', accessToken);

      if (results && accessToken) {
        var linkedin = Linkedin.init(accessToken);
        linkedin.people.me(['first-name', 'last-name', 'email-address'], function(err, user) {
          console.log(err, user);
          var email = user.emailAddress;
          var firstName = user.firstName;
          var lastName = user.lastName;
          user.linkedinAccessToken = accessToken;
          // FIXME
          user.nymi = firstName+" "+lastName;

          // create user record
          sails.models.user
          .create(user)
          .exec(function(err){
            console.log(arguments);
            // show
            return res.json({
              'success': true,
              'user': user
            });

          });
        });
      } else {
        return res.json({
          'success': false,
          'errorMessage': 'No access token.'
        });
      }
    });
  }
};
