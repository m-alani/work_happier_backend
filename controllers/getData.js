var Employee = Parse.Object.extend("Employee");
var employee = new Employee();
var employeeQuery = new Parse.Query(Employee);

var getData = {};


//only get the past day's data
getData.getDataLastDayData = function(req, res){
	var data = {
		morning: {
			sentiment: [],
			anger: [],
			joy: [],
			fear: [],
			sadness: [],
			surprise: []
		},
		evening: {
			sentiment: [],
			anger: [],
			joy: [],
			fear: [],
			sadness: [],
			surprise: []
		},
		total: {
			sentiment: [],
			anger: [],
			joy: [],
			fear: [],
			sadness: [],
			surprise: []
		}
	};


	//for each employee, sort by time, get one morning and one evening
	employeeQuery.find().then(function (employeeInfo) {
		employeeInfo.forEach(function(e){
			var emotionData = e.get("emotionData");

			emotionData.sort(function(a, b){
				return a.time - b.time;
			});

			var morning = false;
			var evening = false;

			emotionData.forEach(function(eData){

				for(var iter = 0; iter < emotionData.length; iter++){
					if (eData.morning && morning === false){
						data.morning.sentiment.push(eData.sentiment);
						data.morning.anger.push(eData.anger);
						data.morning.joy.push(eData.joy);
						data.morning.fear.push(eData.fear);
						data.morning.sadness.push(eData.sadness);
						data.morning.surprise.push(eData.surprise);
						morning = true;

						data.total.sentiment.push(eData.sentiment);
						data.total.anger.push(eData.anger);
						data.total.joy.push(eData.joy);
						data.total.fear.push(eData.fear);
						data.total.sadness.push(eData.sadness);
						data.total.surprise.push(eData.surprise);

					} else if (eData.evening && evening === false){
						data.evening.sentiment.push(eData.sentiment);
						data.evening.anger.push(eData.anger);
						data.evening.joy.push(eData.joy);
						data.evening.fear.push(eData.fear);
						data.evening.sadness.push(eData.sadness);
						data.evening.surprise.push(eData.surprise);
						evening = true;

						data.total.sentiment.push(eData.sentiment);
						data.total.anger.push(eData.anger);
						data.total.joy.push(eData.joy);
						data.total.fear.push(eData.fear);
						data.total.sadness.push(eData.sadness);
						data.total.surprise.push(eData.surprise);
					}
					if (morning === true && evening === true){
						break;
					}
				}

			});
		});

		res.status(200).send(data);

	}, function (error) {
    	if (error){
    		res.status(500).send(error);
    	}
    });

};



// get all the data and compile it
getData.getDataAllTime = function(req, res){

	employeeQuery.find().then(function (employeeInfo) {
		var data = {
			morning: {
				sentiment: [],
				anger: [],
				joy: [],
				fear: [],
				sadness: [],
				surprise: []
			},
			evening: {
				sentiment: [],
				anger: [],
				joy: [],
				fear: [],
				sadness: [],
				surprise: []
			},
			total: {
				sentiment: [],
				anger: [],
				joy: [],
				fear: [],
				sadness: [],
				surprise: []
			}
		};

		employeeInfo.forEach(function(e){
			var emotionData = e.get("emotionData");
			console.log(emotionData);
			emotionData.forEach(function(eData){
				console.log(eData);
				if (eData.morning) {
					console.log("143");
					data.morning.sentiment.push(eData.sentiment);
					data.morning.anger.push(eData.anger);
					data.morning.joy.push(eData.joy);
					data.morning.fear.push(eData.fear);
					data.morning.sadness.push(eData.sadness);
					data.morning.surprise.push(eData.surprise);
				}
				if (eData.evening){
					console.log("152");
					data.evening.sentiment.push(eData.sentiment);
					data.evening.anger.push(eData.anger);
					data.evening.joy.push(eData.joy);
					data.evening.fear.push(eData.fear);
					data.evening.sadness.push(eData.sadness);
					data.evening.surprise.push(eData.surprise);
				}

				data.total.sentiment.push(eData.sentiment);
				data.total.anger.push(eData.anger);
				data.total.joy.push(eData.joy);
				data.total.fear.push(eData.fear);
				data.total.sadness.push(eData.sadness);
				data.total.surprise.push(eData.surprise);
				

			});
			console.log(data);




		});

        res.status(200).send(employeeInfo);
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