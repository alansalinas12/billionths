$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);
    $(document).on('click', ".deleteTransaction", deleteTransaction);
    $(document).on("click", "#buyTransaction", buyTransaction);

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
    });

    getUserMoney();

    var money;

    var transactions = [];
    var updatedUser;


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

    function getUserMoney(event) {
        $.ajax({
            url: "/api/user",
            method: "GET"
        }).then(function (res) {
            updatedUser = {
                googleId: res.googleId,
                username: res.username,
                money: res.money
            };

            $("#moneyAmount").html("$ " + updatedUser.money);
        });
    }

    function updateUserMoney(event) {
        $.ajax({
            url: "/api/user/:id",
            type: "PUT",
            data: updatedUser
        }).then(getUserMoney);
    }

    // This function inserts a new transactions into our database
    function buyTransaction(event) {
        event.preventDefault();

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

            $.post("/api/transactions", transaction).then(updateUserMoney);
        }
    };
});