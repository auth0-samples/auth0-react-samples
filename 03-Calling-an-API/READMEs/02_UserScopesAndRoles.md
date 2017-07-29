
## SETUP User Roles and Scopes

we can set a user to be an admin via rules at auth0
- how do we retrieve this info to be usable in our app?
#### steps to get this info
install express-bearer-token and jsonwebtoken

** discovered that we are given the Auth0 access token from auth 0 within the authorization header which gives us access to the following information:
```
DECODED { iss: 'https://kurtz.auth0.com/',
  sub: 'facebook|1500600256637448',
  aud: [ 'http://localhost:3010', 'https://kurtz.auth0.com/userinfo' ],
  azp: 'RKGnL320bOoupWZGKhPDNexh303w0vh4',
  exp: 1501273678,
  iat: 1501266478,
  scope: 'openid profile read:messages' }
```

But this does not give us profile information - which is where the admin privilege has been granted via rules at auth0

- make a call to getClientInfo - profile from auth0 - would have to happen on each request!
- can we stick on a scope per user via rules? Scope set would contain access roles


https://auth0.com/docs/api-auth/tutorials/adoption/scope-custom-claims
Use the auth0 debug console to follow what you are doing

```
function (user, context, callback) {
  //console.log('ASSIGN USER ROLES RULE -- BEGIN');
  //console.log('USER', user);
  //console.log('CONTEXT', context);
  //console.log('THIS', this);// null
  
  var clientID = 'RKGnL320bOoupWZGKhPDNexh303w0vh4';
  var hostname = 'kurtz.auth0.com';
  var namespace = 'http://localhost:3010/'; 
  var audiences = ['https://localhost:3010', 
                   'http://localhost:3010']; 
  
  //console.log('CLIENTID', context.clientID);
  //console.log('HOSTNAME', context.request.hostname);
  //console.log('AUDIENCE', context.request.query.audience);
  //context.accessToken['https://localhost:3010/' + 'roles'] = '';
  
  if(context.clientID === clientID && 
     context.request.hostname === hostname && 
     (audiences.indexOf(context.request.query.audience) > -1)) {  
    //console.log('CLIENTID PROCEED');
    assignRoles();
  }
  
  function assignRoles() {
    var supers = ['rob@robkurtz.net'];
    var admins = ['rob@robkurtz.net'];
    var roles = [];
  
    if(user.email && (supers.indexOf(user.email.toLowerCase()) > -1)) {
      roles.push('super');
    }
  
    if(user.email && (admins.indexOf(user.email.toLowerCase()) > -1)) {
      roles.push('admin');
    }
  
    if(roles.length > 0) {
      context.accessToken[namespace + 'roles'] = roles;
    }  
    
    //console.log('APPLICABLE ROLES HAVE BEEN ASSIGNED');
  }
  
  //console.log('ASSIGN USER ROLES RULE -- END');
  callback(null, user, context);
}
```

Now our decoded token includes namespaced roles:
```
DECODED TOKEN { iss: 'https://kurtz.auth0.com/',
  sub: 'facebook|1500600256637448',
  aud: [ 'http://localhost:3010', 'https://kurtz.auth0.com/userinfo' ],
  azp: 'RKGnL320bOoupWZGKhPDNexh303w0vh4',
  exp: 1501358550,
  iat: 1501351350,
  scope: 'openid profile read:messages',
  'http://localhost:3010/roles': [ 'super', 'admin' ] }
```


So for now we have figured out how to do this via rules written thru the Auth0 dashboard.
Next step, is it possible to do this via the Auth0 Mgmt API?

