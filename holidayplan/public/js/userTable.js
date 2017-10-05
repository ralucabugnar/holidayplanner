"use strict";
window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;
$(document).ready(function(){
  var freeDays = [],
      token = sessionStorage.getItem('token');

  $.get(appConfig.url + appConfig.api + 'getFreeDaysApprover?token=' + token, function(data){
    if ( data.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
        $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
       });
				window.location.href = 'login.html';
			}
	}
    freeDays = data;
    var table = $('#userTable').DataTable();
    var j = 1;
    for (var i=0; i<freeDays.length; i++){
      table.row.add( [
        j,
        freeDays[i].name,
        freeDays[i].days,
        moment(freeDays[i].startDate).format("DD/MM/Y"),
        moment(freeDays[i].endDate).format("DD/MM/Y"),
        freeDays[i].type,
        freeDays[i].comment,
        freeDays[i].approved,
        freeDays[i].isActive,
        '<i class="fa fa-times" onclick="deleteHolidayModal(this,' + freeDays[i].id +')"></i>'
      ] ).draw( false )
      .nodes()
      .to$()
      .addClass();
      j++;
    }

    for ( var i = 0 ; i < freeDays.length; i++ ){
      var appr = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:nth-last-child(3)");
      var active = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:nth-last-child(2)");

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
          backgroundColor: "#d9edf7"
        })
      }else{
        active.css({
          backgroundColor: "#f2dede"
        })
      }
    }
  });
})

function deleteHolidayModal(elem,id){
  $.post(appConfig.url + appConfig.api+ 'deleteHoliday?token=' + token, { id: id}).done(function( data ) {
    $(elem).addClass("test");
    $(elem).parent().parent().slideUp("slow");
    console.log($(elem).parent().parent());
 });
}
