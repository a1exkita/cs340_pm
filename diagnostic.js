var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use('/public', express.static('public'));


function getProject(res, context, id, complete){
	var sql = "SELECT ID, Name, Start_date, Anticipated_end_date, Budget, Client_id FROM Projects WHERE ID = ?";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.project = results[0];
		complete();
	});
}


function getClient(res, context, complete) {
	mysql.pool.query("SELECT ID, Name FROM Clients", function(err, results, fields) {
		if(err){
			next(err);
                        return;
		}
		context.client = results;
		complete();
	});
}


function getOldDepartment(res, context, id, complete){
	var sql = "SELECT ID, Name FROM Departments D, Projects_to_Departments ptd WHERE ? = ptd.Project_id AND ptd.Department_id = D.ID";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.old_department = results;
		complete();
	});
}


function getNewDepartment(res, context, complete){
	mysql.pool.query('SELECT ID, Name FROM Departments D', function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.new_department = results;
		complete();
	});
}


function getOldProgrammer(res, context, id, complete){
	var sql = "SELECT ID, Name FROM Programmers P, Projects_to_Programmers ptp WHERE ? = ptp.Project_id AND ptp.Programmer_id = P.ID";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.old_programmer = results;
		complete();
	});
}


function getNewProgrammer(res, context, complete){
	mysql.pool.query('SELECT ID, Name FROM Programmers P', function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.new_programmer = results;
		complete();
	});
}


function getAllProject(res, context, complete) {
	mysql.pool.query('SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, c.Name AS Client, d.Name AS Department, e.Name AS Employee, (SELECT e2.name FROM Employees e2 WHERE e2.ID = e.Manager_id) AS Manager FROM Projects p, Employees e, Departments d, Clients c, Projects_to_Employeess pte WHERE C.ID = p.Client_id AND p.ID = pte.Project_id AND pte.Employee_id = e.ID AND e.Department_ID = d.ID ORDER BY p.ID ASC', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.all_project = rows;
		complete();
	});
}


function getAllSelectedProject(res, context, complete) {
	mysql.pool.query('SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, C.Name AS Client, D.Name AS Departments, P.Name AS Programmers FROM Projects p, Programmers P, Departments D, Clients C, Projects_to_Programmers ptp, Projects_to_Departments ptd WHERE C.ID = p.Client_id AND p.ID = ptp.Project_id AND ptp.Programmer_id = P.ID AND p.ID = ptd.Project_id AND ptd.Department_id = D.ID ORDER BY p.ID ASC', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.selected_project = rows;
		complete();
	});
}


function getSelectedProject(res, context, id, complete){
	var sql = "SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, C.Name AS Client, D.Name AS Departments, P.Name AS Programmers FROM Projects p, Programmers P, Departments D, Clients C, Projects_to_Programmers ptp, Projects_to_Departments ptd WHERE C.ID = p.Client_id AND p.ID = ? AND p.ID = ptp.Project_id AND ptp.Programmer_id = P.ID AND p.ID = ptd.Project_id AND ptd.Department_id = D.ID ORDER BY p.ID ASC";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.selected_project = results;
		complete();
	});
}


app.get('/', function(req,res,next){
        callbackCount = 0;
	var context = {};
	getAllProject(res, context, complete);
	getAllSelectedProject(res, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 2){
			res.render('index', context);
		}
	}
});

app.get('/filter', function(req,res,next){
	callbackCount = 0;
	var context = {};
	getAllProject(res, context, complete);
	if (req.query.project_id != 0) {
		getSelectedProject(res, context, req.query.project_id, complete);
	}
	else {
		getAllSelectedProject(res, context, complete);
	}
	function complete() {
		callbackCount++;
		if(callbackCount >= 2){
			res.render('index', context);
		}
	}

});

app.get('/insert',function(req,res,next){
    res.render('insert');
});


app.get('/update/:id',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getProject(res, context, req.params.id, complete);
	getClient(res, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 2){
			res.render('updateProject', context);
		}
	}
});

app.get('/updateDepartment/:id',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getProject(res, context, req.params.id, complete);
	getOldDepartment(res, context, req.params.id, complete);
	getNewDepartment(res, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 3){
			res.render('updateDepartment', context);
		}
	}
});


app.get('/updateProgrammer/:id',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getProject(res, context, req.params.id, complete);
	getOldDepartment(res, context, req.params.id, complete);
	getOldProgrammer(res, context, req.params.id, complete);
	getNewProgrammer(res, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 4){
			res.render('updateProgrammer', context);
		}
	}
});


app.post('/', function(req, res, next){
	var sql = "INSERT INTO Projects (Name, Start_date, Anticipated_end_date, Budget, Client_id) VALUES (?,?,?,?,(SELECT C.ID FROM Clients C WHERE C.Name = ?))";
	var inserts = [req.body.pname, req.body.pstart, req.body.pend, req.body.pbudget, req.body.client_id];
	sql = mysql.pool.query(sql, inserts, function(err, results, fields){
		if(err){
			next(err);
                        return;
		}else{
			res.redirect('index');
		}
	});
});


app.put('/index/:id', function(req,res, next){
	var sql = "UPDATE Projects SET Name=?, Start_date=?, Anticipated_end_date=?, Budget=?, Client_id=? WHERE ID=?";
	var inserts = [req.body.pname, req.body.pstart, req.body.pend, req.body.pbudget, req.body.client_id, req.params.id];
	sql = mysql.pool.query(sql, inserts, function(err, results, fields){
		if(err) {
			next(err);
			return;
		}else{
			res.status(200);
			res.end();
		}
	});
});


app.put('/updateDepartment/:id', function(req,res, next){
	var sql = "UPDATE Projects_to_Departments SET Department_id=? WHERE Project_id=? AND Department_id=?";
	var inserts = [req.body.new_department_id, req.params.id, req.body.old_department_id];
	sql = mysql.pool.query(sql, inserts, function(err, results, fields){
		if(err) {
			next(err);
			return;
		}else{
			res.status(200);
			res.end();
		}
	});
});

app.put('/updateProgrammer/:id', function(req,res, next){
	console.log(req.body);
	var sql = "UPDATE Projects_to_Programmers ptp SET ptp.Programmer_id=? WHERE Project_id=? AND Programmer_id=?";
	var inserts = [req.body.new_programmer_id, req.params.id, req.body.old_programmer_id];
	sql = mysql.pool.query(sql, inserts, function(err, results, fields){
		if(err) {
			next(err);
			return;
		}else{
			res.status(200);
			res.end();
		}
	});
});


app.get('/addProgrammer',function(req,res,next){
        var context = {};
        var sql = "SELECT p.Name FROM Projects p";
        sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.projects = results;
        });
        var sql2 = "SELECT prog.Name FROM Programmers prog";
        sql2 = mysql.pool.query(sql2, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.programmers = results;
                res.render('addProgrammer', context);
        });
});

app.get('/addDepartment',function(req,res,next){
        var context = {};
        var sql = "SELECT p.Name FROM Projects p";
        sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.projects = results;
        });
        var sql2 = "SELECT d.Name FROM Departments d";
        sql2 = mysql.pool.query(sql2, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.departments = results;
                res.render('addDepartment', context);
        });
});


app.post('/insert',function(req,res){
        var values = [req.body.name, req.body.startDate, req.body.endDate, req.body.budget, req.body.clientId];
        var sql = "INSERT INTO Projects (Name, Start_date, Anticipated_end_date, Budget, Client_id) VALUES (?,?,?,?,?)";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
        });
});

app.post('/addDepartment',function(req,res){
        var val = req.body.selectProject;
	var val2 = req.body.addDepartment;
        var sql = "INSERT INTO Projects_to_Departments (Project_id, Department_id) VALUES((SELECT p.ID FROM Projects p WHERE p.Name = ?),(SELECT d.ID FROM Departments d WHERE d.Name = ?))";
        sql = mysql.pool.query(sql, [val, val2], function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
                res.redirect('/addProgrammer');
        });
});

app.post('/addProgrammer',function(req,res){
        var val = req.body.selectProject;
        var val2 = req.body.addProgrammer;
        var sql = "INSERT INTO Projects_to_Programmers (Project_id, Programmer_id) VALUES((SELECT p.ID FROM Projects p WHERE p.Name = ?),(SELECT prog.ID FROM Programmers prog WHERE prog.Name = ?))";
        sql = mysql.pool.query(sql, [val, val2], function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
                res.redirect('/');
        });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
