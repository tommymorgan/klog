module.exports = function(app, callback) {
	var _ = require("lodash");
	var awsConfig = require("../aws-config");
	var Keg = app.models.Keg;
	var KegFlow = app.models.KegFlow;
	var Poller  = require("aws-sqs-poller");
	var twitterApi = require("twitter");
	var twitterConfig = require("../twitter-config");
	var util = require('util');
	
	var twitter = new twitterApi({
		consumer_key: twitterConfig.consumerKey,
		consumer_secret: twitterConfig.consumerSecret,
		access_token_key: twitterConfig.accessTokenKey,
		access_token_secret: twitterConfig.accessTokenSecret
	});
	
	function sendTweet(message) {
		twitter.verifyCredentials(function(data) {
			//console.log(util.inspect(data));
		}).updateStatus(message, function(data) {
			//console.log(util.inspect(data));
		});
	}
	
	var awsOptions = {
		name: "keezer", // required
		accessKeyId: awsConfig.credentials.accessKeyId, // required
		secretAccessKey: awsConfig.credentials.secretAccessKey, // required
		region: awsConfig.credentials.region, // optional, default is "us-east-1"
		//maxMessages: 4, // optional, default is 10, must be between 1-10 
	};

	var myQueue = new Poller(awsOptions);

	myQueue.start(); // calling this will start the poller
	myQueue.on("message", function (msg) {
		// msg.data.Message format: {"final":true,"data":{"0":3349,"1":0,"2":0,"3":0,"4":0,"5":0}}
		var flowData = JSON.parse(msg.data.Message);
		
		if (flowData.final && flowData.data) {
			_.each(_.keys(flowData.data), function(tap) {
				Keg.find({
					where: {
						tap: +tap
					}
				}, function(err, kegs) {
					_.each(kegs, function(keg) {
						var pulses = flowData.data[tap];
						var ml = Math.round(pulses / 6.1); // 6100 pulses/liter
						
						if (!ml) {
							// don't bother saving zeros
							return;
						}

						var kegData = {
							keg_id: keg.id,
							ml: ml,
							// use the timestamp from the message since it could have been enqueued for awhile
							timestamp: msg.data.Timestamp
						};
						
						KegFlow.create(kegData, function(err, obj) {
							if (err) {
								console.error(err);
							}
							
							console.log("klog: " + JSON.stringify(obj));
						});
					});
				});
			});
		}
		
		msg.remove();
		myQueue.next(); // move to next message
	});
	
	callback();
};