var express = require('express');
var db = require('../models');

module.exports = function (app, passport) {

    app.get("/index", function (req, res) {
        res.render("index");
    });

    app.get("/logout", function (req, res) {
        req.session.destroy(function (err) {
            res.redirect("/");
        });
    });

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: [
                'profile',
                "https://www.googleapis.com/auth/plus.login",
                "https://www.googleapis.com/auth/plus.me"
            ]
        }));


    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/'
        }),
        function (req, res) {
            res.redirect('/dashboard');
        });
                 

    // Get user
    app.get("/api/user", function (req, res) {
        db.User.findOne({
            where: {
                 id: req.session.passport.user
            }
            }).then(function (dbUser) {
                res.json(dbUser);
            });
    });
    
    // Update user money and coins
    app.put("/api/user/:id", function(req, res) {
        db.User.update({
            money: req.body.money,
            BTC: req.body.BTC,
            LTC: req.body.LTC,
            XRP: req.body.XRP,
            XLM: req.body.XLM,
            ETH: req.body.ETH,
            MIOTA: req.body.MIOTA,
            EOS: req.body.EOS,
            BCH: req.body.BCH,
            TRX: req.body.TRX,
            ADA: req.body.ADA
        }, {
            where: {
                id: req.session.passport.user
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

}