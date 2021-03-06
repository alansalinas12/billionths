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

            User.findOne({
                where: {
                    googleId: profile.id
                }
            }).then(function (user) {
                if (user) {
                    return done(null, user.get());
                } else {
                    var data = {
                        googleId: profile.id,
                        username: profile.displayName,
                        money: 10000,
                        BTC: 0,
                        LTC: 0,
                        XRP: 0,
                        XLM: 0,
                        ETH: 0,
                        MIOTA: 0,
                        EOS: 0,
                        BCH: 0,
                        TRX: 0,
                        ADA: 0
                    };

                    User.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }

                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            })
        }
    ));

}