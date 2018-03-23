var db = require('./pghelper'),
    config = require('./config'),
   /* nforce = require('nforce'),
     
   
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
});*/
    
var sf = require('node-salesforce');
var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env. 
   loginUrl : 'https://login.salesforce.com' 
});
conn.login('sid.demo@yahoo.com','72scjp72', function(err, userInfo) {
  if (err) { 
      console.log(' Error here ');
      return console.error(err); 
  }
  // Now you can get the access token and instance URL information. 
  // Save them to establish connection next time. 
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property 
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ... 
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
