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
    res.render('insert');
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
        // res.redirect('/addEmployee');
});

app.get('/addEmployee/:name',function(req,res,next){
        var context = {};
        context.projects = [{ Name: req.params.name}];
        // var sql = "SELECT p.Name FROM Projects p";
        // sql = mysql.pool.query(sql, function(error, results, fields){
        //         if(error){
        //                 console.log(JSON.stringify(error));
        //                 res.write(JSON.stringify(error));
        //                 res.end();
        //         }
        //         console.log(results);
        //         context.projects = results;
        // });
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
