"use strict";

$(document).ready(function(){
  var currentUser = sessionStorage.getItem('currentUser');
  if (currentUser == null){
    window.location.href = "login.html"
  }
  $.getJSON("FreeDaysTmpl.json",function(data){


    var user;
    for (var i=0; i<data.length; i++){
      if (data[i].guid == currentUser){
        user = data[i];
      }
    }
   
    var freeDays = user.freeDays
    for (var i=0; i<freeDays.length; i++){
      freeDays[i].index = i+1;
      freeDays[i].dateTime = moment(freeDays[i].dateTime).format("DD/MM/Y");
    }



    $("#userTable").DataTable({
      "data": freeDays,

      "columns": [
        {"data": "index"},
        {"data": "approver.name"},
        {"data": "approver.position"},
        {"data": "days"},
        {"data": "dateTime"},
        {"data": "approved"},
        {"data": "isActive"}
      ]
    })

    for ( var i=0; i<freeDays.length; i++ ){
      var appr = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:nth-child(6)");
      var active = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:last-child");
   
      if ( appr.html() == "true" ){
        $("#userTable>tbody>tr:nth-child("+(i+1)+")").css({
          backgroundColor: "#d9edf7"
        })
      }else{
        $("#userTable>tbody>tr:nth-child("+(i+1)+")").css({
          backgroundColor: "#f2dede"
        })
      }

      if ( active.html() == "true" ){
        active.css({
          backgroundColor: "#c3e6cb"
        })
      }
    }
  })
})
