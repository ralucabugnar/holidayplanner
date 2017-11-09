"use strict";
window.appNameSpace = window.appNameSpace || {};
window.sessionInvalid = false;

function weekend(d1, d2) {
    var we = 0,
        days = d2.diff(d1, "days") + 1;
    while (d1 <= d2) {
        if (d1.days()  == 0 || d1.days()  == 6) {
            we++;
        }
        d1.add(1, "days");
    }
    return days - we;
}

var holidaysNoCount = [
    {
        type: 'Donare sange',
        days: 1
    },
    {
        type: 'Deces (gradul 1)',
        days: 1
    },
    {
        type: 'Deces (gradul 2)',
        days: 2
    },
    {
        type: 'Casatorie',
        days: 5
    },
    {
        type: 'Nou nascut',
        days: 10
    },
    {
        type: 'Maternitate/Paternitate',
        days: 730
    }
]

$('#tabClickCalendar').click(function() {
    setTimeout(function() {
      reloadJs('../js/calendar.js');
     // location.reload();

    }, 50);
});
$(document).ready(function() {
    displayForm();
  var theUser = JSON.parse(sessionStorage.getItem('user'));
  var  token = sessionStorage.getItem('token');

  function freedays(){
  $.get(appConfig.url + appConfig.api + 'getLegalFreeDays?token=' + token + "&userID=" + theUser.userID, function(data) {
          var datesEnabled= [];
          for (var i in data) {
            datesEnabled.push(data[i].startDate.toString().substring(0,10));
          }
          $('#datepicker').datepicker({
              multidate: 2,
              multidateSeparator: ";",
              toggleActive: true,
              // startDate: new Date(),
              clearBtn: true,
              minViewMode: 0,
              format: 'yyyy-mm-dd',
              beforeShowDay: function (date) {

                if ((date.getMonth()+1 >= 10) && (date.getDate() >= 10)) {
                  var  allDates = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate());
                } else if ((date.getMonth()+1 >= 10) && (date.getDate() <= 10)) {
                  var  allDates = date.getFullYear() + '-' + (date.getMonth()+1) + '-0' + (date.getDate());
                } else if ((date.getMonth()+1 < 10) && (date.getDate() >= 10)) {
                  var  allDates = date.getFullYear() + '-0' + (date.getMonth()+1) + '-' + (date.getDate());
                } else if ((date.getMonth()+1 < 10) && (date.getDate() <= 10)) {
                  var  allDates = date.getFullYear() + '-0' + (date.getMonth(+1)) + '-0' + (date.getDate());
                }

                if (datesEnabled.indexOf(allDates) != -1) {
                  return false;
                } else {
                  return true;
                };
              }
          });

      });
};
    $('#tabClick').addClass('active');
    var theUser = JSON.parse(sessionStorage.getItem('user')),
        token = sessionStorage.getItem('token'),
        currentDate = moment(),
        sum = 0,
        manager, manId, dates = new Array(),
        isOk = true;

    $('#fileupload').fileupload({
        url: appConfig.url + appConfig.api + 'upload',
        formData: {
            id: theUser.userID,
            token: token
        },
        dataType: 'json',
        done: function(e, data) {
            $.each(data.result.files, function(index, file) {
                $('<p/>').text(file.name).appendTo('#files');
            });
            theUser.picture = data.result;
            sessionStorage.setItem('user', JSON.stringify(theUser));
            $("#avatar").attr("src", 'data:image/png;base64,' + theUser.picture);
        }
    });

    //file upload

    if (theUser != null) {
        $.post(appConfig.url + appConfig.api, {
            id: theUser.userID
        }).done(function(data) {
            if (data.length != 0) {
                manager = data[0].name;
                manId = data[0].userID;
            } else {
                manager = 'admin';
                manId = 1;
            }
            $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + '&userID=' + theUser.userID, function(data) {
                out(data.code);
                $("[name=mName]").val(manager);
                $("#avatar").attr("src", 'data:image/png;base64,' + theUser.picture);
                $("[name=name]").val(theUser.name);
                $("[name=age]").val(theUser.age );
                $("[name=email]").val(theUser.email);
                $("[name=phone]").val(theUser.phone);
                $("[name=position]").val(theUser.position);
                var fDate = moment(theUser.startDate).format("MM/DD/YYYY");
                $("[name=sDate]").val(fDate);
                $("[name=timeSpent]").val(moment().diff(theUser.startDate, 'months', false) + " months");
                $("[name=avDays]").val(theUser.avfreedays);
                window.theUser = theUser;

                sessionStorage.setItem('user', JSON.stringify(theUser));
                $.get(appConfig.url + appConfig.api + 'updateFreeDays?token=' + token + '&userEmail=' + theUser.email + '&avfreedays=' + $("[name=avDays]").val(), function(data) {
                    out(data.code);
                });
            });
        });
    } else {
        alert("No user loged in!");
        window.location.href = "login.html";
    }

    if (sessionStorage.getItem('admin') != null) {
        $('#navbar1 ul:first-of-type > li:nth-child(2)').css('display', 'block');
        var li = $("<li></li>"),
            a = $("<a data-toggle='tab' href='#management'></a>"),
            i = $("<i class='fa fa-pencil-square-o' aria-hidden='true'> Management</i>"),
            div = $("<div id='management' class='tab-pane fade'></div>"),
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
            thAf = $("<th>Free days</th>"),
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
        $(tr).append($(thAf));
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
            a = $("<a data-toggle='tab' href='#users-list' name='userst'></a>"),
            i = $("<i class='fa fa-pencil-square' aria-hidden='true'> Managed Users</i>"),
            div = $("<div id='users-list' class='tab-pane fade'></div>"),
            table = $("<table id='users-list-table' class='table display' cellspacing='0' width='100%'></table>"),
            thead = $("<thead class='thead-inverse'></thead>"),
            tr = $("<tr></tr>"),
            th = $("<th>#</th>"),
            thN = $("<th>Name</th>"),
            thP = $("<th>Position</th>"),
            thE = $("<th>Email</th>"),
            thD = $("<th>Start Date</th>"),
            thPh = $("<th>Phone</th>"),
            thM = $("<th>Manager</th>"),
            thAc = $("<th>Active</th>"),
            thAg = $("<th>Age</th>"),
            thBo = $("<th>Bonus</th>"),
            thAct = $("<th>Actions</th>");
        $(tr).append($(th));
        $(tr).append($(thN));
        $(tr).append($(thP));
        $(tr).append($(thE));
        $(tr).append($(thD));
        $(tr).append($(thPh));
        $(tr).append($(thM));
        $(tr).append($(thAc));
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

    if (theUser.admin == 2) {
        $("[name=userst]").parent().addClass('active');
        $("[name=userst]").attr('aria-expanded', true);
        $("#users-list").addClass('active in');
        $("[name=add]").parent().css('display', 'none');
        $("[name=addUser]").parent().css('display', 'block');
        $("#tabs li:not(:last)").css('display', 'none');
        $("#calendar").css('display', 'none');
        $("[name=mName]").val('admin');
        $("[name=avDays]").val(0);
    } else if (theUser.admin != 2) {
        $("#forAdmin").css("display", 'none');
        $("#holiday").css('display', 'block');
        $("[name=addUser]").parent().css('display', 'block');
        $("#newyear").css("display", 'none');
    }

    if (theUser.admin == 0) {
        $("[name=addUser]").css('display', 'none');
    }

    $('#logout').click(function() {
        sessionStorage.clear();
        window.location.href = "login.html";

    });
    var date = new Date();
    date.setDate(date.getDate());


    $('#myModal').on('hidden.bs.modal', function() {
        $('#eventForm').bootstrapValidator('resetForm', true);
        $(this).find("input,textarea,select").val('').end();
        $('.modal-body> div:first-child').css('display', 'none');
        $('.modal-body> div:nth-child(2)').css('display', 'none');
        $('.modal-body> div:nth-child(3)').css('display', 'none');
    });

    var nrOfDays, from, to, currentDay = (moment().format('YYYY-MM-DD')), formValid = true;

function addholidayForm() {
    getFreeDays();
  freedays();
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

                comment: {
                    validators: {
                        notEmpty: {
                            message: 'The comment is required'
                        }
                    }
                }
            }
        }).on('change', function(e, data) {
            if($(".date").val()){

                $("div #info").empty();
                $("div #danger").empty();
                var date = $(".date").val().split(";"),
                stdate = date[0],
                enddate = date[1]
                from = moment(stdate).format('YYYY/MM/DD');
                if (!enddate) {
                    to = moment(stdate).format('YYYY/MM/DD');
                } else {
                    to = moment(enddate).format('YYYY/MM/DD');
                }
                var aux, from2 = "'" + from + "'", to2 = "'" + to + "'";

                if (moment(from2).isAfter(moment(to2)) || moment(to2).isBefore(moment(from2))) {
                    aux = to;
                    to = from;
                    from = aux;
                }

                var isWeekend = weekend(moment(from), moment(to));
                var arrayOfSelectedDays = arrayFromStToEnd(from, to);
                nrOfDays = checkArrays(arrayOfSelectedDays, dates, isWeekend);
                var type = $('#vacationtype').val();
                for (var j in holidaysNoCount) {
                    if (type == holidaysNoCount[j].type) {
                        if (nrOfDays != holidaysNoCount[j].days) {
                            $("div #danger").append("<p>The duration for this type of holiday is " + holidaysNoCount[j].days + " days.</p>").css('display', 'block');
                            $("[name=comment]").attr('disabled', true);
                            formValid = false;
                            break;
                        }
                        else {
                            $("#danger").css('display', 'none');
                            $("[name=comment]").attr('disabled', false);
                            formValid = true;
                            break;
                        }
                    }
                    else {
                        $("[name=comment]").attr('disabled', false);
                        formValid = true;
                    }
                }
                if (type) {
                    $("div #info").css('display', 'block');
                    if (type == 'Concediu') {
                        $("div #info").append("<p>You selected " + nrOfDays + " days. These will be taken from the total number of available leave days.</p>")
                    }
                    else {
                        $("div #info").append("<p>You selected " + nrOfDays + " days. These will not be taken from the total number of available leave days.</p>")
                    }
                }
            }
        }).on('submit', function(e, data) {
           if (!e.isDefaultPrevented()) {
                if (formValid) {
                    var duration;
                    duration = nrOfDays;

                    var holidayOptions = {
                        managerName: manager,
                        manag: manId,
                        vacationtype: $("#vacationtype").val(),
                        comment: $("#comment").val(),
                        avDays: theUser.avfreedays,
                        stdate: from,
                        enddate: to,
                        duration: duration
                    }

                    if (duration == 0) {
                        alert('Please select another interval.');
                        $('#myModal').find('form')[0].reset();
                    }
                    else {
                        check(from, to, holidayOptions, addHoliday);
                        $("div #info").css('display', 'none');
                        $("div #danger").css('display', 'none');
                    }
                }
                e.preventDefault();
            }
        });

    $('#logout').click(function(e) {
        $.post(appConfig.url + appConfig.api + 'logout', {
            email: theUser.email
        }).done(function(data) {});
    });

    function getFreeDays() {
        $.get(appConfig.url + appConfig.api + 'legalFreeHolidays', function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'public') {
                    dates.push(moment(data[i].date).format("YYYY/MM/DD"));
                }
            }
        });
    };

    function addHoliday(options) {
        $.get(appConfig.url + appConfig.api + 'updatedate?token=' + token, {
            vacationtype: options.vacationtype,
            comment: options.comment,
            stdate: moment(options.stdate).format("YYYY/MM/DD"),
            enddate: moment(options.enddate).format("YYYY/MM/DD"),
            userID: theUser.userID,
            days: options.duration,
            approverID: options.manag
        }, function(data) {
            out(data.code);
            // Insert event into calendar.
            var event = {
                title: 'pending: ' + options.comment,
                start: moment(options.stdate).format("YYYY-MM-DD"),
                end: moment(options.enddate).format("YYYY-MM-DD"),
            };
            $('#calendar').fullCalendar('renderEvent', event, true);
            e.preventDefault();
        });
        $('.modal-body> div:first-child').css('display', 'block');
        $('.modal-body> div:nth-child(2)').css('display', 'none');
        $('.modal-body> div:nth-child(3)').css('display', 'none');

        $("div #info").css('display', 'none');
        $("div #danger").css('display', 'none');
        reloadJs('../js/calendar.js');
    }

    function check(startString, endString, options, callback) {
        var start = moment(startString).format("YYYY/MM/DD"),
            end = moment(endString).format("YYYY/MM/DD");
        $.get(appConfig.url + appConfig.api + 'getFreeDaysApproved?token=' + token + '&userID=' + theUser.userID, function(data) {
            out(data.code);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var st = moment(data[i].startDate).format("YYYY/MM/DD"),
                        ends = moment(data[i].endDate).format("YYYY/MM/DD"),
                        start2 = start,
                        end2 = end,
                        dateArray = new Array(),
                        currentDay = (moment().format('YYYY/MM/DD'));
                    if (moment(start).isBetween(st, ends) || moment(end).isBetween(st, ends) || start == st || start == ends || end == st || end == ends || start > end ) {
                        $('.modal-body> div:first-child').css('display', 'none');
                        $('.modal-body> div:nth-child(2)').css('display', 'none');
                        $('.modal-body> div:nth-child(3)').css('display', 'block');
                        $("div #info").css('display', 'none');
                        $("div #danger").css('display', 'none');
                        isOk = false;
                        break;
                    }
                    else {
                        isOk = true;
                    }

                    dateArray = arrayFromStToEnd(start2, end2);

                    for (var j = 0; j < dateArray.length; j++) {
                        if (dateArray[j] == st || dateArray[j] == ends) {
                            $('.modal-body> div:first-child').css('display', 'none');
                            $('.modal-body> div:nth-child(2)').css('display', 'none');
                            $('.modal-body> div:nth-child(3)').css('display', 'block');
                            isOk = false;
                            break;
                        }
                        else {
                            isOk = true;
                        }
                    }
                }
                if (isOk) {
                    callback(options);

                    $("div #info").css('display', 'none');
                    $("div #danger").css('display', 'none');
                    location.reload();
                }
            } else {
                $("div #info").css('display', 'none');
                $("div #danger").css('display', 'none');
                callback(options);
            }

            if (data.length > 0 && isOk) {
                var dataId = data[0].id;
                var tr = $("<tr>");
                tr.addClass("danger");
                var index = parseInt($("#userTable tbody tr").last().find("td").first().text()) + 1;
                tr.append("<td class='sorting_1'>" + index + "</td>").css("backgroundColor", "rgb(242, 222, 222)");
                tr.append("<td>" + options.managerName + "</td>");
                tr.append("<td>" + options.duration + "</td>");
                tr.append("<td>" + moment(options.stdate).format("DD/MM/YYYY") + "</td>");
                tr.append("<td>" + moment(options.enddate).format("DD/MM/YYYY") + "</td>");
                tr.append("<td>" + options.vacationtype + "</td>");
                tr.append("<td>" + options.comment + "</td>");
                tr.append("<td>" + 'Pending' + "</td>");
                tr.append("<td>" + '<i class="fa fa-times"></i>' + "</td>");
                $("#userTable tbody").append(tr);
            } else if (data.length == 0 && isOk) {
                $(".dataTables_empty").css("display", "none");
                var tr = $("<tr>");
                tr.addClass("danger");
                var index = parseInt($("#userTable tbody tr").last().find("td").first().text());
                tr.append("<td class='sorting_1'>" + 1 + "</td>").css("backgroundColor", "rgb(242, 222, 222)");
                tr.append("<td>" + options.managerName + "</td>");
                tr.append("<td>" + options.duration + "</td>");
                tr.append("<td>" + moment(options.stdate).format("DD/MM/YYYY") + "</td>");
                tr.append("<td>" + moment(options.enddate).format("DD/MM/YYYY") + "</td>");
                tr.append("<td>" + options.vacationtype + "</td>");
                tr.append("<td>" + options.comment + "</td>");
                tr.append("<td>" + 'Pending' + "</td>");
                tr.append("<td>" + '<i class="fa fa-times"></i>' + "</td>");
                $("#userTable tbody").append(tr);
            }
        });
    }


    function arrayFromStToEnd (st, end) {
        var datesArr = new Array();
        while (st <= end) {
            datesArr.push(st);
            var duration = moment.duration({
                'days' : 1
            });
            st = moment(st, 'YYYY/MM/DD').add(duration).format('YYYY/MM/DD');
        }
        return datesArr;
    }

    function arratOfLegalHolidays () {

    }

    function checkArrays(arr1, arr2, options) {
      // Remove duplicates from public hollidays array.
      var unique_arr2 = [];
      $.each(arr2, function(i, el){
          if($.inArray(el, unique_arr2) === -1) unique_arr2.push(el);
      });
        for (var l = 0; l < arr1.length; l++) {
            for (var d = 0; d < unique_arr2.length; d++) {
                if (arr1[l] == unique_arr2[d]) {
                    options--;
                }
            }
        }
        return options;
    }

    function out(data) {
        if (data == 110) {
            if (!appConfig.sessionInvalid) {
                appConfig.sessionInvalid = true;
                alert('Session expired');
                $.post(appConfig.url + appConfig.api + 'logout', {
                    email: theUser.email
                });
                window.location.href = 'login.html';
            }
        }
    }
};
    function displayForm() {
        $("#myModal").load("addholiday.html", function() {
            addholidayForm();
        });
    };

    $("#dropdownMenu2").click(function() {
        $("div #info").css('display', 'none');
        $("div #danger").css('display', 'none');
        displayForm();
        reloadJs('../js/calendar.js');
    });

    $("#close").click(function() {
        location.reload();
    });
});
