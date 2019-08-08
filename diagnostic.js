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


app.get('/', function(req,res,next){
        var context = {};
	mysql.pool.query('SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget, C.Name AS Client, D.Name AS Departments, P.Name AS Programmers FROM Projects p, Programmers P, Departments D, Clients C, Projects_to_Programmers ptp, Projects_to_Departments ptd WHERE C.ID = p.Client_id AND p.ID = ptp.Project_id AND ptp.Programmer_id = P.ID AND p.ID = ptd.Project_id AND ptd.Department_id = D.ID ORDER BY p.ID ASC;', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.project = rows;
		res.render('index', context);
	});
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

app.get('/updateDepartment',function(req,res,next){
    res.render('updateDepartment');
});
app.get('/addProgrammer',function(req,res,next){
    res.render('addProgrammer');
});
app.get('/updateProgrammer',function(req,res,next){
    res.render('updateProgrammer');
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
                res.render('addDepartment', context);
        });
});


app.post('/insert',function(req,res){
//        var mysql = req.app.get('mysql');
        var values = [req.body.name, req.body.startDate, req.body.endDate, req.body.budget, req.body.clientId];
        var sql = "INSERT INTO Projects (Name, Start_date, Anticipated_end_date, Budget, Client_id) VALUES (?,?,?,?,?)";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
                // res.redirect('/addDepartment');
        });
});


app.post('/addDepartment',function(req,res){
//        var mysql = req.app.get('mysql');
        var values = [req.body.selectProject, req.body.addDepartment];
        var sql = "INSERT INTO Projects_to_Departments (Project_id, Department_id) VALUES";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
                // res.redirect('/addDepartment');
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
