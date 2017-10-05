$(function () {
	var currentUser  = sessionStorage.getItem('currentUser');
	var manager = sessionStorage.getItem('manager');
	$.getJSON('FreeDaysTmpl.json', function (data) {
		var table = $('#manager-table').DataTable();
		var j = 1;
		for (var i=0; i < data.length; i++ ){
			if (data[i].manager.guid === currentUser) {
					$.each(data[i].freeDays, function(key, value){
					value.dateTime = moment(value.dateTime);
				});
				data[i].freeDays.sort(sortByDate);
				$.each(data[i].freeDays, function(key, value){
					var colorClass = colorTableRow(value.approved);
					var approvedClass = (value.approved) ? "times" : "check";
					table.row.add( [
						j,
						data[i].name,
						data[i].position,
						data[i].email,
						value.dateTime.format("DD/MM/Y"),
						value.days,
						value.approved,
						"<span class='fa fa-" + approvedClass + "' onclick='approveFreeDays(this)'></span>"
					] ).draw( false )
					.nodes()
					.to$()
					.addClass( colorClass );
					j++;
				});
			}
		}
	});
});
function approveFreeDays(elem) {
	var parentRow = $(elem).closest("tr");
	var approv = parentRow.find("td").eq(6)[0].innerHTML;
	$(elem).toggleClass("fa-times").toggleClass("fa-check");
	if($(elem).hasClass("fa-times")){
		approv = "true";
		console.log(approv);
	}else{
		approv = "false";
		console.log(approv);
	}
}
function colorTableRow(approved) {
	if (approved == true) {
		return "info";
	} else {
		return "danger";
	}
}
var sortByDate = function (a, b) {
	var now = moment();
	if (a.dateTime >= now){
		if (b.dateTime < now) {
			return -1;
		} else {
			return a.dateTime - b.dateTime;
		}
	} else {
		if (b.dateTime >= now) {
			return 1;
		} else {
			return b.dateTime - a.dateTime;
		}
	}
}
