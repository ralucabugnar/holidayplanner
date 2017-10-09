"use strict";
window.appNameSpace = window.appNameSpace || { };

$(document).ready(function () {
  $('#login').click(function (e) {
    var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
    hashObj.update($("[name=password]").val());
    var password = hashObj.getHash("HEX");
    console.log(password);
    var email = $("[name=email]").val(),
        user = new appNameSpace.User("", password, "", "", "", "", "", email, "", "", ""), found;
    var regexEmail=  /\w{1,30}\@[a-z0-9.-]+\.[a-z]{1,3}$/;
    $.post(appConfig.url + appConfig.api + "login", { email: email, password: password }).done(function( data ) {
        if (user.email.match(regexEmail) && user.email == data.email && user.password == data.password ) {
          found = 1;
          user['userID'] = data.userID;
          user['isActive'] = data.isActive;
          user['picture'] = data.picture;
          user['age'] = data.age;
          user['name'] = data.name;
          user['position'] = data.position;
          user['phone'] = data.phone;
          user['startDate'] = data.startDate;
          user['admin'] = data.admin;
          user['avfreedays'] = data.avfreedays;
          user['bonus'] = data.bonus;
          if (data.admin > 0 ) {
            sessionStorage.setItem('admin', data.admin);
          }
		  if (data.isActive == 0 ) {
			  alert("You don't work here");
			  appConfig.sessionInvalid = true;
            $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
           });
            window.location.href = 'login.html';
		  }
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(user));
          $('.form-signin').removeAttr("onsubmit");
          $('.form-signin').submit();
          return;
        }
        else {
          found = 0;
        }

      if ( found == 0 ) {
        alert("Incorrect username or password");
        $('.form-signin').attr("onsubmit", "return false");
      }
   });
 });

 appNameSpace.User=function(userID, password, isActive, picture, age, name, position, email, phone, startDate, admin, managerID, bonus){
   this.userID = userID;
   this.password = password;
   this.isActive = isActive;
   this.picture = picture;
   this.age = age;
   this.name = name;
   this.position = position;
   this.email = email;
   this.phone = phone;
   this.startDate = startDate;
   this.admin = admin;
   this.bonus = bonus;

 }
 appNameSpace.Manager = function(userID, password, isActive, picture, age, name, position, email, phone, startDate, admin, managerID) {
	appNameSpace.User.call(this,userID, password, isActive, picture, age, name, position, email, phone, startDate, admin, managerID);
 };
 appNameSpace.Manager.prototype = new appNameSpace.User;
});
