var marc4js = require('marc4js');
var fs = require('fs');

var file = __dirname + '/ocm.mrc';

// console.log(file);
fs.readFile(file, function (err, data) {
    marc4js.parse(data, {}, function (err, records) {
        marc4js.transform(records, { format: 'json' }, function (err, data) {
            var obj = JSON.parse(data);
            obj.forEach(function (rec) {
                console.log(rec.leader);
                rec.fields.forEach(function (rec1) {
                    if (rec1['245']) {
                        console.log(rec1['245'].subfields);
                    }
                });
            });
            // obj.fields.forEach(function (rec) {
            //     console.log(rec);
            // });
        });
    });
});

// var parser = marc4js.parse({});
// var transformer = marc4js.transform({format: 'json'});
// fs.createReadStream(file).pipe(parser).pipe(transformer).pipe(process.stdout);