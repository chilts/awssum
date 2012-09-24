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
    'region'          : amazon.US_EAST_1,
});

console.log( 'Region :',          cloudwatch.region() );
console.log( 'EndPoint :',        cloudwatch.host() );
console.log( 'AccessKeyId :',     cloudwatch.accessKeyId() );
console.log( 'SecretAccessKey :', cloudwatch.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId :',    cloudwatch.awsAccountId() );

cloudwatch.PutMetricData({
		MetricData : {
            MetricName : "SomeTime",
            Unit : 'Milliseconds',
            Value : 320,
			Timestamp: new Date().toISOString(),
            Dimensions : [
                { Name : 'InstanceId',   Value : 'i-aaba32d5', },
                { Name : 'InstanceType', Value : 'm1.micro',    },
            ]
        },
		Namespace  : 'NameSpace'
	},
	function(err, data) {
		fmt.msg("Putting metrics");
		fmt.dump(err, 'Error');
		fmt.dump(data, 'Data');
	});
    }
  }

