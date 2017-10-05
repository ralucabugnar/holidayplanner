"use strict";
$(document).ready(function () {
  $('[type=submit]').click(function (e) {
    var email = $("[name=email]").val(),
        password = $("[name=password]").val(),
        user = new User(email, password), found;
    $.getJSON('FreeDaysTmpl.json', function (data) {
      for (var i = 0; i < data.length; i++){
        if ( user.email == data[i].email && user.password == data[i].password ) {
          found = 1;
          if (data[i].position == "manager" ) {
            sessionStorage.setItem('manager', data[i].position);
          }
          sessionStorage.setItem('currentUser', data[i].guid);
          $('.form-signin').removeAttr("onsubmit");
          $('.form-signin').submit();
          return;
        }
        else {
          found = 0;
        }
      }

      if ( found == 0 ) {
        alert("Incorrect username or password");
        $('.form-signin').attr("onsubmit", "return false");
      }
   });
 });

 function User(email, password){
   this.email = email;
   this.password = password;
 }
});
