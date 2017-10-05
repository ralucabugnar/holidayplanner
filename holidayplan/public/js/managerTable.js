window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;
var token = sessionStorage.getItem('token');

$(function () {
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
				$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
       });
				window.location.href = 'login.html';
			}
		}
		var table = $('#manager-table').DataTable();
		var j = 1;
		for ( i=0; i < freeDays.length; i++ ){
			var colorClass = colorTableRow(freeDays[i].approved);
			var freeDaysStatus = "";
			var approveButtons = "";
			switch (freeDays[i].approved) {
				case 1:
					freeDaysStatus = "Approved";
					approveButtons = "<span class='fa fa-times' onclick='displayApproveModal(this ," + freeDays[i].id + ", 2)' approved='1'></span>";
				break;
				case 2:
					freeDaysStatus = "Not Approved";
					approveButtons = "<span class='fa fa-check' onclick='displayApproveModal(this ," + freeDays[i].id + ", 1)' approved='2'></span>";
				break;
				default:
					freeDaysStatus = "Pending";
					approveButtons = "<span class='fa fa-check' onclick='displayApproveModal(this ," + freeDays[i].id + ", 1)' approved='0'></span>";
					approveButtons += "<span class='fa fa-times' onclick='displayApproveModal(this ," + freeDays[i].id + ", 2)' approved='0'></span>";
				break;
			};
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
				freeDaysStatus,
				approveButtons
			] ).draw( false )
			.nodes()
			.to$()
			.addClass( colorClass );
			j++;
		}
     });

	 // Managed Users Table
		 if (theUser.admin == 2) {
			$.get(appConfig.url + appConfig.api + 'getAllUsers?token='+token, function (users) {
				if ( users.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
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
						users[i].bonus,
						'<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
						//"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
					] ).draw( false );
					j++;
				}
			});
		}
		else {
			var userid = JSON.parse(sessionStorage.getItem('user')).userID;
			 $.get(appConfig.url + appConfig.api + 'getManagerUsers?token=' + token + '&userId=' + userid , function (users) {
				if ( users.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
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
						users[i].bonus,
						'<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
						//"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
					] ).draw( false );
					j++;
				}
		    });
		}

	$("#approve-modal-btn-yes").click(function(){
		approveFreeDays();
		$("#approve-freedays-modal").modal('hide');
	});
	$("#approve-modal-btn-no").click(function(){
		$("#approve-freedays-modal").modal('hide');
	});
});

function displayApproveModal(elem, id, action){
	var approveModal =  $("#approve-freedays-modal");
	approveModal.modal('show');
	approveModal.attr("approveId", id);
	approveModal.attr("approve-action", action);
	$("#manager-table tr").removeClass("activeModal");
	$(elem).closest("tr").addClass("activeModal");
};

function approveFreeDays() {
	var tr = $("#manager-table tr.activeModal");
	var td = tr.find("td").eq(10);
	var id = $("#approve-freedays-modal").attr("approveId");
	var approved = parseInt($("#approve-freedays-modal").attr("approve-action"));
	var approvedText = (approved == 2) ? "Not Approved" : "Approved";
	var buttonClass = (approved == 2) ? "check" : "times";
	var buttonApprove = (approved == 2) ? 1 : 2;

	$.get(appConfig.url + appConfig.api + 'ApproveFreeDays?id=' + id + '&approved=' + approved + '&token=' + token, function (data) {
		if ( data.code == 110 ){
			if (!appConfig.sessionInvalid) {
				appConfig.sessionInvalid = true;
				alert('Session expired');
				$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
				});
				window.location.href = 'login.html';
			}
		}
		var parentRow = $(td).closest("tr");
		if (approved == 1) {
			parentRow.removeClass("danger").addClass("info");
		} else {
			parentRow.removeClass("info").addClass("danger");
		}
		td.prev().text(approvedText);
		td.html("<span class='fa fa-" + buttonClass + "' onclick='displayApproveModal(this ," + id + ", " + buttonApprove + ")' approved='" + approved + "'></span>");
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

		// Add user details into edit form.
		var name = userInfo.eq(1).text();
		editUserForm.find("input[name='username']").val(name);

		var position = userInfo.eq(2).text();
		editUserForm.find("select[name='pos']").val(position);

		var email = userInfo.eq(3).text();
		editUserForm.find("input[name='emailUser']").val(email);

		var stdate = userInfo.eq(4).text();
		editUserForm.find("input[name='stwork']").val(moment(stdate).format("YYYY/MM/DD"));

		var phone = userInfo.eq(5).text();
		editUserForm.find("input[name='phoneUser']").val(phone);

		var active = userInfo.eq(6).text();
		editUserForm.find("input[name='active']").val(active);

		var age = userInfo.eq(8).text();
		editUserForm.find("input[name='ageUser']").val(age);

		var bonus = userInfo.eq(9).text();
		editUserForm.find("input[name='bonusUser']").val(bonus);

		var selectNewManager = editUserForm.find("select[name='new_manager']");
		var selectNewManagerLabel = editUserForm.find("label[for='new_manager']");
		if (active != '0') {
			selectNewManager.hide();
			selectNewManagerLabel.hide();
		}

		if (position == "Manager") {
			$.get(appConfig.url + appConfig.api + 'getAllManagers?token=' + token, function (managers) {
				if ( managers.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
						window.location.href = 'login.html';
					};
				};
				for (var i in managers){
					if (managers[i].userID != userId) {
						selectNewManager.append($("<option></option>")
							.attr("value", managers[i].userID)
							.text(managers[i].name));
					}
				}
			});
		} else {
			editUserForm.find("select[name='new_manager']").remove();
			editUserForm.find("label[for='new_manager']").remove();
		}
		var isAdmin = sessionStorage.getItem('admin');
		if (isAdmin == 2) {
			console.log('here');
			var selectChangeManager = editUserForm.find("select[name='change_manager']");
			$.get(appConfig.url + appConfig.api + 'getAllManagers?token=' + token, function (managers) {
				if ( managers.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
						window.location.href = 'login.html';
					};
				};
				for (var i in managers){
					if (managers[i].userID != userId) {
						selectChangeManager.append($("<option></option>")
							.attr("value", managers[i].userID)
							.text(managers[i].name));
					}
				}
			});
		} else {
			editUserForm.find("select[name='change_manager']").remove();
			editUserForm.find("label[for='change_manager']").remove();
		}
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
					if ( data.code == 110 ){
						if (!appConfig.sessionInvalid) {
							appConfig.sessionInvalid = true;
							alert('Session expired');
							$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
							});
							window.location.href = 'login.html';
						}
					}
				});
				$('.modal-body> div:first-child').css('display','block');
				$('#myModalUser').find('form')[0].reset();
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
			var bonus = formWrapper.find("input[name = 'bonusUser']").val();

			$.get(appConfig.url + appConfig.api + 'ManagerEditUser?userId=' + userid +  '&name=' + userName + '&position=' + position + '&email=' + email + '&stwork=' + stwork +  '&phone=' + phone + '&isActive=' + isActive + '&age=' + age + '&bonus=' + bonus + '&token=' + token , function (data) {
				if ( data.code == 110 ){
					if (!appConfig.sessionInvalid) {
						appConfig.sessionInvalid = true;
						alert('Session expired');
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
						window.location.href = 'login.html';
					}
				}
				else {
					var tr = $('#users-list tr.active-user');
					tr.find("td").eq(1).text(userName);
					tr.find("td").eq(2).text(position);
					tr.find("td").eq(3).text(email);
					tr.find("td").eq(4).text(stwork);
					tr.find("td").eq(5).text(phone);
					tr.find("td").eq(6).text(isActive);
					tr.find("td").eq(8).text(age);
					tr.find("td").eq(9).text(bonus);
					$('.modal-body> div:first-child').css('display','block');
					$('.modal-body> div:nth-child(2)').css('display','none');
				}

				if (isActive  == 0){
					var newManager = formWrapper.find("select[name = 'new_manager']").val();
					if (newManager == null) {
						newManager = JSON.parse(sessionStorage.getItem('user')).userID;
					}

					$.post(appConfig.url + appConfig.api+ 'updateRelationsFreedays', { managerId: newManager, deletedUserId: userid, token : token}).done(function( updateInfo ) {
						if ( data.code == 110 ){
							if (!appConfig.sessionInvalid) {
								appConfig.sessionInvalid = true;
								alert('Session expired');
								$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
								});
								window.location.href = 'login.html';
							}
						}
					});

					$.post(appConfig.url + appConfig.api+ 'updateRelationsManagement', { managerId: newManager, deletedUserId: userid, token : token}).done(function( updateInfo ) {
						if ( data.code == 110 ){
							if (!appConfig.sessionInvalid) {
								appConfig.sessionInvalid = true;
								alert('Session expired');
								$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
								});
								window.location.href = 'login.html';
							}
						}
					});
				}

				// Change manager.
				var changeManagerId = formWrapper.find("select[name = 'change_manager']").val();
				if (changeManagerId) {
					$.post(appConfig.url + appConfig.api+ 'updateUserManager', { managerId: changeManagerId, userId: userid, token : token}).done(function( updateInfo ) {
						if ( data.code == 110 ){
							if (!appConfig.sessionInvalid) {
								appConfig.sessionInvalid = true;
								alert('Session expired');
								$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
								});
								window.location.href = 'login.html';
							}
						}
					});
				}

			});
			e.preventDefault();
			$("#eventForm").data('formValidation').resetForm();
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
			var bonus = formWrapper.find("input[name = 'bonusUser']").val();
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
						$.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
						});
						window.location.href = 'login.html';
					}
				}
			});
			$('.modal-body> div:first-child').css('display','block');
				e.preventDefault();
		}
	});
}

function displayNewManager(elem){
	if ($(elem).val() == '0') {
		$("#edit-user-form select[name='new_manager']").show();
		$("#edit-user-form label[for='new_manager']").show();
	} else {
		$("#edit-user-form select[name='new_manager']").hide();
		$("#edit-user-form label[for='new_manager']").hide();
	}
}
