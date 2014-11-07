module.exports = function(app, callback) {
	var _ = require("lodash");
	var awsConfig = require("../aws-config");
	var Beer = app.models.Beer;
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
	
	function sendTweet(message, callback) {
		twitter.verifyCredentials(function(data) {
			//console.log(util.inspect(data));
		}).updateStatus(message, function(data) {
			callback(data);
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
				Keg.findOne({
					where: {
						tap: +tap
					}
				}, function(err, keg) {
					if (err) {
						console.error(err);
						return;
					}
					
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
							return;
						}

						console.log("klog: " + JSON.stringify(obj));

						// sum all kegflows and send warning tweet if appropriate
						KegFlow.find({
							where: {
								keg_id: keg.id
							}
						}, function(err, flows) {
							var spentMl = _.reduce(flows, function(memo, flow) {
								return memo + flow.ml;
							}, 0);
							
							var remainingMl = keg.start_ml - spentMl;
							var remainingPct = (remainingMl / keg.start_ml) * 100;

							var d = {
								startMl: keg.start_ml,
								spentMl: spentMl,
								remainingMl: remainingMl,
								remainingPct: remainingPct
							};

							if (remainingPct < 10 && !keg.warning_tweet_sent) {
								Beer.findOne({
									where: {
										id: keg.beer_id
									}
								}, function(err, beer) {
									// tweet last chance warning
									sendTweet(beer.name + " on tap " + keg.tap + " is running out! Come get some before it's gone!", function() {
										keg.updateAttributes({
											warning_tweet_sent: true
										});
									});
								});
							}
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