'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        googleId: {
            type: DataTypes.STRING,
            index: true
        },
        money: DataTypes.FLOAT
    });

    User.associate = function (models) {
        User.hasMany(models.Transaction);
    };

    return User;
};