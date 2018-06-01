module.exports = function(passport, user) {
    // configure express to use passport
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var User = user;

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(null, user.errors);
            }
        });
    });

    passport.use(new GoogleStrategy({
    	    clientID: "480019328973-svpoqjokmkhv8s90kmhmt4qqvctbaco3.apps.googleusercontent.com",
    	    clientSecret: "eYmY_xcGcq79qSQj28FEWjrF",
    	    callbackURL: "/auth/google/callback",
            proxy: true,
            passReqToCallback: true
    	},
        function (req, accessToken, refreshToken, profile, done) {
            if (req.user) {
                User.findOne({
                    where: {
                        googleId: profile.id
                    }
                }),
                    function (err, user) {
                            return done(null, user);
                    };

            } else {

                var user = {
                    googleId: profile.id,
                    username: profile.displayName,
                    money: 10000
                };

                User.create(user).then(function (user) {
                    return done(null, user);
                });
            }
        }
    ));

}