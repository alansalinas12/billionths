'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        googleId: {
            type: DataTypes.STRING,
            index: true
        },
        money: DataTypes.FLOAT,
        BTC: DataTypes.FLOAT,
        LTC: DataTypes.FLOAT,
        XRP: DataTypes.FLOAT,
        XLM: DataTypes.FLOAT,
        ETH: DataTypes.FLOAT,
        MIOTA: DataTypes.FLOAT,
        EOS: DataTypes.FLOAT,
        BCH: DataTypes.FLOAT,
        TRX: DataTypes.FLOAT,
        ADA: DataTypes.FLOAT
    });

    User.associate = function (models) {
        User.hasMany(models.Transaction);
    };

    return User;
};