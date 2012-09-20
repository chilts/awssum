#!/usr/bin/env node
// ----------------------------------------------------------------------------

var fs = require('fs');

var step = require('step');
var Seq = require('seq');
var handlebars = require('handlebars');

var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');

// ----------------------------------------------------------------------------
// start processing what we know

// get the service name and load up that service
var providerName = process.argv[2];
var serviceName  = process.argv[3];
var service = awssum.load('amazon/' + serviceName + '-config')

var map = {
    // Providers
    'amazon' : 'Amazon',
    'openstack' : 'OpenStack',

    // Amazon Services
    'ses'              : 'SES',
    'autoscaling'      : 'AutoScaling',
    'cloudformation'   : 'CloudFormation',
    'cloudfront'       : 'CloudFront',
    'cloudsearch'      : 'CloudSearch',
    'cloudwatch'       : 'CloudWatch',
    'dynamodb'         : 'DynamoDB',
    'ec2'              : 'EC2',
    'elasticache'      : 'ElastiCache',
    'elasticbeanstalk' : 'ElasticBeanstalk',
    'elb'              : 'ELB',
    'emr'              : 'EMR',
    'fps'              : 'FPS',
    'glacier'          : 'Glacier',
    'iam'              : 'IAM',
    'imd'              : 'IMD',
    'importexport'     : 'ImportExport',
    'rds'              : 'RDS',
    'route53'          : 'Route53',
    's3'               : 'S3',
    'ses'              : 'SES',
    'simpledb'         : 'SimpleDB',
    'sns'              : 'SNS',
    'sqs'              : 'SQS',
    'storagegateway'   : 'StorageGateway',
    'sts'              : 'STS',
    'swf'              : 'SWF',
};

// ----------------------------------------------------------------------------

var operations = {};
var examplesFile;
var examples = {};
var template;
var menu;

step(
    function loadExampleFile(err) {
        var next = this;
        if (err) {
            throw err;
        }

        var filename = providerName + '/' + serviceName + '/examples.txt';
        console.log('Reading ' + filename + ' ... ');
        fs.readFile(filename, function(err, data) {
            console.log('Reading ' + filename + ' ... done');
            console.log('Example file is ' + data.length + ' bytes');

            examplesFile = data;

            next(err);
        });
    },
    function processExamples(err) {
        var next = this;
        if (err) {
            throw err;
        }

        // loop through all the lines in this data
        var count = 0;
        var current = {};
        var heredoc = false;
        examplesFile.toString('utf8').split('\n').forEach(function(line, i) {
            // console.log(line);
            var m = line.match(/^(\w+)\s*:\s*(.*)$/);
            if ( m ) {
                // if this is the start of a heredoc
                if ( m[2] === '<<EOF' ) {
                    heredoc = m[1];
                    current[heredoc] = '';
                }
                else {
                    // save this field (m[1]=name, m[2]=value)
                    current[m[1]] = m[2];
                }
            }
            else {
                // if we're in a heredoc
                if ( line === 'EOF' ) {
                    if ( heredoc ) {
                        // heredoc is finished, so escape it here (handlebars does stupid escaping)
                        current[heredoc] = escape(current[heredoc]);

                        // turn heredoc off
                        heredoc = false;
                    }
                    else {
                        console.warn('Got an EOF but not in a heredoc');
                        process.exit(2);
                    }
                }
                else if ( line === '---' ) {
                    // if we're still in a heredoc, then there is a parse error
                    if ( heredoc ) {
                        console.warn('Got a record separator but still in a heredoc');
                        process.exit(2);
                    }

                    // save this example
                    examples[current.name] = examples[current.name] || [];
                    examples[current.name].push(current);
                    current = {};
                    count++;
                }
                else {
                    // save this line to the current field
                    current[heredoc] = current[heredoc] + line + '\n';
                }
            }
        });

        console.log('Found ' + count + ' examples');

        next(null);
    },
    function loadTemplate(err) {
        var next = this;
        console.log('Reading .template.html ... ');
        fs.readFile('.template.html', function(err, data) {
            if (err) {
                next(err);
                return;
            }
            console.log('Reading .template.html ... done');
            template = handlebars.compile(data.toString('utf8'));
            next();
        });
    },
    function makeOperations(err) {
        var next = this;
        if (err) {
            throw err;
        }

        Object.keys(service).sort().forEach(function(name, i) {
            console.log('Making operation data structure for ' + name);

            operations[name] = {
                'ProviderName'  : map[providerName],
                'providername'  : providerName,
                'ServiceName'   : map[serviceName],
                'servicename'   : serviceName,
                'OperationName' : name,
                'operationname' : camelCaseToDashSeparated(name),
                'url'           : service[name].url,
                'params'        : service[name].args,
            };

            // params (convert args to params)
            if ( service[name].args ) {
                // operations[name].params = service[name].args;
                operations[name].params = Object.keys(service[name].args).map(function(argName) {
                    return {
                        name     : argName,
                        required : service[name].args[argName].required,
                        type     : service[name].args[argName].type,
                        note     : service[name].args[argName].note,
                    };
                });
            }

            // check to see if this operation has any examples
            if ( examples[name] ) {
                operations[name].examples = examples[name];
            }

            // ToDo: remove the default params from the service[name].args
        });
        next();
    },
    function processOperations(err) {
        var nextStep = this;
        if (err) {
            throw err;
        }

        // do all of these in parrallel
        Seq(Object.keys(operations))
            .parEach(function(name, i) {
                var next = this;
                var operation = operations[name];
                var filename = [operation.providername, operation.servicename, operation.operationname + '.html'].join('/');
                console.log('Writing ' + filename);
                operation[filename] = filename;

                var html = template(operation);

                fs.writeFile(filename, html, 'utf8', function(err) {
                    next(err);
                });
            })
            .seq(function() {
                console.log('Written all operation files');
                nextStep();
            })
        ;
    },
    function processMenu(err) {
        var next = this;
        if (err) {
            throw err;
        }

        var filename = '_includes/menu-' + providerName + '-' + serviceName + '.html';
        console.log('Generating ' + filename);

        var forMenu = {
            'ProviderName'  : map[providerName],
            'providername'  : providerName,
            'ServiceName'   : map[serviceName],
            'servicename'   : serviceName,
        };

        forMenu.operations = Object.keys(service).map(function(name) {
            return {
                OperationName : name,
                operationName : camelCaseToDashSeparated(name),
            };
        });

        var out = [];
        out.push('  <li><a href="/' + providerName + '/">&laquo; back</a></li>\n');
        out.push('  <li class="tab-' + providerName + '-' + serviceName + ' nav-header">' + map[providerName] + ' ' + map[serviceName] + '</li>\n');

        Object.keys(service).sort().forEach(function(name, i) {
            out.push('  <li class="tab-' + providerName + '-' + serviceName + '-' + camelCaseToDashSeparated(name) + '">\n');
            out.push('    <a href="/' + providerName + '/' + serviceName + '/' + camelCaseToDashSeparated(name) + '.html">' + name + '</a>\n');
            out.push('  </li>\n');
        });

        console.log('Contains ' + out.length + ' line(s)');

        console.log('Writing file ' + filename + ' ...');
        fs.writeFile(filename, out.join(''), 'utf8', function(err) {
            console.log('Writing file ' + filename + ' ... done');
        });
    }
);

// ----------------------------------------------------------------------------

function camelCaseToDashSeparated(name) {
    name = name.replace(/([A-Z])/g, function(match, group) {
        return '-' + group.toLowerCase();
    });
    return name.substr(1);
}

function readExamplesTxt(name) {
    console.log('Reading ' + name);
}

function escape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ----------------------------------------------------------------------------
