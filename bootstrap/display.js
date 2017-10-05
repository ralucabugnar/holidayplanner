"use strict";
$(document).ready( function () {
  console.log(sessionStorage.getItem('manager'));
  var user = sessionStorage.getItem('currentUser'), sum = 0;
  if ( user != null ) {
    $.getJSON('FreeDaysTmpl.json', function (data) {
      for (var i = 0; i < data.length; i++){
        if ( user == data[i].guid ) {
          $("#avatar").attr("src", data[i].picture);
          $("[name=name]").val(data[i].name);
          $("[name=age]").val(data[i].age);
          $("[name=email]").val(data[i].email);
          $("[name=phone]").val(data[i].phone);
          $("[name=position]").val(data[i].position);
          $("[name=mName]").val(data[i].manager.name);
          var fDate = moment(data[i].startDate).format("YYYY-MM-DD");
          $("[name=sDate]").val(fDate);
          $("[name=timeSpent]").val(moment().diff(data[i].startDate, 'months',false) + " months");
          console.log(moment(data[i].startDate).endOf('day').valueOf());
          for (var j in data[i].freeDays)
            if ( data[i].freeDays[j]["approved"] == true )
              sum += data[i].freeDays[j]["days"];
          if ( moment().diff(data[i].startDate, 'months',false) >= 12 ) {
            $("[name=avDays]").val(21/12*12-sum);
          }
          else {
            $("[name=avDays]").val(2);
          }

          return;
        }
      }
    });
  }
  else {
    alert("No user loged in!");
    window.location.href = "login.html";
  }

  if ( $(window).innerWidth() <= 1000 ) {
    $(".col-xs-1").removeClass( "col-xs-1").addClass("col-xs-2");
    $(".col-xs-2").removeClass( "col-xs-2").addClass("col-xs-6");
    $(".col-xs-4").removeClass( "col-xs-4").addClass("col-xs-7");
    $("[name=add]").css("float", "left");
    $("[name=logout]").css("float", "right");
    $(".navbar-nav").css("margin-right", "calc(100% - 215px)");
    $(".navbar-right").css("display", "-webkit-box");
    $(".navbar-collapse").css("display", "-webkit-box");
  };


  if ( sessionStorage.getItem('manager') != null ) {
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
        thD = $("<th>Date Time</th>"),
        thDy = $("<th>Days</th>"),
        thAd = $("<th>Approved</th>"),
        thAp = $("<th>Approve</th>");
    $(tr).append($(th));
    $(tr).append($(thN));
    $(tr).append($(thP));
    $(tr).append($(thE));
    $(tr).append($(thD));
    $(tr).append($(thDy));
    $(tr).append($(thAd));
    $(tr).append($(thAp));
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

  $('#startDatePicker')
        .datepicker({
            format: 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            // Revalidate the start date field
            $('#eventForm').formValidation('revalidateField', 'startDate');
        });

    $('#endDatePicker')
        .datepicker({
            format: 'mm/dd/yyyy'
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
                name: {
                    validators: {
                        notEmpty: {
                            message: 'The name is required'
                        }
                    }
                },
                startDate: {
                    validators: {
                        notEmpty: {
                            message: 'The start date is required'
                        },
                        date: {
                            format: 'MM/DD/YYYY',
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
                            format: 'MM/DD/YYYY',
                            min: 'startDate',
                            message: 'The end date is not a valid'
                        }
                    }
                }
            }
        })
        .on('success.field.fv', function(e, data) {
            if (data.field === 'startDate' && !data.fv.isValidField('endDate')) {
                // We need to revalidate the end date
                data.fv.revalidateField('endDate');
            }

            if (data.field === 'endDate' && !data.fv.isValidField('startDate')) {
                // We need to revalidate the start date
                data.fv.revalidateField('startDate');
            }
        });

        $('#savedate').on('click', function() {
          console.log($("#stdate").val());
          console.log($("#endate").val());
        });

});
