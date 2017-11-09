window.appNameSpace = window.appNameSpace || {};
window.sessionInvalid = false;
var token = sessionStorage.getItem('token'),
    theUser = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function() {
    $('#users-list-table').dataTable({
        "paging": false
    });
    $('#users-list-table').find('.dataTables_paginate, .dataTables_length, .dataTables_info').hide();
});

if (theUser.admin >= 0) {

    var minWork;

    $(function() {
        $("a[name='addUser']").click(function() {
            $("#myModalUser").load("addUserForm.html", function() {
                prepareUserForm();
                if(navigator.userAgent.search("Chrome") >= 0){
                  $('#birth').datepicker({
                          dateFormat : 'mm/dd/yy'
                      });
                  $('#dateval').datepicker({
                          dateFormat : 'mm/dd/yy'
                  });
                }else{
                  $('#birth').datepicker({
                          dateFormat : 'mm/dd/yy'
                      });
                  $('#dateval').datepicker({
                          dateFormat : 'mm/dd/yy'
                      });
                }
            });
        });

        $("a[name='updateUser']").click(function() {
            $("#myModalUpdateUser").load("updateUserForm.html", function() {
                fillUpdateUserForm();
                updateUser();
            });
        });

        function fillUpdateUserForm() {
            var currentPicture = JSON.parse(sessionStorage.getItem('user')).picture;
            var currentName = JSON.parse(sessionStorage.getItem('user')).name;
            var currentAge = JSON.parse(sessionStorage.getItem('user')).age;
            var currentPhone = JSON.parse(sessionStorage.getItem('user')).phone;
            document.getElementById("username").value = currentName;
            document.getElementById("phoneUser").value = currentPhone;
        }

        var manager = new appNameSpace.Manager("userID", "password", "isActive", "picture", "age", "name", "position", "email", "phone", "startDate", "admin", "managerID");

        populateTable();
        managedUserTable();
        $("#approve-modal-btn-yes").click(function() {
            console.log('click');
            approveFreeDays();
            $("#approve-freedays-modal").modal('hide');

        });
        $("#approve-modal-btn-no").click(function() {
            $("#approve-freedays-modal").modal('hide');
        });
    });

    function displayApproveModal(elem, id, email, avFD, action) {
        var approveModal = $("#approve-freedays-modal");
        approveModal.modal('show');
        approveModal.attr("approveId", id);
        approveModal.attr("approve-action", action);
        $("#manager-table tr").removeClass("activeModal");
        $(elem).closest("tr").addClass("activeModal");
        $.get(appConfig.url + appConfig.api + 'updateAvFreeDays?email=' + email + '&avfreedays=' + avFD, function(data) {});
    };

    function approveFreeDays() {
        var tr = $("#manager-table tr.activeModal");
        var td = tr.find("td").eq(11);

        var id = $("#approve-freedays-modal").attr("approveId");
        var approved = parseInt($("#approve-freedays-modal").attr("approve-action"));

        var approvedText = (approved == 2) ? "Not Approved" : "Approved";
        var buttonClass = (approved == 2) ? "check" : "times";
        var buttonApprove = (approved == 2) ? 1 : 2;

        var days = parseInt(td.prev().prev().prev().prev().prev().html());
        var availableFD = parseInt(td.prev().prev().html());

        if (td.prev().html() == "Not Approved") {
            var avFD = availableFD + days;
        }
        if (td.prev().html() == "Approved") {
            var avFD = availableFD - days;
        }
        if (td.prev().html() == "Pending") {
            var avFD = availableFD;
        }

        var email = td.prev().prev().prev().prev().prev().prev().prev().prev().html();
        var params = '"' + email + '",' + avFD;

        if (approved == 1) {
            approve(id, approved, token, params, email);
         } else {
             approve(id, approved, token, params, email);
         }
    };

    function approve(id, approved, token, params, email) {
        $.get(appConfig.url + appConfig.api + 'ApproveFreeDays?id=' + id + '&approved=' + approved + '&token=' + token, function(data) {
            out(data.code);
            $("#manager-table").DataTable().clear();
            populateTable();
        });
    };

    function colorTableRow(approved) {
        if (approved == true) {
            return "info";
        } else {
            return "danger";
        }
    };

    function managerEditUser(elem, userId) {
        var tr = $(elem).closest("tr");
        $("#users-list tr").removeClass("active-user");
        tr.addClass("active-user");
        var userInfo = tr.find("td");

        $("#myModalUser").load("editUserForm.html", function() {
            prepareUserForm();

            var editUserForm = $("#edit-user-form");
            editUserForm.attr("user-id", userId);

            // Add user details into edit form.

            editUserForm.find("input[name='userId']").val(userId);
            var name = userInfo.eq(1).text();
            editUserForm.find("input[name='name']").val(name);

            var position = userInfo.eq(2).text();
            editUserForm.find("select[name='position']").val(position);

            var email = userInfo.eq(3).text();
            editUserForm.find("input[name='email']").val(email);

            var phone = userInfo.eq(5).text();
            editUserForm.find("input[name='phone']").val(phone);

            var manager = userInfo.eq(6).text();
            editUserForm.find("option[name='manager-name']").text(manager);

            if (userInfo.eq(7).text() == 'true') {
                $('[name=userActive]:first').attr('checked', true);
            }
            else {
                $('[name=userActive]:not(:first)').attr('checked', true);
            }


            var bonus = userInfo.eq(9).text();
            editUserForm.find("input[name='bonus']").val(bonus);

            if (position == "Manager") {
                $.get(appConfig.url + appConfig.api + 'getAllManagers?token=' + token, function(managers) {
                    out(managers.code);
                    for (var i in managers) {
                        if (managers[i].userID != userId) {
                            $('select[name="new_manager"]').append($("<option></option>")
                                .attr("value", managers[i].userID)
                                .text(managers[i].name));
                        };
                    }
                });
            } else {
                editUserForm.find("select[name='new_manager']").remove();
                editUserForm.find("label[for='new_manager']").remove();
            }
            var selectNewManager = editUserForm.find(".new_manager");

            if ($('input[name=userActive]:checked').attr('value') == '1')  {
                 selectNewManager.hide();
             }

            $('[name=userActive]').click(function() {
                if ($(this).attr('value') == '1') {
                    selectNewManager.hide();
                    editUserForm.find("input[name=isActive]").val('true');
                }
                else {
                    selectNewManager.css('display', 'block');
                    editUserForm.find("input[name=isActive]").val('false');
                }
            });


            var isAdmin = sessionStorage.getItem('admin');
            if (isAdmin == 2) {
                var selectChangeManager = editUserForm.find("select[name='change_manager']");
                $.get(appConfig.url + appConfig.api + 'getAllManagers?token=' + token, function(managers) {
                    out(managers.code);
                    for (var i in managers) {
                        if ((managers[i].userID != userId)  && (managers[i].name != manager)) {
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
//Add user form
    function prepareUserForm() {
        var date = new Date(), manager;
        date.setDate(date.getDate());
        $('#stwork').datepicker({
            endDate: date,
            format: 'yyyy/mm/dd'
        }).on('changeDate', function(e) {
            $('#add-user-form').formValidation('revalidateField', 'stwork');
        });

        // Add user form.
        $("input:checkbox").on('click', function() {
            var $box = $(this);
            if ($box.is(":checked")) {
                var group = "input:checkbox[name='" + $box.attr("name") + "']";
                $(group).prop("checked", false);
                $box.prop("checked", true);
            } else {
                $box.prop("checked", false);
            }
        });
        $("#old").change(function() {
            if ($(this).is(":checked")) {
                $("#avfree").show();
            } else {
                $("#avfree").hide();
            };
        });
        $("#new").change(function() {
            if ($(this).is(":checked")) {
                $("#avfree").hide();
            };
        });

        var selectNewManager = $("#add-user-form").find("select[name='new_manageradd']");
        var selectNewManagerLabel = $("#add-user-form").find("label[for='new_manageradd']");

        $.get(appConfig.url + appConfig.api + 'getAllManagers?token=' + token, function(managers) {
            out(managers.code);
            for (var i in managers) {
                selectNewManager.append($("<option></option>")
                    .attr("value", managers[i].userID)
                    .text(managers[i].name));
            }
        });


        if (theUser.admin != 2) {
            $("#add-user-form #forAdmin").css('display', 'none')
            manager = theUser.userID;
        }
        //Add user form
          $form = $('#add-user-form'); // cache
          // $form.find('#register').prop('disabled', true); // disable submit btn
          // $form.find('.form-control').on('keyup change',function() { // monitor all inputs for changes
          //   var disable = false;
          //   $form.find('.form-control').each(function() { // test all inputs for values
          //      if ($(this).val() != ''){
          //           disable = false; // disable submit if any of them are still blank
          //       }else {
          //         disable = true;
          //       }
          //   });
          //     $form.find('#register').prop('disabled', disable);
          // });
        var validAge = (moment().subtract(18, 'years')).format('YYYY-MM-DD').toString();
        var minStWork, currentDay = (moment().format('YYYY-MM-DD')).toString();

        $.get(appConfig.url + appConfig.api + 'getStartDate?token=' + token, function(data) {
            minStWork = moment(data[0].age).format('YYYY-MM-DD').toString();
        }).then(function () {
            $("#add-user-form").find('[name="pos"]').selectpicker().change(function(e) {
                // $('#add-user-form').formValidation('revalidateField', 'pos');
            }).end().bootstrapValidator({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    username: {
                        validators: {
                            notEmpty: {
                                message: 'This is required'
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'This is required'
                            },
                            regexp: {
                                regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                                message: 'The value is not a valid email address'
                            }
                        }
                    },
                    phoneUser: {
                        validators: {
                            phone: {
                                country: 'Ro',
                                message: 'The value is not valid, please input a correct phone number.'
                            }
                        }
                    },
                    pos: {
                    validators: {
                        notEmpty: {
                            message: 'Please select a position.'
                        }
                    }
                }
                    // ageUser: {
                    //     validators: {
                    //         notEmpty: {
                    //             message: 'The birthday is required'
                    //         },
                    //         date: {
                    //             format: 'YYYY-MM-DD',
                    //             message: 'The value is not a valid birth day',
                    //             max: validAge
                    //         }
                    //     }
                    // },
                    // stwork: {
                    //     validators: {
                    //         notEmpty: {
                    //             message: 'The started working is required'
                    //         },
                    //         date: {
                    //             format: 'YYYY-MM-DD',
                    //             message: 'The value is not a valid date',
                    //             min: minStWork,
                    //             max: currentDay
                    //         }
                    //     }
                    //
                    // }
                }
            // }).on('change', '[name="Ro"]', function(e) {
              //  $('#add-user-form').formValidation('revalidateField', 'phoneUser');
            }).on( 'status.field.bv', function( e, data ) {
              let $this = $( this );
              let formIsValid = true;
              if (!$this.find('input[name="username"]').parent().hasClass("has-success")) {
                formIsValid = false;
              }
              if (!$this.find('input[name="email"]').parent().hasClass("has-success")) {
                formIsValid = false;
              }
              if (!$this.find('input[name="phoneUser"]').parent().hasClass("has-success")) {
                formIsValid = false;
              }
              // if (!$this.find('input[name="pos"]').parent().hasClass("has-success")) {
              //   formIsValid = false;
              // }

              $( '#register', $this ).attr( 'disabled', !formIsValid );
          }).on('submit', function(e, data) {
                var birthday = "'" + moment($("#add-user-form").find("input[name = 'ageUser']").val()).format("YYYY-MM-DD") + "'",
                startWork = "'" +  moment($("#add-user-form").find("[name = 'stwork']").val()).format("YYYY-MM-DD") + "'", isOkAge = true, isOkSt = true;
                if (moment(birthday).isSameOrAfter("'" + validAge + "'")) {
                    isOkAge = false;
                }
                else {
                    isOkAge = true;
                }

                if (moment(startWork).isSameOrBefore("'" + minStWork + "'") || moment(startWork).isAfter("'" + currentDay + "'")) {
                    isOkSt = false;
                }
                else {
                    isOkSt = true;
                }

                if (e.isDefaultPrevented()) {

                } else if (isOkAge == true && isOkSt == true) {
                  $('#register').attr('disabled', 'disabled');
                  var formWrapper = $("#add-user-form");
                    if (theUser.admin != 2) {
                        manager = theUser.userID;
                    } else if ($("[name=new_manageradd] option").length > 0) {
                        manager = formWrapper.find("[name = new_manageradd]").val();
                    } else {
                        manager = 1;
                    }

                    var userName = formWrapper.find("input[name = 'username']").val();
                    var age = moment(formWrapper.find("input[name = 'ageUser']").val()).format("YYYY-MM-DD");
                    var position = formWrapper.find("[name = 'pos']").val();
                    var stwork = moment(formWrapper.find("[name = 'stwork']").val()).format("YYYY-MM-DD");
                    var email = formWrapper.find("input[name = 'email']").val();
                    var phone = formWrapper.find("input[name = 'phoneUser']").val();
                    var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();
                    var hashObj = new jsSHA("SHA-512", "TEXT", {
                        numRounds: 1
                    });
                    hashObj.update('avangarde');
                    var password = hashObj.getHash("HEX");
                    if (!avfreedays.length) {
                        avfreedays = Math.floor(21 / 12 * (11 - moment().month()));
                    }
                    if (theUser.admin != 0) {
                          $.post(appConfig.url + appConfig.api + 'addUser?token=' + token, {
                              email: email,
                              name: userName,
                              age: age,
                              password: password,
                              position: position,
                              phone: phone,
                              stwork: stwork,
                              avfreedays: avfreedays
                          }).done(function(data) {
                              if (data.errno == 1062) {
                                  alert ('An user with this email already exists.');
                                  $("[name=email]").val('');
                                  $('#add-user-form').formValidation('revalidateField', 'email');
                              }
                              else {
                                  var userid = JSON.parse(sessionStorage.getItem('user')).userID;
                                  $.post(appConfig.url + appConfig.api + 'modifyClass', {
                                      userID: data.insertId,
                                      managerID: manager,
                                      token: token
                                  }).done(function(data) {
                                      out(data.code);
                                  });
                                  var userstable = $('#users-list-table').DataTable();
                                  var j = userid;
                                  managedUserTable();
                                  $('.modal-body> div:first-child').css('display', 'block');
                                  $('#myModalUser').find('form')[0].reset();
                              }
                          });
                  };
                    e.preventDefault();
                }
                else {
                    e.preventDefault();
                    if (isOkSt) {
                        alert('Age is not valid.')
                    }
                    else if(isOkAge) {
                        alert("Started working is not valid.");
                    }
                    else {
                        alert("Age and started working are not valid.");
                    }

                }
            });
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
                name: {
                    validators: {
                        notEmpty: {
                            message: 'This is required'
                        }
                    }
                },
                stwork: {
                    validators: {
                        notEmpty: {
                            message: 'The start date is required'
                        }
                    }
                },
                position: {
                    validators: {
                        notEmpty: {
                            message: 'This required'
                        }
                    }
                },
                email: {
                    validators: {
                        regexp: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            message: 'The value is not a valid email address'
                        }
                    }
                },
                stwork: {
                    validators: {
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'The value is not a valid date'
                        }
                    }
                },
                phone: {
                    validators: {
                        phone: {
                            country: 'Ro',
                            message: 'The value is not a valid phone number'
                        }
                    }
                }
            }
        }).on('submit', function(e, data) {
            if (e.isDefaultPrevented()) {
                // handle the invalid form...
            } else {
                var formWrapper = $("form#edit-user-form").serialize();
                $.get(appConfig.url + appConfig.api + 'ManagerEditUserForm?' + formWrapper + '&token=' + token, function(data) {
                    out(data.code);
                    if (theUser.admin == 2) {
                        $("#users-list-table").DataTable().clear();
                        clearEmployee($("form#edit-user-form").serializeArray());
                        managedUserTable();
                    } else {
                        $("#users-list-table").DataTable().clear();
                        // clearEmployee($("form#edit-user-form").serializeArray());
                        managedUserTable();
                    }
                });
                e.preventDefault();
                $('.modal-body> div:first-child').css('display', 'block');
                $("#edit-user-form").data('formValidation').resetForm();
            }
        });
    }

    function clearEmployee(userData) {
        var userArray = {};
        for (var i = 0; i < userData.length; i++) {
            userArray[userData[i]['name']] = userData[i]['value'];
        }
        if (userArray['userActive'] == 0) {
            var newManager = userArray["new_manager"];
            if (newManager == null) {
                newManager = JSON.parse(sessionStorage.getItem('user')).userID;
            }
            $.ajax({
                     type: 'GET',
                     url: appConfig.url + appConfig.api + 'getAllActiveUsers?token=' + token,
                     success: function(users){
                       for(var i in users){
                            var params = '&managerId=' + newManager + "&userId=" + userArray['userId'] +  "&userID=" + users[i].userID;
                            if(newManager != users[i].userID){
                              $.ajax({
                                  type: 'POST',
                                  url: appConfig.url + appConfig.api + 'updateRelationsManagement?token=' + token + params,
                                  async:false
                                });
                            }else if(newManager == users[i].userID){
                              var params = '&managerId= Avangarde software' + "&userId=" + userArray['userId'] +  "&userID=" + users[i].userID;
                              $.ajax({
                                  type: 'POST',
                                  url: appConfig.url + appConfig.api + 'updateRelationsManagement?token=' + token + params,
                                  async:false
                                });
                            }
                     };
                   },
                     async:false
            });
        // Change manager.
        }else if (userArray['userActive'] == 1) {
              var changeManagerId = userArray["change_manager"];
              if (changeManagerId!=0) {
                  var params = '&managerId=' + changeManagerId + "&userId=" + userArray['userId'];
                  $.ajax({
                      type: 'POST',
                      url: appConfig.url + appConfig.api + 'updateUserManager?token=' + token + params,
                      async:false
                    });
              }
        };
    }

    function updateUser() {
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
                },
                phoneUser: {
                    validators: {
                        phone: {
                            country: 'Ro',
                            message: 'The value is not valid %s phone number'
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
                var phone = formWrapper.find("input[name = 'phoneUser']").val();
                var userid = JSON.parse(sessionStorage.getItem('user')).userID;
                var hashObj = new jsSHA("SHA-512", "TEXT", {
                    numRounds: 1
                });
                hashObj.update(passwordUser);
                if (passwordUser != '') {
                    var passwordUser = hashObj.getHash("HEX");
                }
                theUser.name = userName;
                theUser.phone = phone;
                sessionStorage.setItem('user', JSON.stringify(theUser));
                $.post(appConfig.url + appConfig.api + 'updateUser', {
                    name: userName,
                    phone: phone,
                    password: passwordUser,
                    userId: userid,
                    token: token
                }).done(function(data) {
                    out(data.code);
                });
                $('.update > div:first-child').css('display', 'block');
                e.preventDefault();
                $("#update-user-form").data('formValidation').resetForm();
            }
        });
    }

    $("[name=updateProfile]").click(function() {
        setTimeout(function() {
            location.reload();
        }, 1000);
    });

    function displayNewManager(elem) {
        if ($(elem).val() == '0') {
            $("#edit-user-form .new_manager").show();
        } else {
            $("#edit-user-form .new_manager").hide();
        }
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
    //Populate manager table (management)
    function populateTable() {
        var email, avfreedays;
        $.get(appConfig.url + appConfig.api + 'getManagerFreeDays?token=' + token, function(freeDays) {
            out(freeDays.code);
            var table = $('#manager-table').DataTable({
              "aoColumnDefs": [
                {
                   bSortable: false,
                   aTargets: [ -1 ]
                },
              ],
                        "columnDefs": [
                 { orderable: false, targets: -1 }
              ],
              "bDestroy": true
            });

            $('<input class="search" type="text" />')
              .insertBefore('#manager-table')
              .before('<label class="labsearch" for="search">Search by name: </label>')
              .on( 'keyup change', function () {
                  table
                  .column( 1 )
                  .search( this.value )
                  .draw();
            });

            var j = 1;
            for (i = 0; i < freeDays.length; i++) {
                var colorClass = colorTableRow(freeDays[i].approved);
                var freeDaysStatus = "";
                var approveButtons = "";
                switch (freeDays[i].approved) {
                    case 1:
                        freeDaysStatus = "Approved";
                        if (freeDays[i].type == 'Concediu') {
                            var avFD = freeDays[i].avfreedays + freeDays[i].days;
                        }
                        else {
                            var avFD = freeDays[i].avfreedays;
                        }
                        var params = '"' + freeDays[i].email + '",' + avFD;
                        approveButtons = "<span class='fa fa-times' onclick='displayApproveModal(this ," + freeDays[i].id + ", " + params + ", 2)' approved='1'></span>";
                        break;
                    case 2:
                        freeDaysStatus = "Not Approved";
                        if (freeDays[i].type == 'Concediu') {
                            var avFD = freeDays[i].avfreedays - freeDays[i].days;
                        }
                        else {
                            var avFD = freeDays[i].avfreedays;
                        }
                        var params = '"' + freeDays[i].email + '",' + avFD;
                        approveButtons = "<span class='fa fa-check' onclick='displayApproveModal(this ," + freeDays[i].id + ", " + params + ", 1)' approved='2'></span>";
                        break;
                    default:
                        freeDaysStatus = "Pending";
                        if (freeDays[i].type == 'Concediu') {
                            var avFD = freeDays[i].avfreedays - freeDays[i].days;
                        }
                        else {
                            var avFD = freeDays[i].avfreedays;
                        }
                        var params = '"' + freeDays[i].email + '",' + avFD;
                        approveButtons = "<span class='fa fa-check' onclick='displayApproveModal(this ," + freeDays[i].id + "," + params + ", 1)' approved='0'></span>";
                        approveButtons += "<span class='fa fa-times' onclick='displayApproveModal(this ," + freeDays[i].id + ", 0, 0, 2)' approved='0'></span>";
                        break;
                };
                table.row.add([
                        j,
                        freeDays[i].name,
                        freeDays[i].position,
                        freeDays[i].email,
                        moment(freeDays[i].startDate).format("DD/MM/Y"),
                        moment(freeDays[i].endDate).format("DD/MM/Y"),
                        freeDays[i].days,
                        freeDays[i].type,
                        freeDays[i].comment,
                        freeDays[i].avfreedays,
                        freeDaysStatus,
                        approveButtons
                    ]).draw(false)
                    .nodes()
                    .to$()
                    .addClass(colorClass);
                j++;
            }
        });
    }

    function managedUserTable() {
        if (sessionStorage.getItem('admin') == 2) {
            $("#users-list-table").DataTable().clear();
            getAllUsers();
        } else {
            $("#users-list-table").DataTable().clear();
            getManagerUsers();
        }
    };

    function getAllUsers() {
        $.when($.get(appConfig.url + appConfig.api + 'getManagerForUser?token=' + token, function(users) {
            out(users.code);
            arr = Array.prototype.slice.apply(users);
        })).done(function(arr) {
            $.get(appConfig.url + appConfig.api + 'getAllUsers?token=' + token, function(users) {
                out(users.code);
                var userstable = $('#users-list-table').DataTable();
                var k = 1, usersArray = [], active;
                var result = "Avangarde software";
                for (i = 0; i < users.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j].userID == users[i].userID) {
                            result = arr[j].name;
                        }
                    }

                    if (users[i].isActive == 0) {
                        var colorRow = 'warning';
                        active = 'false';
                    }
                    else {
                        var colorRow = '';
                        active = 'true';
                    }

                    userstable.row.add([
                        k,
                        users[i].name,
                        users[i].position,
                        users[i].email,
                        moment(users[i].startDate).format("MM/DD/YYYY"),
                        users[i].phone,
                        result,
                        active,
                        moment().diff(users[i].age, 'years', false),
                        users[i].bonus,
                        '<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
                        //"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
                    ]).draw(false)
                    .nodes()
                    .to$()
                    .addClass(colorRow);
                    k++;
                }
            });
        });
    }



    function getManagerUsers() {
        var userid = JSON.parse(sessionStorage.getItem('user')).userID;
        $.get(appConfig.url + appConfig.api + 'getManagerUsers?token=' + token + '&userId=' + userid, function(users) {
            out(users.code);
            var userstable = $('#users-list-table').DataTable({
              "aoColumnDefs": [
                {
                   bSortable: false,
                   aTargets: [ -1 ]
                }
              ],
                        "columnDefs": [
                 { orderable: false, targets: -1 }
              ],
              "bDestroy": true
            });

            $('<input class="search" type="text" />')
              .insertBefore('#users-list-table')
              .before('<label class="labsearch">Search by name: </label>')
              .on( 'keyup change', function () {
                  userstable
                  .column( 1 )
                  .search( this.value )
                  .draw();
            });

            var j = 1, active;
            for (i = 0; i < users.length; i++) {
                if (users[i].isActive == 0) {
                    var colorRow = 'warning';
                }
                else {
                    var colorRow = '';
                }
                if (users[i].isActive == 1) {
                    active = 'true';
                }
                else {
                    active = 'false'
                }
                userstable.row.add([
                    j,
                    users[i].name,
                    users[i].position,
                    users[i].email,
                    moment(users[i].startDate).format("DD/MM/Y"),
                    users[i].phone,
                    theUser.name,
                    active,
                    moment().diff(users[i].age, 'years', false),
                    users[i].bonus,
                    '<a class="btn btn-default fa fa-edit" href="#" data-toggle="modal" data-target="#myModalUser" name="editUser" onclick="managerEditUser(this ,' + users[i].userID + ')"></a>'
                    //"<span class='fa fa-edit' onclick='managerEditUser(this ," + users[i].userID + ")'></span>"
                ]).draw(false)
                .nodes()
                .to$()
                .addClass(colorRow);
                j++;
            }
        });
    }
}
