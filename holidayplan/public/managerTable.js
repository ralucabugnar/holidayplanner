window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;
var token = sessionStorage.getItem('token');

$(function () {
	if ( sessionStorage.getItem('admin') == null ) {
		return;
	}
	$("a[name='addUser']").click(function(){
		$("#myModalUser").load("addUserForm.html", function(){

			prepareUserForm();
		});
	});

	$("a[name='updateUser']").click(function(){
		$("#myModalUpdateUser").load("updateUserForm.html", function(){
			fillUpdateUserForm();
			updateUser();
		});
	});

function fillUpdateUserForm (){
	var currentPicture = JSON.parse(sessionStorage.getItem('user')).picture;
	var currentName = JSON.parse(sessionStorage.getItem('user')).name;
	var currentAge = JSON.parse(sessionStorage.getItem('user')).age;
	var currentPhone = JSON.parse(sessionStorage.getItem('user')).phone;
	document.getElementById("userPicture").value = currentPicture;
	document.getElementById("username").value = currentName;
	document.getElementById("ageUser").value = currentAge;
	document.getElementById("phoneUser").value = currentPhone;
}

	var manager = new appNameSpace.Manager("userID", "password", "isActive", "picture", "age", "name", "position", "email", "phone", "startDate", "admin", "managerID");
	$.get(appConfig.url + appConfig.api + 'getManagerFreeDays?token=' + token, function (freeDays) {
		if ( freeDays.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
				window.location.href = 'login.html';
			}
		}
		var table = $('#manager-table').DataTable();
		var j = 1;
		for ( i=0; i < freeDays.length; i++ ){
			var colorClass = colorTableRow(freeDays[i].approved);
			var approvedClass = (freeDays[i].approved) ? "times" : "check";
			table.row.add( [
				j,
				freeDays[i].name,
				freeDays[i].position,
				freeDays[i].email,
				moment(freeDays[i].startDate).format("DD/MM/Y"),
				moment(freeDays[i].endDate).format("DD/MM/Y"),
				freeDays[i].days,
				freeDays[i].type,
				freeDays[i].comment,
				(freeDays[i].approved == 1) ? "Approved" : "Not Approved",
				"<span class='fa fa-" + approvedClass + "' onclick='displayApproveModal(this ," + freeDays[i].id + ")' approved='"+ freeDays[i].approved +"'></span>"
			] ).draw( false )
			.nodes()
			.to$()
			.addClass( colorClass );
			j++;
		}
     });

	 // Managed Users Table
	var userid = JSON.parse(sessionStorage.getItem('user')).userID;
	 $.get(appConfig.url + appConfig.api + 'getManagerUsers?token=' + token + '&userId=' + userid , function (users) {
		if ( users.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
				window.location.href = 'login.html';
			}
		}
		var userstable = $('#users-list-table').DataTable();
		var j = 1;
		for ( i=0; i < users.length; i++ ){
			userstable.row.add( [
				j,
				users[i].name,
				users[i].position,
				users[i].email,
				moment(users[i].startDate).format("DD/MM/Y"),
				users[i].phone,
				users[i].isActive,
				users[i].picture,
				users[i].age,
				'<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
				//"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
			] ).draw( false );
			j++;
		}
     });

		 if (theUser.admin == 2) {
			$.get(appConfig.url + appConfig.api + 'getAllUsers?token='+token, function (users) {
				if ( users.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						window.location.href = 'login.html';
					}
				}
				var userstable = $('#users-list-table').DataTable();
			 var j = 1;
			 for ( i=0; i < users.length; i++ ){
				 userstable.row.add( [
					 j,
					 users[i].name,
					 users[i].position,
					 users[i].email,
					 moment(users[i].startDate).format("DD/MM/Y"),
					 users[i].phone,
					 users[i].isActive,
					 users[i].picture,
					 users[i].age,
					 '<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
					 //"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
				 ] ).draw( false );
				 j++;
			 }

			});
		}

	$("#approve-modal-btn-yes").click(function(){
		console.log("yes");
		approveFreeDays();
		 $("#approve-freedays-modal").modal('hide');
	});
	$("#approve-modal-btn-no").click(function(){
		 $("#approve-freedays-modal").modal('hide');
	});

});

function displayApproveModal(elem, id){
	 var approveModal =  $("#approve-freedays-modal");
	 approveModal.modal('show');
	 approveModal.attr("approveId", id);
	 $("#manager-table tr").removeClass("activeModal");
	 $(elem).closest("tr").addClass("activeModal");
};

function approveFreeDays() {
	var tr = $("#manager-table tr.activeModal");
	var elem = tr.find("td").eq(10).find("span");
	var id = $("#approve-freedays-modal").attr("approveId");
	var approved = parseInt($(elem).attr("approved"));
	var approvedText = "Approved";
	if (approved == 0) {
		approved = 1;
	} else {
		approved = 0;
		approvedText = "Not Approved";
	}
	$.get(appConfig.url + appConfig.api + 'ApproveFreeDays?id=' + id + '&approved=' + approved + '&token=' + token, function (data) {
		if ( data.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
				window.location.href = 'login.html';
			}
		}
		var parentRow = $(elem).closest("tr");
		parentRow.toggleClass("info").toggleClass("danger");

		$(elem).toggleClass("fa-times").toggleClass("fa-check");
		$(elem).parent().prev().text(approvedText);
		$(elem).attr("approved", approved);
	});
}
function colorTableRow(approved) {
	if (approved == true) {
		return "info";
	} else {
		return "danger";
	}
}
var editUserForm = $("#edit-user-form");
function managerEditUser(elem, userId) {
	var tr = $(elem).closest("tr");
	$("#users-list tr").removeClass("active-user");
	tr.addClass("active-user");
	var userInfo = tr.find("td");

	$("#myModalUser").load("editUserForm.html", function(){
		prepareUserForm();

		var editUserForm = $("#edit-user-form");
		editUserForm.attr("user-id", userId);
		console.log(userId);
		// Add user details into edit form.
		var name = userInfo.eq(1).text();
		editUserForm.find("input[name='username']").val(name);

		var position = userInfo.eq(2).text();
		editUserForm.find("select[name='pos']").val(position);

		var email = userInfo.eq(3).text();
		editUserForm.find("input[name='emailUser']").val(email);

		var stdate = userInfo.eq(4).text();
		editUserForm.find("input[name='stwork']").val(stdate);

		var phone = userInfo.eq(5).text();
		editUserForm.find("input[name='phoneUser']").val(phone);

		var active = userInfo.eq(6).text();
		editUserForm.find("input[name='active']").val(active);

		var age = userInfo.eq(8).text();
		editUserForm.find("input[name='ageUser']").val(age);

	});
}
function managerDeleteUser(elem, userId) {
	console.log('aaa');
	var userId = $("#edit-user-form").attr("user-id");
	console.log(userId);

	$.get(appConfig.url + appConfig.api + 'ManagerDeleteUser?userId=' + userId + '&token=' + token, function (data) {
		if ( data.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
				window.location.href = 'login.html';
			}
		}
		$('#myModalUser').find('form')[0].reset();
		$("#edit-user-form").data('formValidation').resetForm();
		$('#myModalUser').modal('toggle');
		$('#users-list tr.active-user').slideUp("slow");
		alert("User was deleted");
	});

}

function prepareUserForm() {

	var date = new Date();
	date.setDate(date.getDate()-1);
	$('#stwork').datepicker({
		endDate: date,
		format: 'yyyy/mm/dd'
	}).on('changeDate', function(e) {
		$('#add-user-form').formValidation('revalidateField', 'stwork');
	});

	// Add user form.
	$("#add-user-form").formValidation({
		framework: 'bootstrap',
		icon: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			username: { validators: { notEmpty: {message: 'This is required'}}},
			stwork: { validators: { notEmpty: { message: 'The start date is required'}}},
			pos: { validators: { notEmpty: { message: 'This required'}}}
		}
	}).on('submit', function(e, data) {
		if (e.isDefaultPrevented()) {
			// handle the invalid form...
		} else {
			var formWrapper = $("#add-user-form");
			var userName = formWrapper.find("input[name = 'username']").val();
			var age = formWrapper.find("input[name = 'ageUser']").val();
			var position = formWrapper.find("[name = 'pos']").val();
			var stwork = formWrapper.find("[name = 'stwork']").val();
			var email = formWrapper.find("input[name = 'emailUser']").val();
			var phone = formWrapper.find("input[name = 'phoneUser']").val();
			var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
	    hashObj.update('avangarde');
			var password = hashObj.getHash("HEX");
			$.post(appConfig.url + appConfig.api + 'addUser?token=' + token, { email: email, name: userName, age: age, password:password, position: position, phone: phone, stwork:stwork}).done(function( data ) {
				var userid = JSON.parse(sessionStorage.getItem('user')).userID;
				$.post(appConfig.url + appConfig.api + 'modifyClass', { userID: data.insertId, managerID: userid, token: token}).done(function( data ) {
				});
				if ( data.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						window.location.href = 'login.html';
					}
				}
				$('#myModalUser').find('form')[0].reset();
				$("#add-user-form").data('formValidation').resetForm();
				$('#myModalUser').modal('toggle');
			});
			e.preventDefault();

		}
	});

	// Edit user form.
	$("#edit-user-form").formValidation({
		framework: 'bootstrap',
		icon: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			username: { validators: { notEmpty: {message: 'This is required'}}},
			stwork: { validators: { notEmpty: { message: 'The start date is required'}}},
			pos: { validators: { notEmpty: { message: 'This required'}}}
		}
	}).on('submit', function(e, data) {
		if (e.isDefaultPrevented()) {
			// handle the invalid form...
		} else {
			var formWrapper = $("#edit-user-form");
			var userid = formWrapper.attr("user-id");
			var userName = formWrapper.find("input[name = 'username']").val();
			var isActive = formWrapper.find("input[name = 'active']").val();
			var age = formWrapper.find("input[name = 'ageUser']").val();
			var stwork = formWrapper.find("[name = 'stwork']").val();
			var position = formWrapper.find("[name = 'pos']").val();
			var email = formWrapper.find("input[name = 'emailUser']").val();
			var phone = formWrapper.find("input[name = 'phoneUser']").val();
			$.get(appConfig.url + appConfig.api + 'ManagerEditUser?userId=' + userid +  '&name=' + userName + '&position=' + position + '&email=' + email + '&stwork=' + stwork +  '&phone=' + phone + '&isActive=' + isActive + '&age=' + age +  '&token=' + token, function (data) {
			});
			e.preventDefault();
			$('#myModalUser').find('form')[0].reset();
			$("#edit-user-form").data('formValidation').resetForm();
			$('#myModalUser').modal('toggle');

			var tr = $('#users-list tr.active-user');
			tr.find("td").eq(1).text(userName);
			tr.find("td").eq(2).text(position);
			tr.find("td").eq(3).text(email);
			tr.find("td").eq(4).text(stwork);
			tr.find("td").eq(5).text(phone);
			tr.find("td").eq(6).text(isActive);
			tr.find("td").eq(8).text(age);
			alert("User was edited");
		}
	});
}

function updateUser (){
	$("#update-user-form").formValidation({
    framework: 'bootstrap',
    fields: {
        passwordUser: {
            validators: {
                identical: {
                    field: 'confirmPassword',
                    message: 'The password and its confirm are not the same'
                }
            }
        },
        confirmPassword: {
            validators: {
                identical: {
                    field: 'passwordUser',
                    message: 'The password and its confirm are not the same'
                }
            }
        }
    }
}).on('submit', function(e, data) {
		if (e.isDefaultPrevented()) {
			// handle the invalid form...
		} else {
			var formWrapper = $("#update-user-form");
			var userName = formWrapper.find("input[name = 'username']").val();
			var passwordUser = formWrapper.find("input[name = 'passwordUser']").val();
			var age = formWrapper.find("input[name = 'ageUser']").val();
			var phone = formWrapper.find("input[name = 'phoneUser']").val();
			var pictureUser = formWrapper.find("input[name = 'pictureUser']").val();
			var userid = JSON.parse(sessionStorage.getItem('user')).userID;
			var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
	    hashObj.update(passwordUser);
			if(passwordUser != ''){
				var passwordUser = hashObj.getHash("HEX");
			}


			$.post(appConfig.url + appConfig.api + 'updateUser' , {  name : userName, age : age, phone : phone, password : passwordUser , picture : pictureUser, userId : userid, token : token }).done(function( data ) {


				if ( data.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						window.location.href = 'login.html';
					}
				}
			 });

				e.preventDefault();
				$('#myModalUpdateUser').find('form')[0].reset();
				$("#update-user-form").data('formValidation').resetForm();
				$('#myModalUpdateUser').modal('toggle');
		}
	});
}
