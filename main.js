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

// want to ignore this.
function getAllProject(res, context, complete) {
	mysql.pool.query('SELECT p.ID, p.Name, p.Start_date, p.Anticipated_end_date, p.Budget FROM Projects p ORDER BY p.ID ASC', function(err, rows, fields){
                if(err){
                        next(err);
                        return;
                }
		context.all_project = rows;
		complete();
	});
}

// want to ignore this.
app.get('/', function(req,res,next){
        callbackCount = 0;
	var context = {};
	getAllProject(res, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 1){
			res.render('index', context);
		}
	}
});

app.get('/insert',function(req,res,next){
	var context = {};
        var sql = "SELECT c.Name FROM Clients c";
        sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.clients = results;
    	    res.render('insert', context);
        });
});

app.post('/insert',function(req,res){
        var values = [req.body.name, req.body.startDate, req.body.endDate, req.body.budget, req.body.clientName];
        var sql = "INSERT INTO Projects (Name, Start_date, Anticipated_end_date, Budget, Client_id) VALUES (?,?,?,?,(SELECT c.ID FROM Clients c WHERE c.Name = ?))";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
        });
});

app.get('/addEmployee/:name',function(req,res,next){
        var context = {};
        context.projects = [{ Name: req.params.name}];
        var sql2 = "SELECT e.Name FROM Employees e";
        sql2 = mysql.pool.query(sql2, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON.stringify(error));
                        res.end();
                }
                context.employees = results;
                res.render('addEmployee', context);
        });
});

app.post('/addEmployee',function(req,res){
        var val = req.body.selectProject;
	var val2 = req.body.addEmployee;
        var sql = "INSERT INTO Projects_to_Employees (Project_id, Employee_id) VALUES((SELECT p.ID FROM Projects p WHERE p.Name = ?),(SELECT e.ID FROM Employees e WHERE e.Name = ?))";
        sql = mysql.pool.query(sql, [val, val2], function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
        });
});

app.get('/insertClient',function(req,res,next){
    res.render('insertClient');
});

app.post('/insertClient',function(req,res){
        var values = [req.body.name];
        var sql = "INSERT INTO Clients (Name) VALUES (?)";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
        });
});

app.get('/insertEmployee',function(req,res,next){
    var context = {};
    var sql = "SELECT e.Name FROM Employees e";
    sql = mysql.pool.query(sql, function(error, results, fields){
            if(error){
                    console.log(JSON.stringify(error));
                    res.write(JSON.stringify(error));
                    res.end();
            }
            context.employees = results;
    });
    var sql2 = "SELECT d.Name FROM Departments d";
    sql2 = mysql.pool.query(sql2, function(error, results, fields){
            if(error){
                    console.log(JSON.stringify(error));
                    res.write(JSON.stringify(error));
                    res.end();
            }
            context.departments = results;
	    res.render('insertEmployee', context);
    });
});

app.post('/insertEmployee',function(req,res){
        var values = [req.body.name, req.body.manager, req.body.department];
        var sql = "INSERT INTO Employees (Name, Manager_id, Department_id) VALUES (?, (SELECT e2.ID FROM Employees e2 WHERE e2.Name = ?), (SELECT d.ID FROM Departments d WHERE d.Name = ?))";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
                        res.end();
                }
		console.log(results);
        });
});

app.get('/insertDepartment',function(req,res,next){
    res.render('insertDepartment');
});

app.post('/insertDepartment',function(req,res){
        var values = [req.body.name];
        var sql = "INSERT INTO Departments (Name) VALUES (?)";
        sql = mysql.pool.query(sql, values, function(error, results, fields){
                if(error){
                        console.log(JSON.stringify(error));
                        res.write(JSON>stringify(error));
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
