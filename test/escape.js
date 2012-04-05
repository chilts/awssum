var tap = require("tap"),
    test = tap.test,
    plan = tap.plan;
var escape = require('../lib/escape.js');

test("test our own escape(...)", function (t) {
    var query1 = 'DomainName';
    var escQuery1 = escape(query1);
    t.equal(escQuery1, 'DomainName', 'Simple String (idempotent)');

    var query2 = 2;
    var escQuery2 = escape(query2);
    t.equal(escQuery2, '2', 'Simple Number Escape (idempotent)');

    var query3 = 'String Value';
    var escQuery3 = escape(query3);
    t.equal(escQuery3, 'String%20Value', 'Simple With a Space');

    var query4 = 'Hey @andychilton, read this! #liverpool';
    var escQuery4 = escape(query4);
    t.equal(escQuery4, 'Hey%20%40andychilton%2C%20read%20this%21%20%23liverpool', 'Something akin to a Tweet');

    var query5 = 'SELECT * FROM my_table';
    var escQuery5 = escape(query5);
    t.equal(escQuery5, 'SELECT%20%2A%20FROM%20my_table', 'Escaping of a select');

    var signature = 'wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D';

    t.end();
});
