$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);
    $(document).on('click', ".deleteTransaction", deleteTransaction);
    $(document).on("click", "#buyTransaction", buyTransaction);
    $(document).on("click", "#sellTransaction", sellTransaction);

    var cryptos;
    var coidId;

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/ticker/?limit=10",
        method: "GET"
    }).then(function (res) {
        cryptos = res.data;

        // Grabs the default coin (Bitcoin) and displays its information to the page
        coinId = $('#coinDropdown').val();
        $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
        $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
        $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);

        // Function to update the crypto information displayed on the page depending on which crypto is selected
        $('#coinDropdown').change(function () {
            coinId = $('#coinDropdown').val();
            var queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

            $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
            $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
            $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);
        });

        getUserHoldings();
        getTransactions();
    });

    var interval = setInterval(displayWorth, 3000);

    var transactions = [];
    var updatedUser;
    var portfolioWorth;
    var gains;
    var totalWorth;

    function displayWorth() {
        $("#cashAvailable").html("$ " + updatedUser.money);
        $("#gains").html("$ " + gains);
        $("#portfolioWorth").html("$ " + portfolioWorth);
    }

    //Get all user transactions
    function getTransactions(event) {

        $.get("/api/transactions", function (data) {
            transactions = data;
            initalizeRows();
        });
    }

    function initalizeRows() {
        $("#purchasedCryptos").empty();

        for (var i = 0; i < transactions.length; i++) {

            var purchase = {
                TransactionId: transactions[i].id,
                UserId: transactions[i].UserId,
                coin: transactions[i].coin,
                coinId: transactions[i].coinId,
                purchaseAmount: transactions[i].purchaseAmount,
                purchasePrice: transactions[i].purchasePrice,
                purchaseDate: transactions[i].createdAt
            };

            $("#purchasedCryptos").prepend("<div class='card'><div class='card-header'>" + purchase.coin + "<button class='deleteTransaction btn btn-danger float-right' value='" + purchase.TransactionId + "'>Delete</button></div><div class='card-body'><div class='row'><div class='col'><h5 class='card-title'>Purchased on: " + purchase.purchaseDate + "</h5><p class='card-text'>Amount Purchased: " + purchase.purchaseAmount + "  |  Purchase Price: $" + purchase.purchasePrice + "</p></div></div></div></div>");
        }
    }

    function deleteTransaction(event) {

        var TransactionId = $(this).val();

        $.ajax({
            url: "/api/transactions/" + TransactionId,
            type: "DELETE"
        }).then(function () {
            getTransactions();
        });
    }

    function getUserHoldings(event) {
        $.ajax({
            url: "/api/user",
            method: "GET"
        }).then(function (res) {
            updatedUser = {
                googleId: res.googleId,
                username: res.username,
                money: res.money,
                BTC: res.BTC,
                LTC: res.LTC,
                XRP: res.XRP,
                XLM: res.XLM,
                ETH: res.ETH,
                MIOTA: res.MIOTA,
                EOS: res.EOS,
                BCH: res.BCH,
                TRX: res.TRX,
                ADA: res.ADA
            };

            var btcWorth = updatedUser.BTC * cryptos[1].quotes.USD.price;
            var ltcWorth = updatedUser.LTC * cryptos[2].quotes.USD.price;
            var xrpWorth = updatedUser.XRP * cryptos[52].quotes.USD.price;
            var xlmWorth = updatedUser.XLM * cryptos[512].quotes.USD.price;
            var ethWorth = updatedUser.ETH * cryptos[1027].quotes.USD.price;
            var miotaWorth = updatedUser.MIOTA * cryptos[1720].quotes.USD.price;
            var eosWorth = updatedUser.EOS * cryptos[1765].quotes.USD.price;
            var bchWorth = updatedUser.BCH * cryptos[1831].quotes.USD.price;
            var trxWorth = updatedUser.TRX * cryptos[1958].quotes.USD.price;
            var adaWorth = updatedUser.ADA * cryptos[2010].quotes.USD.price;


            portfolioWorth = btcWorth + ltcWorth + xrpWorth + xlmWorth + ethWorth + miotaWorth + eosWorth + bchWorth + trxWorth + adaWorth;

            totalWorth = updatedUser.money + portfolioWorth;
            gains = totalWorth - 10000;


            //Holdings
            $("#btc").html("BTC: " + updatedUser.BTC);
            $("#ltc").html("LTC: " + updatedUser.LTC);
            $("#xrp").html("XRP: " + updatedUser.XRP);
            $("#xlm").html("XLM: " + updatedUser.XLM);
            $("#eth").html("ETH: " + updatedUser.ETH);
            $("#miota").html("MIOTA: " + updatedUser.MIOTA);
            $("#eos").html("EOS: " + updatedUser.EOS);
            $("#bch").html("BCH: " + updatedUser.BCH);
            $("#trx").html("TRX: " + updatedUser.TRX);
            $("#ada").html("ADA: " + updatedUser.ADA);

            displayWorth();
        });
    }

    function updateUserHoldings(event) {
        $.ajax({
            url: "/api/user/:id",
            type: "PUT",
            data: updatedUser
        }).then(getUserHoldings);
    }

    // This function inserts a new transactions into our database
    function buyTransaction(event) {
        event.preventDefault();

        clearInterval(interval);

        coinAmount = $("#coinAmount").val();

        var purchasePrice = cryptos[coinId].quotes.USD.price;
        // Grab the symbol of the crypto being purchased
        var coinSymbol = cryptos[coinId].symbol;
        // Determine the cost of the overall transaction
        var transactionCost = purchasePrice * coinAmount

        if (updatedUser.money < transactionCost) {
            window.alert("Not enough money to complete transaction!")
        } else {

            var transaction = {
                coin: coinSymbol,
                coinId: coinId,
                purchasePrice: purchasePrice,
                purchaseAmount: coinAmount
            };

            updatedUser.money -= transactionCost;
            updatedUser[coinSymbol] += parseFloat(coinAmount);

            $.post("/api/transactions", transaction).then(updateUserHoldings);
        }
    };

    function sellTransaction(event) {
        event.preventDefault();

        coinAmount = $("#coinAmount").val();

        var purchasePrice = cryptos[coinId].quotes.USD.price;
        // Grab the symbol of the crypto being purchased
        var coinSymbol = cryptos[coinId].symbol;
        // Determine the cost of the overall transaction
        var transactionCost = purchasePrice * coinAmount

        if (updatedUser[coinSymbol] < coinAmount) {
            window.alert("Not enough coins to complete transaction!")
        } else {

            var transaction = {
                coin: coinSymbol,
                coinId: coinId,
                purchasePrice: purchasePrice,
                purchaseAmount: coinAmount
            };

            updatedUser.money += transactionCost;
            updatedUser[coinSymbol] -= parseFloat(coinAmount);

            $.post("/api/transactions", transaction).then(updateUserHoldings);
        }
    }
});