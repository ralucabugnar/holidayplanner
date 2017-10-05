"use strict";
window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;

function weekend(d1,d2){
  var we = 0,
      days = d2.diff(d1,"days") + 1;
  while (d1 < d2){
    if (d1.days() == 0 || d1.days() == 6){
      we++;
    }
    d1.add(1,"days");
  }

  return days-we;
}

$(document).ready( function () {
  var theUser = JSON.parse(sessionStorage.getItem('user')),
      token = sessionStorage.getItem('token'),
      currentDate = moment(),
      sum = 0, manager, manId, bool = true;
  if ( theUser != null ) {
    $.post(appConfig.url + appConfig.api, { id: theUser.userID }).done(function( data ) {
      if (data.length != 0) {
        manager = data[0].name;
        manId = data[0].userID;
      }
      else {
        manager = 'admin';
        manId = 1;
      }
      $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + '&userID=' + theUser.userID, function (data) {
        if ( data.code == 110 ){
          if (!appConfig.sessionInvalid) {
            appConfig.sessionInvalid = true;
            alert('Session expired');
            $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
           });
            window.location.href = 'login.html';
          }
        }
      $("[name=mName]").val(manager);
      $("#avatar").attr("src", theUser.picture);
      $("[name=name]").val(theUser.name);
      $("[name=age]").val(theUser.age);
      $("[name=email]").val(theUser.email);
      $("[name=phone]").val(theUser.phone);
      $("[name=position]").val(theUser.position);
      var fDate = moment(theUser.startDate).format("YYYY-MM-DD");
      $("[name=sDate]").val(fDate);
      $("[name=timeSpent]").val(moment().diff(theUser.startDate, 'months',false) + " months");
      if(data.length == 0 ) {
        sum = 0;
      }
      else {
        for (var i = 0; i < data.length; i++){
            if ( data[i].approved == true )
              sum += data[i].days;
      }
    }
      var work = moment().diff(theUser.startDate, 'months', false);
      var restM = 12 - currentDate.month();
      $("[name=avDays]").val(Math.floor(21/12*restM - sum + theUser.bonus));
      if (currentDate.month() == 0 && currentDate.date() == 1 ) {
        $("[name=avDays]").val(parseInt($("[name=avDays]").val()) + 21 + theUser.bonus);
      }
      if ($("[name=avDays]").val() <= 0)
      {
        $("#holiday").css("display", 'none');
      }
      if (theUser.admin == 2) {
        $("[name=add]").parent().css('display', 'none');
        $("[name=addUser]").parent().css('display', 'block');
        $("#tabs li:not(:last)").css('display', 'none');
        $("#calendar").css('display', 'none');
        $("[name=mName]").val('admin');
        $("[name=avDays]").val(0);
      }
    });
  });
}

else {
  alert("No user loged in!");
  window.location.href = "login.html";
}

if ( sessionStorage.getItem('admin') != null ) {
  $('#navbar1 .navbar-nav li:nth-child(2)').css('display', 'block');
  var li = $("<li></li>"),
      a = $("<a data-toggle='tab' href='#management'></a>"),
      i = $("<i class='fa fa-pencil-square-o' aria-hidden='true'> Management</i>"),
      div =$("<div id='management' class='tab-pane fade'></div>"),
      table = $("<table id='manager-table' class='table display' cellspacing='0' width='100%'></table>"),
      thead = $("<thead class='thead-inverse'></thead>"),
      tr = $("<tr></tr>"),
      th = $("<th>#</th>"),
      thN = $("<th>Name</th>"),
      thP = $("<th>Position</th>"),
      thE = $("<th>Email</th>"),
      thD = $("<th>Start Date</th>"),
  thDa = $("<th>End Date</th>"),
      thDy = $("<th>Days</th>"),
  thTy = $("<th>Type</th>"),
  thCo = $("<th>Comment</th>"),
      thAd = $("<th>Approved</th>"),
      thAp = $("<th>Approve</th>");
  $(tr).append($(th));
  $(tr).append($(thN));
  $(tr).append($(thP));
  $(tr).append($(thE));
  $(tr).append($(thD));
$(tr).append($(thDa));
  $(tr).append($(thDy));
$(tr).append($(thTy));
$(tr).append($(thCo));
  $(tr).append($(thAd));
  $(tr).append($(thAp));
  $(thead).append($(tr));
  $(table).append($(thead));
  $(div).append($(table));
  $(".tab-content").append($(div));
  $(a).append($(i)),
  $(li).append($(a));
  $("#tabs").append($(li));

 var li = $("<li></li>"),
      a = $("<a data-toggle='tab' href='#users-list'></a>"),
      i = $("<i class='fa fa-pencil-square-o' aria-hidden='true'> Managed Users</i>"),
      div =$("<div id='users-list' class='tab-pane fade'></div>"),
      table = $("<table id='users-list-table' class='table display' cellspacing='0' width='100%'></table>"),
      thead = $("<thead class='thead-inverse'></thead>"),
      tr = $("<tr></tr>"),
      th = $("<th>#</th>"),
      thN = $("<th>Name</th>"),
      thP = $("<th>Position</th>"),
      thE = $("<th>Email</th>"),
      thD = $("<th>Start Date</th>"),
  thPh = $("<th>Phone</th>"),
  thAc = $("<th>Active</th>"),
  thPic = $("<th>Picture</th>"),
  thAg = $("<th>Age</th>"),
  thBo = $("<th>Bonus</th>"),
  thAct = $("<th>Actions</th>");
  $(tr).append($(th));
  $(tr).append($(thN));
  $(tr).append($(thP));
  $(tr).append($(thE));
  $(tr).append($(thD));
$(tr).append($(thPh));
  $(tr).append($(thAc));
$(tr).append($(thPic));
$(tr).append($(thAg));
$(tr).append($(thBo));
$(tr).append($(thAct));
  $(thead).append($(tr));
  $(table).append($(thead));
  $(div).append($(table));
  $(".tab-content").append($(div));
  $(a).append($(i)),
  $(li).append($(a));
  $("#tabs").append($(li));
}


$('#logout').click( function () {
  sessionStorage.clear();
  window.location.href = "login.html";

});
var date = new Date();
date.setDate(date.getDate()-1);

$('#startDatePicker')
      .datepicker({
          startDate: date,
          format: 'yyyy/mm/dd'
      })
      .on('changeDate', function(e) {
          // Revalidate the start date field
          $('#eventForm').formValidation('revalidateField', 'startDate');
      });

$('#endDatePicker')
    .datepicker({
        startDate: date,

        format: 'yyyy/mm/dd'
    })
    .on('changeDate', function(e) {
        $('#eventForm').formValidation('revalidateField', 'endDate');
    });

$('#eventForm')
    .formValidation({
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            vacationtype: {
                validators: {
                    notEmpty: {
                        message: 'The type is required'
                    }
                }
            },
            startDate: {
                validators: {
                    notEmpty: {
                        message: 'The start date is required'
                    },
                    date: {
                        format: 'YYYY/MM/DD',
                        max: 'endDate',
                        message: 'The start date is not a valid'
                    }
                }
            },
            endDate: {
                validators: {
                    notEmpty: {
                        message: 'The end date is required'
                    },
                    date: {
                        format: 'YYYY/MM/DD',
                        min: 'startDate',
                        message: 'The end date is not a valid'
                    }
                }
            }
        }
    }).on('success.field.fv', function(e, data) {
        if (data.field === 'startDate' && !data.fv.isValidField('endDate')) {
            // We need to revalidate the end date
            data.fv.revalidateField('endDate');
        }

        if (data.field === 'endDate' && !data.fv.isValidField('startDate')) {
            // We need to revalidate the start date
            data.fv.revalidateField('startDate');
        }
    }).on('submit', function(e, data) {
      if (!e.isDefaultPrevented()) {
          var stdate = moment($("#stdate").val()),
              enddate = moment($("#enddate").val());

          debugger;
          var from, to, duration;
          from = moment(stdate, 'YYYY-MM-DD');
          to = moment(enddate, 'YYYY-MM-DD');
          duration = weekend(from, to);

          var holidayOptions = {
              manag: manId,
              vacationtype: $("#vacationtype").val(),
              comment: $("#comment").val(),
              avDays: $("[name=avDays]").val(),
              stdate: stdate,
              enddate: enddate,
              duration: weekend(from, to)
          }

          check(stdate, enddate, holidayOptions, addHoliday);

          // if (validHoliday) {
          //     var manag = manId,
          //         vacationtype = $("#vacationtype").val(),
          //         comment = $("#comment").val();
          //
          //     if ($("[name=avDays]").val()>=duration) {
          //         $('.modal-body> div:first-child').css('display','block');
          //         $('.modal-body> div:nth-child(2)').css('display','none');
          //         $.post(appConfig.url + appConfig.api + 'updatedate?token=' + token, {
          //             vacationtype: vacationtype,
          //             comment: comment,
          //             stdate: stdate,
          //             enddate: enddate,
          //             userID: theUser.userID,
          //             days: duration,
          //             approverID:manag
          //         }, function( data ) {
          //             if ( data.code == 110 ){
          //                 if (!appConfig.sessionInvalid) {
          //                     appConfig.sessionInvalid = true;
          //                     alert('Session expired');
          //                     $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email});
          //                     window.location.href = 'login.html';
          //                 }
          //             }
          //             e.preventDefault();
          //             $('#myModal').find('form')[0].reset();
          //             $("#eventForm").data('formValidation').resetForm();
          //
          //         });
          //     } else {
          //       $('.modal-body> div:first-child').css('display','none');
          //       $('.modal-body> div:nth-child(2)').css('display','block');
          //     }
          //
          //     e.preventDefault();
          //     $('#myModal').find('form')[0].reset();
          //     $("#eventForm").data('formValidation').resetForm();
          // } else {
          //     console.log('errrrorrrr');
          // }
      }
    });

    $('#logout').click( function (e) {
      $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
     });
   });


   function addHoliday(options) {
       debugger;
       console.log(options, token);
       if (options.avDays >= options.duration) {
           $('.modal-body> div:first-child').css('display','block');
           $('.modal-body> div:nth-child(2)').css('display','none');
           $.post(appConfig.url + appConfig.api + 'updatedate?token=' + token, {
               vacationtype: options.vacationtype,
               comment: options.comment,
               stdate: options.stdate,
               enddate: options.enddate,
               userID: theUser.userID,
               days: options.duration,
               approverID: options.manag
           }, function( data ) {
               console.log(data);
               debugger;
               if ( data.code == 110 ){
                   if (!appConfig.sessionInvalid) {
                       appConfig.sessionInvalid = true;
                       alert('Session expired');
                       $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email});
                       window.location.href = 'login.html';
                   }
               }
               e.preventDefault();
               $('#myModal').find('form')[0].reset();
               $("#eventForm").data('formValidation').resetForm();

           });
       } else {
         $('.modal-body> div:first-child').css('display','none');
         $('.modal-body> div:nth-child(2)').css('display','block');
       }

       e.preventDefault();
       $('#myModal').find('form')[0].reset();
       $("#eventForm").data('formValidation').resetForm();
   }

  function check(startString, endString, options, callback) {
      console.log(options, callback);
      var start = moment(startString).format('YYYY-MM-DD'),
          end = moment(endString).format('YYYY-MM-DD');
          console.log(start, end);
      var isOk = true;
      $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + '&userID=' + theUser.userID, function (data) {
          if ( data.code == 110 ){
              if (!appConfig.sessionInvalid) {
                  appConfig.sessionInvalid = true;
                  alert('Session expired');
                  $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email});
                  window.location.href = 'login.html';
              }
          }
          if(data.length > 0 ) {
              for (var i = 0; i < data.length; i++) {
                  var st = moment(data[i].startDate).format('YYYY-MM-DD'),
                  ends = moment(data[i].endDate).format('YYYY-MM-DD');
                  console.log(i, st, ends, isOk, 'asta e   in for ');
                  if ( start.isBetween(st,ends) || end.isBetween(st,ends) ||
                  start == st || start == ends || end == st || end == ends) {
                      alert("Select another dates");
                      isOk = false;
                      break;
                  }
              }
              console.log(isOk);
              debugger;
              if (isOk) {
                  console.log(1, options);
                  debugger;
                  callback(options);
              } else {
                  console.log(2);
                  debugger;
                  console.log('errrrorrrr');
              }
          } else {
              console.log('1 else', options);
              debugger;
              callback(options);
          }
      });
  }
});
