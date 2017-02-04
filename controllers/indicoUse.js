var indico = require('indico.io');
var keys = require('../configs/indicoKey.json');

indico.apiKey = keys.indicoKey;

// object that stores all indico objects
var indicoUse = {};


// make employee object in database
// make employee object queries
var Employee = Parse.Object.extend("Employee");
var employee = new Employee();


// input: message and employeeid as req.body.message and req.body.employeeid
// runs message through indico sentiment analysis and emotion analysis
// appends retults to database, specific to database
// returns 200 if success
indicoUse.receiveDataAndProcess = function(req, res){
	if (!req.body.employeeid || !req.body.message || !req.body.time) {
		return res.status(400).send("requires employeeid, message, and time");
	}



	// get analysis from indico
	indico.emotion(req.body.message).then(function(emotion){
		console.log(emotion);
		indico.sentiment(req.body.message).then(function(sentiment){
			console.log(sentiment);
			// save stuff
			emotion.sentiment = sentiment;
			if (req.body.time === "morning"){
				emotion.morning = true;
			}
			if (req.body.time === "evening"){
				emotion.evening = true;
			}
			emotion.time = Date.now();
			employee.set("employeeid", parseInt(req.body.employeeid));
			employee.add("emotionData", emotion);
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

};

indicoUse.cleanDB = function(req, res){
	var employeeQuery = new Parse.Query(Employee);
	employeeQuery.find().then(function (employeeInfo) {

		employeeInfo.forEach(function(e){
			e.destroy({
			  	success: function(e) {
			    	// The object was deleted from the Parse Cloud.
			  	},
			  	error: function(e, error) {
			    // The delete failed.
			    // error is a Parse.Error with an error code and message.
			  	}
			});
		});


        res.status(200).send(employeeInfo);
    }, function (error) {
    	if (error){
    		res.status(500).send(error);
    	}
    });
	
};

module.exports = indicoUse;