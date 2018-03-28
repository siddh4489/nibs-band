    var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce');
     
function managerList(req, res, next) {
    console.log('---getManager--->'+req);
    console.log('---getManager 1--->'+req.body.spassword);
    console.log('---getManager 2--->'+req.body.suser);
    console.log('---getManager 3 --->'+JSON.stringify(req.body));
    

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    //org.authenticate({ username: userName, password: password}, function(err, resp) {

    org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
        if(!err) {
        var q = "SELECT Id, Name FROM User";
 
        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 console.log('---getManager List--->'+resp.records);
                 res.send(resp.records);
              }else{
                 res.send('No record Available');
              }
        });


        } else {
            console.log('nforce connection failed: ' + err.message);
            oauth = resp;
        }
    });
       
        
     
};


function createTask(req, res, next) {

 db.query('SELECT sfid FROM salesforce.contact WHERE id=$1',[req.userId], true)
        .then(function (user) {
            console.log(req.userId+"---------sfid------------------>: " + user.sfid);
            // case is a reserved word. using _case instead.
            var claimObj = nforce.createSObject('Claim__c');
            claimObj.set('Claimant_Name__c', req.body.claimant);
            claimObj.set('Communication_Address__c', req.body.address);
            claimObj.set('PAN_Number__c', req.body.panno);
            claimObj.set('Policy_Holder_Name__c', req.body.policyholdername);
            claimObj.set('Telephone_Number__c', req.body.phone);
            claimObj.set('Linked_Contact__c', req.userId);
            

            org.insert({ sobject: claimObj}, function(err, resp){
                if (err) {
                    console.log('First case insert failed: ' + JSON.stringify(err));
                    org.authenticate({username: userName, password: password}, function(err) {
                        if (err) {
                            console.log('Authentication failed: ' + JSON.stringify(err));
                            return next(err);
                        } else {
                            // retry
                            org.insert({ sobject: claimObj}, function(err, resp) {
                                if (err) {
                                    console.log('Second case insert failed: ' + JSON.stringify(err));
                                    return next(err);
                                } else {
                                    console.log('Second case insert worked');
                                    return res.send('ok');
                                }
                            });
                        }
                    })
                } else {
                    console.log('First case insert worked');
                    res.send('ok');
                }
            });
        })
.catch(next);
    
};

function revokeToken(req, res, next) {
    org.revokeToken({token: org.oauth.access_token}, function(err) {
        if (err) {
            return next(err);
        } else {
            res.send('ok');
        }
    });

}

exports.createTask = createTask;
exports.managerList = managerList;
exports.revokeToken = revokeToken;
