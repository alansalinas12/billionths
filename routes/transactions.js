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

    // Get portfolio worth
    

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

    // POST ROUTES
    // route for saving a new purchase
    app.post("/api/transactions", function (req, res) {
        console.log(req.body);
        db.Transaction.create({
            coin: req.body.coin,
            coinId: req.body.coinId,
            purchasePrice: req.body.purchasePrice,
            purchaseAmount: req.body.purchaseAmount,
            UserId: req.session.passport.user
        }).then(function (dbTransaction) {
            res.json(dbTransaction);
        });
    });

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