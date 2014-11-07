module.exports = {
	"credentials": {
		"region": "us-west-2",
		"accessKeyId": process.env.KEEZER_BRAZOS_AWS_ACCESS_KEY_ID,
		"secretAccessKey": process.env.KEEZER_BRAZOS_AWS_SECRET_ACCESS_KEY
	},
	"topic": "arn:aws:sns:us-west-2:177781656108:demo",
	"queue": {
		"arn": "arn:aws:sqs:us-west-2:177781656108:keezer",
		"url": "https://sqs.us-west-2.amazonaws.com/177781656108/keezer"
	}
};
