var d = [];
var dd = [];
var theUser = JSON.parse(sessionStorage.getItem('user')),
    user = sessionStorage.getItem('user'),
    sum = 0,
    manager,
    token = sessionStorage.getItem('token');

function fillDate() {

    if (user != null) {
        $.post(appConfig.url + appConfig.api, {
            id: theUser.userID
        }).done(function(data) {
            manager = data;
        });

        $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + "&userID=" + theUser.userID, function(data) {
            if (data.code == 110) {
                if (!appConfig.sessionInvalid) {
                    appConfig.sessionInvalid = true;
                    alert('Session expired');
                    $.post(appConfig.url + appConfig.api + 'logout', {
                        email: theUser.email
                    });
                    window.location.href = 'login.html';
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].userID == theUser.userID && data[i].approved == '1') {
                    d.push({
                        start: new Date(data[i].startDate),
                        end: new Date(data[i].endDate),
                        title: 'approved: ' + data[i].type
                    });
                }
                if (data[i].userID == theUser.userID && data[i].approved == '0') {
                    d.push({
                        start: new Date(data[i].startDate),
                        end: new Date(data[i].endDate),
                        title: 'pending: ' + data[i].type
                    });
                }
            }
            $.get(appConfig.url + appConfig.api + 'getLegalFreeDays?token=' + token + "&userID=" + theUser.userID, function(data) {
                  for (var i in data){
                      if((i >= 11) && (i <= data.length)){
                        dd.push({
                          start:new Date(data[i].startDate),
                          title:'+ '+ data[i].name
                        });
                      };
                 };
                $.get(appConfig.url + appConfig.api + 'legalFreeHolidays', function(data) {
                    for (var i in data) {
                        if (data[i].type == "public") {
                            d.push({
                                start: new Date(data[i].start),
                                title: '+ ' + data[i].name
                            });
                        };
                    };

                    Array.prototype.push.apply(d, dd);
                    main();
                    colorEvents();
                });

            });
        });
    };
};

fillDate();

function reloadJs(src) {
    src = $('script[src$="' + src + '"]').attr("src");
    $('script[src$="' + src + '"]').remove();
    $('<script/>').attr('src', src).appendTo('body');
}

function colorEvents() {

    $('.fc-event-title:contains("approved")').parent().addClass("fc-event-approved");
    $('.fc-event-title:contains("pending")').parent().addClass("fc-event-pending");
    $('.fc-event-title:contains("+")').parent().addClass("fc-event-legal");
}

function main() {


    $(window).trigger('setup');
    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();

    /*  className colors

    className: default(transparent), important(red), chill(pink), success(green), info(blue)

    */


    /* initialize the external events
    -----------------------------------------------------------------*/

    $('#external-events div.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });

    });


    /* initialize the calendar
    -----------------------------------------------------------------*/

    var calendar = $('#calendar').fullCalendar({
        // header: {
        //     left: 'title',
        //     center: 'agendaDay,agendaWeek,month',
        //     right: 'prev,next today'
        // },
        // editable: true,
         firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
         eventTextColor: '#000',
        // selectable: true,
        // defaultView: 'month',
        //
        // axisFormat: 'h:mm',
        // columnFormat: {
        //     month: 'ddd', // Mon
        //     week: 'ddd d', // Mon 7
        //     day: 'dddd M-d', // Monday 9/7
        //     agendaDay: 'dddd d'
        // },
        // titleFormat: {
        //     month: 'MMMM yyyy', // September 2009
        //     week: "MMMM yyyy", // September 2009
        //     day: 'MMMM yyyy' // Tuesday, Sep 8, 2009
        // },
        // allDaySlot: false,
        // selectHelper: true,
        // select: function(start, end, allDay) {
        //     var title = prompt('Event Title:');
        //     if (title) {
        //         calendar.fullCalendar('renderEvent', {
        //                 title: title,
        //                 start: start,
        //                 end: end,
        //                 allDay: allDay
        //             },
        //             true // make the event "stick"
        //         );
        //     }
        //     calendar.fullCalendar('unselect');
        // },
        // droppable: true, // this allows things to be dropped onto the calendar !!!
        // drop: function(date, allDay) { // this function is called when something is dropped
        //
        //     // retrieve the dropped element's stored Event Object
        //     var originalEventObject = $(this).data('eventObject');
        //
        //     // we need to copy it, so that multiple events don't have a reference to the same object
        //     var copiedEventObject = $.extend({}, originalEventObject);
        //
        //     // assign it the date that was reported
        //     copiedEventObject.start = date;
        //     copiedEventObject.allDay = allDay;
        //
        //     // render the event on the calendar
        //     // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
        //     $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
        //
        //     // is the "remove after drop" checkbox checked?
        //     if ($('#drop-remove').is(':checked')) {
        //         // if so, remove the element from the "Draggable Events" list
        //         $(this).remove();
        //     }
        //
        // },


        events: window.d,
        dayClick: function(date, jsEvent, view) {
            var currentDay = moment().format('YYYY-MM-DD');
            $("#myModal").modal('show');
            $("#datepicker").datepicker( "setDate", "'" + date.format() + "'" );



            // alert('Clicked on: ' + date.format());
            //
            // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            //
            // alert('Current view: ' + view.name);
            //
            // // change the day's background color just for fun
            // $(this).css('background-color', 'red');

        }

    });

//     $("#calendar table").on('click', 'td', function (){
//         var date = moment($(this).data('date')).format('YYYY-MM-DD')
//             console.log(date);
//             var currentDay = moment().format('YYYY-MM-DD');
//             if (moment(date).isSameOrAfter(currentDay)) {
//                 $("#myModal").modal('show');
//                 $("#datepicker").datepicker( "setDate", "'" + moment($(this).data('date')).format('YYYY-MM-DD') + "'" );
//                 console.log($("#datepicker").val());
//             }
// });
}
