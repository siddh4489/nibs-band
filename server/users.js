var db = require('./pghelper'),
    activities = require('./activities'),
    winston = require('winston');

/**
 * Get user profile
 * @param req
 * @param res
 * @param next
 */
function getProfile(req, res, next) {
    var userId = req.userId,
        externalUserId = req.externalUserId;

    activities.getPointBalance(externalUserId)
        .then(function (activity) {
            db.query(
                    'SELECT id, firstname,mg_company_name__c,mg_business_telephneno__c,mg_business_type__c,lastname, email, mobilephone, pictureurl__c as pictureURL, createddate, preference__c AS preference, size__c AS size FROM salesforce.contact WHERE id=$1',
                    [userId], true)
                .then(function (user) {
                    user.points = activity.points;
                    user.status = activities.getStatus(activity.points);
                    res.send(JSON.stringify(user));
                })
                .catch(next);
        })
        .catch(next);
}

/**
 * Update user profile
 * @param req
 * @param res
 * @param next
 */
function updateProfile(req, res, next) {

    var user = req.body,
        userId = req.userId;

    console.log('updating: ' + JSON.stringify(user));

    db.query('update salesforce.contact SET firstName=$1, lastName=$2, mobilePhone=$3, pictureURL__c=$4, preference__c=$5,size__c=$6,mg_company_name__c=$7,mg_business_type__c=$8 WHERE id=$9',
            [user.firstname, user.lastname, user.mobilephone, user.pictureurl, user.preference, user.size,user.mg_company_name__c,user.mg_business_type__c, userId])
        .then(function () {
            res.send(user);
        })
        .catch(next);
};

exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
