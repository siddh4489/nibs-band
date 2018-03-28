var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce');

function getClaims(req, res, next) {
    console.log('---claim--->'+req);
    console.log('---claim 1--->'+req.body.spassword);
    console.log('---claim 2--->'+req.body.suser);
    console.log('---claim 0 --->'+JSON.stringify(req.body));
    

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
            console.log('nforce connection succeeded...'+org.oauth.access_token);
            console.log('nforce connection succeeded...'+resp);
        var q = "SELECT Id, Name FROM Account";
 
        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 console.log(JSON.stringify(resp.records)+'nforce connection records...'+resp.records); 
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
