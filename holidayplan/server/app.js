var express = require("express");
var mysql = require('mysql');
var app = express();
var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');
var sha256 = require('js-sha256');
var Holidays = require('date-holidays');
var year = new Date().getFullYear();
var fileUpload = require('express-fileupload');
var moment = require('moment');
hd = new Holidays('RO');

// get all holidays for the year 2017
hd.getHolidays(year);
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'holidayPlanner',
    debug: false
});

function legalFreeHolidays(req, res) {
    hd = new Holidays('RO');
    hd.getHolidays(year);
    res.json(hd.getHolidays(year));
    return;
};

function legalHolidaysToDb(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        };

        hd = new Holidays('RO');
        hd.getHolidays(year);
        res.json(hd.getHolidays(year));

        for (var i in hd.getHolidays(year)) {
            if (hd.getHolidays(year)[i].type == 'public') {
                var date = moment(hd.getHolidays(year)[i].date).format('YYYY-MM-DD');
                connection.query("INSERT INTO legalholidays(startDate, name, type) VALUES ('" + date + "', '" +
                    hd.getHolidays(year)[i].name + "','" + hd.getHolidays(year)[i].type + "')",
                    function(err, rows) {});
            };
        };
    });
};

function setToken(token, id) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE user SET token = '" + token + "' WHERE userID = '" + id + "'", function(err, rows) {
            connection.release();
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function handle_database(req, res) {
    var params = req.body,
        response,
        result,
        hash = sha256.create();
    hash.update(Math.random().toString(36).substr(2, 5));
    var token = hash.hex();

    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT * FROM user WHERE email='" + params.email + "' AND password='" + params.password + "'", function(err, rows) {
            connection.release();
            if (rows != "") {
                if (!err) {
                    var user = rows[0];
                    if (user.token.length === 0) {
                        setToken(token, user.userID);
                        user.token = token
                    }
                    res.json(user);
                } else {
                    res.json({
                        "code": 100,
                        "status": "Error in connection database"
                    });
                    return;
                }
            } else {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}


function getFreeDaysApprover(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var token = req.query.token;
        connection.query("SELECT user.name, freedays.* FROM freedays JOIN user ON user.userID = freedays.approverID WHERE freedays.userID = (SELECT user.userID FROM user WHERE token = '" + token + "')", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};


function deleteHoliday(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var params = req.body;
        connection.query("DELETE FROM `freedays` WHERE `id` = " + params.id + "", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            } else {}
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getFreeDays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        connection.query("SELECT * FROM freedays WHERE userID=" + params.userID, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getFreeDaysApproved(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        connection.query("SELECT * FROM freedays WHERE approved!=2 AND userID=" + params.userID, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getLegalFreeDays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        connection.query("SELECT * FROM legalholidays ", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getManagerFreeDays(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var token = req.query.token;
        connection.query("SELECT  user.name, user.position, user.email, freedays.startDate, freedays.endDate, freedays.days, freedays.type, freedays.comment, user.avfreedays, freedays.approved, freedays.id FROM freedays JOIN management ON freedays.userID = management.userID AND management.managerID = (SELECT user.userID FROM user WHERE user.token='" + token + "') JOIN user ON user.userID=freedays.userID ORDER BY freedays.approved, freedays.startDate DESC ", function(err, rows) {
            connection.release();
            console.log(rows);
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getManagerUsers(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var params = req.query;
        var id = params.userId;
        connection.query("SELECT * FROM user JOIN management ON management.userID = user.userID AND management.managerID = " + id + " ORDER BY user.isActive DESC", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function ApproveFreeDays(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var params = req.query;
        connection.query("UPDATE freedays SET approved = " + params.approved + " WHERE id=" + params.id + "", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function ManagerEditUserForm(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var params = req.query;
        if (params.position == 'Manager') {
            var queryStr = "UPDATE user SET name='" + params.name + "', position='" + params.position + "', email='" + params.email + "',admin='1', phone='" + params.phone + "', isActive='" + params.userActive + "', bonus='" + params.bonus + "', avfreedays=avfreedays + '" + params.bonus
            + "' WHERE user.userID=" + params.userId
        } else {
            var queryStr = "UPDATE user SET name='" + params.name + "', position='" + params.position + "', email='" + params.email + "',admin='0', phone='" + params.phone + "', isActive='" + params.userActive + "', bonus='" + params.bonus + "', avfreedays=avfreedays + '" + params.bonus
            + "' WHERE user.userID=" + params.userId
        }
        connection.query(queryStr, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function updateAllHolidays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE legalholidays SET startDate='" + params.startDate + "', name='" + params.name + "', type='" + params.type + "' WHERE id=" + params.id, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function updateUser(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        var params = req.body;
        if (params.password == '') {
            var queryStr = "UPDATE user SET name ='" + params.name + "', picture = '" + params.picture + "', phone = '" + params.phone + "' WHERE userID=  " + params.userId;
        } else {
            var queryStr = "UPDATE user SET name ='" + params.name + "', password = '" + params.password + "', picture = '" + params.picture + "', phone = '" + params.phone + "' WHERE userID=  " + params.userId;
        }
        connection.query(queryStr, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            } else console.log(err);
        });

        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    })
}

function getManagerDetails(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var managerId = req.body.managerId;
        connection.query("SELECT * FROM user WHERE userID = " + managerId, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function upload(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var sampleFile = req.files.profileImage.data.toString("base64");

        connection.query("UPDATE user SET picture ='" + sampleFile + "' WHERE userID = " + params.id, function(err, rows) {
            connection.release();

            if (!err) {
                res.json(sampleFile);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getManagerName(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT * FROM user WHERE userID IN ( SELECT  managerID FROM management WHERE userID = " + params.id + ")", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getManagersName(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT * FROM user WHERE userID IN ( SELECT  managerID FROM management)", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}



function handle_dateupdate(req, res) {
    var params = req.query, duration;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var q = "INSERT INTO freedays (startDate, endDate, days, approved, userID, approverID,type, comment) VALUES ( '" + params.stdate + "', '" + params.enddate + "', '" + params.days + "', '0', '" + params.userID + "' , '" + params.approverID + "' , '" + params.vacationtype + "' , '" + params.comment + "')";
        connection.query(q, function(err, rows) {
            connection.release();
            if (err) {
                throw err;
            }
            res.json(rows[0]);
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function logout(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE user SET token = '' WHERE email ='" + params.email + "'", function(err, rows) {
            connection.release();
            if (!err) {

                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function addUser(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        if (params.position == 'Manager') {
            var columns = "'" + params.email + "', '" + params.password + "', '" + params.age + "', '" + params.name + "', '" + params.position + "', '" +
                params.phone + "', '" + params.stwork + "', '" + 1 + "','" + params.avfreedays + "'";
        } else {
            var columns = "'" + params.email + "', '" + params.password + "', '" + params.age + "', '" + params.name + "', '" + params.position + "', '" +
                params.phone + "', '" + params.stwork + "', '" + 0 + "','" + params.avfreedays + "'";
        }
        connection.query("INSERT INTO user (email, password, age, name, position, phone, startDate, admin, avfreedays) VALUES (" + columns + ")", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
            else {
                res.json(err);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getAllUsers(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var managerId = req.body.managerId;
        connection.query("SELECT * FROM user WHERE token != '" + params.token + "' ORDER BY user.isActive DESC", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getAllHolidays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT * FROM legalholidays ", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};


function isValidToken(token) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                return reject({
                    msg: 'connection error'
                });
            }
            connection.query("SELECT * FROM user WHERE token ='" + token + "'", function(err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length > 0) {
                        return resolve(rows);
                    } else {
                        return reject({
                            msg: 'nu exista token'
                        });
                    }
                }
            });
            connection.on('error', function(err) {
                return reject({
                    msg: 'connection error'
                });
            });
        });
    });
}

function modifyClass(req, res) {
    var params = req.body;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("INSERT INTO management VALUES (" + params.userID + ", " + params.managerID + ")", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function updateRelationsFreedays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE freedays SET approverID = '" + params.managerId + "' WHERE approverId = '" + params.userId + "';", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function updateRelationsManagement(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE management SET managerID = '" + params.managerId + "' WHERE managerID = '" + params.userId + "' AND userID='"+ params.userID +"';", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function updateUserManager(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE management SET managerID = '" + params.managerId + "' WHERE userID = '" + params.userId + "';", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function updateFreeDays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE user SET avfreedays = '" + params.avfreedays + "' WHERE email = '" + params.email + "';", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function updateAllFreeDays(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("UPDATE  user SET avfreedays = avfreedays + " + params.avfreedays, function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getLastYear(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("INSERT INTO yearset (year) VALUES ('" + params.year + "')", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function selectLastYear(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT * FROM yearset ORDER BY year DESC LIMIT 1 ", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getNewHoliday(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        connection.query("INSERT INTO legalholidays (startDate, name) VALUES ('" + params.startDate + "', '" + params.name + "')", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getAllManagers(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var managerId = req.body.managerId;
        connection.query("SELECT * FROM user WHERE position = 'Manager' AND isActive = 1", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};
function getAllActiveUsers(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        var managerId = req.body.managerId;
        connection.query("SELECT * FROM user WHERE isActive = 1", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
};

function getManagerForUser(req, res) {
    var params = req.query;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT management.userID, management.managerID, user.name FROM user INNER JOIN management ON management.managerID = user.userID", function(err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}

function getStartDate (req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query("SELECT user.age FROM user WHERE admin = 2", function(err, rows) {
            connection.release();
            console.log(rows);
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        });
    });
}



app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', "Content-Type");
    next();
});

//Creating Router() object

var router = express.Router();

// Router middleware, mentioned it before defining routes.

router.use(function(req, res, next) {
    console.log("/" + req.method);
    next();
});

// Provide all routes here, this is for Home page.
router.get("/legalFreeHolidays", function(req, res) {
    legalFreeHolidays(req, res);
});

router.get("/legalHolidaysToDb", function(req, res) {
    legalHolidaysToDb(req, res);
});

router.post("/login", function(req, res) {
    handle_database(req, res);
});

router.post("/logout", function(req, res) {
    logout(req, res);
});

router.get("/updatedate", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        handle_dateupdate(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getLegalFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getLegalFreeDays(req, res);
    }, function(error) {
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getFreeDaysApprover", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getFreeDaysApprover(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getFreeDays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getFreeDaysApproved", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getFreeDaysApproved(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post('/upload', function(req, res) {
    var token = req.query.token;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    upload(req, res);
    let sampleFile = req.files.profileImage.data;
    // Use the mv() method to place the file somewhere on your server
});

router.post("/", function(req, res) {
    getManagerName(req, res);
});

router.get("/getManagerFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getManagerFreeDays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getManagerUsers", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getManagerUsers(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/getManagerDetails", function(req, res) {
    getManagerDetails(req, res);
});

router.post("/updateUser", function(req, res) {
    var token = req.body.token;
    isValidToken(token).then(function(result) {
        updateUser(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/ApproveFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        ApproveFreeDays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/ManagerEditUserForm", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        ManagerEditUserForm(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getAllManagers", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getAllManagers(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});
router.get("/getAllActiveUsers", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getAllActiveUsers(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});
router.get("/getAllUsers", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getAllUsers(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getAllHolidays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getAllHolidays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/updateAllHolidays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateAllHolidays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/addUser", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        addUser(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/modifyClass", function(req, res) {
    var token = req.body.token;
    isValidToken(token).then(function(result) {
        modifyClass(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/updateRelationsFreedays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateRelationsFreedays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/updateRelationsManagement", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateRelationsManagement(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.post("/updateUserManager", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateUserManager(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});


router.post("/deleteHoliday", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        deleteHoliday(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/updateFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateFreeDays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/updateAllFreeDays", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        updateAllFreeDays(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/selectLastYear", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        selectLastYear(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getLastYear", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getLastYear(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getNewHoliday", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getNewHoliday(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/updateAvFreeDays", function (req, res) {
    updateFreeDays(req, res);
});

router.get("/getStartDate", function (req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getStartDate(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

router.get("/getManagerForUser", function(req, res) {
    var token = req.query.token;
    isValidToken(token).then(function(result) {
        getManagerForUser(req, res);
    }, function(error) {
        console.log(error);
        res.json({
            "code": 110,
            "status": "Your session has expired and you are loged out. - redirect la login in FE"
        })
    });
});

app.use("/api", router);

// Listen to this Port

app.listen(4000, function() {
    console.log("Live at Port 4000");
});
