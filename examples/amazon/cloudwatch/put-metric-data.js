var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var CloudWatch = awssum.load('amazon/cloudwatch').CloudWatch;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var cloudwatch = new CloudWatch({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'awsAccountId'    : awsAccountId,
    'region'          : amazon.EU_WEST_1,
});

console.log( 'Region :',          cloudwatch.region() );
console.log( 'EndPoint :',        cloudwatch.host() );
console.log( 'AccessKeyId :',     cloudwatch.accessKeyId() );
console.log( 'SecretAccessKey :', cloudwatch.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId :',    cloudwatch.awsAccountId() );

cloudwatch.PutMetricData({
		MetricData : [{
            MetricName : 'Counter',
            Unit : 'Count',
            Value : 1,
			Timestamp: new Date().toISOString(),
            Dimensions : [
                { Name : 'InstanceId',   Value : 'i-aaba32d5', },
                { Name : 'InstanceType', Value : 'm1.micro',    }
            ]
        }],
		Namespace  : 'Namespace'
	},
	function(err, data) {
		console.log("\nPutting count metrics - expecting success");
		inspect(err, 'Error');
		inspect(data, 'Data');
	});
    
cloudwatch.PutMetricData({
		MetricData : [{
            MetricName : 'Time',
            Unit : 'Milliseconds',
            StatisticValues: {
					Minimum: 3,
					Maximum: 1500,
					Sum: 3000,
					SampleCount: 10
				}
        }],
		Namespace  : 'Namespace'
	},
	function(err, data) {
		console.log("\nPutting metrics with statistics- expecting success");
		inspect(err, 'Error');
		inspect(data, 'Data');
	});
    
  
  

