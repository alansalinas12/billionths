var db = require('../models');

module.exports = function (app) {
    // ===========================================
    // Transaction page
    // ===========================================
    // GET ROUTES
    // route for getting all of the Transaction
    app.get("/api/transactions", function (req, res) {
        // findAll returns all entries for a table when used with no options
        db.Transaction.findAll({
            where: {
                UserId: req.session.passport.user
            }
        }).then(function (dbTransaction) {
            // We have access to the transaction as an argument inside of the callback function
            res.json(dbTransaction);
        });
    });

    // Get route for getting a specific transaction
    app.get("/api/transactions/:id", function (req, res) {

        db.Transaction.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (transaction) {
            return transaction;
        });
    });

    // Get route for getting total number of a secific coin
    app.get("/api/transactions/:coin", function (req, res) {
        db.Transaction.findAll({
            where: {
                coin: req.params.coin
            }
        }).then(function (coinTotal) {
            return coinTotal;
        });
    });






    // POST route for creating a new user
    app.post('/api/newUser', function (req, res) {
        db.User.create({
            username: req.body.username,
            userId: req.body.userId,
            money: req.body.money
        });
    });

    // GET route for pulling user info
    app.post('/api/userLogin', (req, res) => {
        console.log("In the get command")
        console.log(req.body)

        db.User.findAll({
            where: {
                id: req.body.loginID
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        })
    })



    // DELETE ROUTES
    // delete route for devaring purchases. We can get the id of the purchase we want to delete from
    // req.params.id
    app.delete("/api/transactions/:TransactionId", function (req, res) {
        db.Transaction.destroy({
            where: {
                id: req.params.TransactionId
            }
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });


    // UPDATE ROUTES
    // PUT route for updating Transaction. We can modify the amount of crypto Transaction
    app.put("/api/transactions/:id", function (req, res) {

        db.Transaction.update({

            coin: req.body.coin,

            coinId: req.body.coinId,

            purchasePrice: req.body.purchasePrice,

            purchaseAmount: req.body.purchaseAmount

        }, {
            where: {
                id: req.body.id
            }
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });

}