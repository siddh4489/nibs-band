var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce'),
     
   
    userName = config.api.userName,
    password = config.api.password;
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
org.authenticate({ username: 'sid.demo@yahoo.com', password: '72scjp72'}, function(err, resp) {
    if(!err) {
        console.log('nforce connection succeeded...'+org.oauth.access_token);
        console.log('nforce connection succeeded...'+resp);

     
    } else {
        console.log('nforce connection failed: ' + err.message);
        oauth = resp;
    }
});

function getClaims(req, res, next) {
      
      console.log('---getClaims-------req.userId---------'+req.userId);
      var q = "SELECT Id, Name,Claimant_Name__c,Communication_Address__c,PAN_Number__c,Policy_Holder_Name__c,Telephone_Number__c FROM Claim__c";

        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 res.send(resp.records);
              }else{
                 res.send('No record Available');
              }
        }); 
     
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

exports.getClaims = getClaims;
exports.revokeToken = revokeToken;
