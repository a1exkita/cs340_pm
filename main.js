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


function getAllProject(res, context, complete, next) {
	mysql.pool.query('SELECT DISTINCT p.Name, p.ID FROM Projects p, Employees e, Departments d, Clients c, Projects_to_Employees pte WHERE c.ID = p.Client_id AND p.ID = pte.Project_id AND pte.Employee_id = e.ID AND e.Department_ID = d.ID ORDER BY p.ID ASC', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.all_project = rows;
		complete();
	});
}


function getAllSelectedProject(res, context, complete) {
	mysql.pool.query('SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, c.Name AS Client, d.Name AS Department, e.Name AS Employee, (SELECT e2.name FROM Employees e2 WHERE e2.ID = e.Manager_id) AS Manager FROM Projects p, Employees e, Departments d, Clients c, Projects_to_Employees pte WHERE c.ID = p.Client_id AND p.ID = pte.Project_id AND pte.Employee_id = e.ID AND e.Department_ID = d.ID ORDER BY p.ID ASC', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.selected_project = rows;
		complete();
	});
}


function getSelectedProject(res, context, id, complete, next){	
	var sql = "SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, c.Name AS Client, d.Name AS Department, e.Name AS Employee, (SELECT e2.name FROM Employees e2 WHERE e2.ID = e.Manager_id) AS Manager FROM Projects p, Employees e, Departments d, Clients c, Projects_to_Employees pte WHERE p.ID = ? AND c.ID = p.Client_id AND p.ID = pte.Project_id AND pte.Employee_id = e.ID AND e.Department_ID = d.ID ORDER BY p.ID ASC";
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


function getSelectedEmployee(res, context, employee, complete){	
	var sql = "SELECT ID, Name FROM Employees WHERE Name=?";
	var inserts = [employee];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.selected_employee = results;
		complete();
	});
}


function getNewEmployee(res, context, employee, id, complete, next){	
	var sql = "SELECT ID, Name FROM Employees WHERE Name!=? AND ID NOT IN (SELECT e.ID FROM Employees e, Projects p, Projects_to_Employees pte WHERE p.ID=? AND p.ID=pte.Project_id AND pte.Employee_id=e.ID)";
	var inserts = [employee, id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.new_employee = results;
		complete();
	});
}

function getSelectedDeleteProject(res, context, id, complete){	
	var sql = "SELECT ID, Name FROM Projects WHERE ID=?";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(err, results, fields) {
		if(err) {
			next(err);
                        return;
		}
		context.project = results;
		complete();
	});
}


function getEmployee(res, context, complete) {
	mysql.pool.query('SELECT ID, Name, Manager_id AS Manager, Department_id AS Department FROM Employees ORDER BY ID ASC;', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.employees = rows;
		complete();
	});
}


function getDepartment(res, context, complete) {
	mysql.pool.query('SELECT ID, Name FROM Departments ORDER BY ID ASC;', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.departments = rows;
		complete();
	});
}


app.get('/', function(req,res,next){
        callbackCount = 0;
	var context = {};
	getAllProject(res, context, complete, next);
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
		getSelectedProject(res, context, req.query.project_id, complete, next);
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


app.get('/update/:id/:employee',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getProject(res, context, req.params.id, complete);
	getClient(res, context, complete);
	context.selected_Employee = req.params.employee;
	function complete() {	
		callbackCount++;
		if(callbackCount >= 2){
			res.render('updateProject', context);
		}
	}
});


app.get('/delete/:id/:employee',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getSelectedDeleteProject(res, context, req.params.id, complete);
	getSelectedEmployee(res, context, req.params.employee, complete);
	function complete() {	
		callbackCount++;
		if(callbackCount >= 2){
			res.render('deleteEmployee', context);
		}
	}
});


app.get('/updateEmployee/:id/:employee',function(req,res,next){
	callbackCount = 0;
	var context = {};
	getProject(res, context, req.params.id, complete);
	getSelectedEmployee(res, context, req.params.employee, complete);
	getNewEmployee(res, context, req.params.employee, req.params.id, complete, next);
	function complete() {	
		callbackCount++;
		if(callbackCount >= 3){
			res.render('updateEmployee', context);
		}
	}
});


app.get('/displayTables', function(req,res,next){
	callbackCount = 0;
	var context = {};
	getEmployee(res, context, complete);
	getDepartment(res, context, complete);
	function complete() {	
		callbackCount++;
		if(callbackCount >= 2){
			res.render('displayTables', context);
		}
	}

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


app.put('/updateEmployeeQuery/:id', function(req,res, next){
	var sql = "UPDATE Projects_to_Employees pte SET pte.Employee_id=? WHERE pte.Project_id=? AND pte.Employee_id=?";
	var inserts = [req.body.new_employee_id, req.params.id, req.body.curr_employee_id];
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


app.put('/deleteEmployee/:id', function(req,res, next){
	var sql = "DELETE FROM Projects_to_Employees WHERE Project_id = ? AND Employee_id = ?";
	var inserts = [Number(req.body.employee_project), Number(req.body.employee_id)];
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
