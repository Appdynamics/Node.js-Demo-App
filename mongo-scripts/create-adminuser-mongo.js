db = db.getSiblingDB('admin')
db.addUser( { user: "adminuser",
              pwd: "adminpassword",
              roles: [ "userAdminAnyDatabase" ] } )