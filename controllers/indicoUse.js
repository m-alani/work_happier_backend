var indico = require('indico.io');
var keys = require('../configs/indicoKey.json');

indico.apiKey = keys.indicoKey;

// object that stores all indico objects
var indicoUse = {};


// make employee object in database
// make employee object queries
var Employee = Parse.Object.extend("Employee");
var employee = new Employee();
var employeeQuery = new Parse.Query(Employee);


// input: message and employeeid as req.body.message and req.body.employeeid
// runs message through indico sentiment analysis and emotion analysis
// appends retults to database, specific to database
// returns 200 if success
indicoUse.receiveDataAndProcess = function(req, res){
	if (!req.body.employeeid || !req.body.message) {
		return res.status(400).send("requires employeeid and message");
	}


	// get analysis from indico
	indico.emotion(req.body.message).then(function(emotion){
		console.log(emotion);
		indico.sentiment(req.body.message).then(function(sentiment){
			console.log(sentiment);
			// save stuff
			employee.set("employeeid", parseInt(req.body.employeeid));
			employee.add("emotionData", emotion);
			employee.add("sentimentData", sentiment);
			employee.save(null, {
			  	success: function(employee) {
			    	res.status(200).send({employee: employee});
			  	},
				  error: function(employee, error) {
				  	if (error){
				    	res.status(500).send({error: error});
				    }
			  	}
			});

		})
		.catch(function(err){
			if (err){
  				res.status(500).send({error: err});
  			}
		});
	})
  	.catch(function(err){
  		if (err){
  			res.status(500).send({error: err});
  		}
  	});



	



	//res.send("hi");



};

module.exports = indicoUse;