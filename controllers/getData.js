var Employee = Parse.Object.extend("Employee");
var employee = new Employee();
var employeeQuery = new Parse.Query(Employee);

var getData = {};



getData.getDataLastData = function(req, res){


};


getData.getDataLastDay = function(req, res){

};

// get all the data and compile it
getData.getDataAllTime = function(req, res){

	employeeQuery.find().then(function (employeeInfo) {
		var data = {
			sentiment: [],
			anger: [],
			joy: [],
			fear: [],
			sadness: [],
			surprise: []
		};

		employeeInfo.forEach(function(e){
			var emotionData = e.get("emotionData");
			var sentimentData = e.get("sentimentData");

			if (emotionData){
				emotionData.forEach(function(eData){
					console.log(eData);
					data.anger.push(eData.anger);
					data.joy.push(eData.joy);
					data.fear.push(eData.fear);
					data.sadness.push(eData.sadness);
					data.surprise.push(eData.surprise);
				});
			}

			if (sentimentData){
				data.sentiment = data.sentiment.concat(sentimentData);
			}
		});
		data.sentiment = getAverage(data.sentiment);
		data.anger     = getAverage(data.anger);
		data.joy 	   = getAverage(data.joy);
		data.fear 	   = getAverage(data.fear);
		data.sadness   = getAverage(data.sadness);
		data.surprise  = getAverage(data.surprise);

        res.status(200).send(data);
    }, function (error) {
    	if (error){
    		res.status(500).send(error);
    	}
    });
};

function getAverage(arr){
	var sum = 0;
	arr.forEach(function(a){
		sum += a;
	});
	return sum/arr.length;
}

module.exports = getData;