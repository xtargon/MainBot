var UserSession = (function() {

  var full_name = "d";
  var adminInner = false;

  var setName = function(name) {
    full_name = name;     
    // Also set this in cookie/localStorage
  };

  var setAdmin = function(admin) {
    adminInner = admin;     
    // Also set this in cookie/localStorage
  };


  return {
    getName: full_name,
    setName: setName,
    getAdmin: adminInner,
    setAdmin: setAdmin
  }

})();

export default UserSession;