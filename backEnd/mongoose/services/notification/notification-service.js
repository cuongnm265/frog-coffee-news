let NotifcationType = require('../../models/notification-type-model');
let Notification = require('../../models/notification-model');
let User = require('../../models/user-model');
let NotificationGenerator = require('./notification-generator-service');
let DateService = require('../../technical/current-date-service');
let articleService = require('../article-service');

let Q = require('q');
const chalk = require('chalk');


let self = module.exports = {

    /** Notifications request **/

    findOne: function () {

    },

    findAll: function () {

    },

    findbyUser: function (userId, callback) {
        Notification.find({
            recipient: userId
        }).sort({
            date: -1
        }).exec(function (err, docs) {
            if (err) return callback(err);
            return callback(null, docs);
        });
    },

    seenAllNotificationByUser: function (userId, callback) {
        Notification.update({
            recipient: userId
        }, {
            "$set": {
                "seen": true
            }
        }, {
            multi: true
        }, function (err, docs) {
            if (err) throw err;
            return callback(null);
        });
    },

    update: function (notification_id, notification, callback) {
        Notification.findByIdAndUpdate(notification_id, notification, function (err) {
            if (err) return callback(err);
            return callback(null);
        });
    },

    /**------------------------- */
    pushNotification: function (notification) {
        let defer = Q.defer();
        notification.date = DateService.getCurrentDay();

        articleService.getCategoryNameByArticleId(notification.article_id).then((categoryName) => {
            notification.category = categoryName;
            return notification;
        }).then((notification) => {

            NotificationGenerator.generateMessageOnType(notification).then(message => {
                notification.message = message;
                notification.seen = false;
                notification.read = false;

                /**Save notification */
                notification = new Notification(notification);
                notification.save(function (err) {
                    if (err) defer.reject(err);
                    defer.resolve();
                });

            }).catch((err) => {
                defer.reject(err);
            })
        });
        return defer.promise;
    },

    markAsRead: function (notification_id, callback) {
        Notification.findByIdAndUpdate(notification_id, {
            "$set": {
                "seen": true,
                "read": true
            }
        }, function (err) {
            if (err) throw err;
            return callback(null);
        });
    },


    /** Methods for manipulating notification type */
    findOneType: function () {
        NotifcationType.find(function (err, docs) {
            if (err) return callback(err);
            return callback(null, docs);
        });
    },

    findAllType: function () {

    },

    saveType: function (doc, callback) {
        let type = new NotifcationType(doc);
        type.save(function (err) {
            if (err) return callback(err);
            return callback(null);
        });
    },

    updateType: function () {

    },

    removeType: function () {

    }
    /** --------------------------------------------- */
}