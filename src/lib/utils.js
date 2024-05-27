"use strict"


var utils = {

    titleCase: function(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' ');
    },

    compareArray: function(a, b) {
        var temp = {};
        var flag = true;

        if (a.length !== b.length) {
            flag = false;
            return flag;
        }

        a.forEach(function(val) {
            temp[val] = true;
        });
        b.forEach(function(val) {
            if (!temp[val]) {
                flag = false;
            }
        });

        return flag;
    },

    parsePartialJson: function(jsonData) {

        var parsedJson = {}
        for (var key in jsonData) {

            if (!jsonData[key]) {
                continue;
            }

            try {

                if (Array.isArray(jsonData[key])) {
                    var tmpArrObj = [];
                    for (var index in jsonData[key]) {
                        tmpArrObj[index] = JSON.parse(jsonData[key][index]);
                    }
                    parsedJson[key] = tmpArrObj;
                } else {
                    parsedJson[key] = JSON.parse(jsonData[key]);
                }
            } catch (err) {
                parsedJson[key] = jsonData[key];
            }
        }

        return (parsedJson);

    },

    compareString: function(str1, str2) {

        var longer = str1;
        var shorter = str2;

        if (str1.length < str2.length) {
            longer = str2;
            shorter = str1;
        }

        var longerLength = longer.length;

        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);


        function editDistance(s1, s2) {

            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();

            var costs = new Array();

            for (var i = 0; i <= s1.length; i++) {
                var lastValue = i;
                for (var j = 0; j <= s2.length; j++) {
                    if (i == 0) {
                        costs[j] = j;
                    } else {
                        if (j > 0) {
                            var newValue = costs[j - 1];
                            if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            }
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0)
                    costs[s2.length] = lastValue;
            }
            return costs[s2.length];
        }

    },

    jsonToCsv: function(data, del, header) {
        var keys = Object.keys(data[0]);
        if (header) {
            keys = header;
        }
        if (!del) {
            del = ',';
        }
        var csv = [keys.join(del)];
        data.forEach(function(row) {
            var csvRow = [];
            keys.forEach(function(key) {
                if (typeof row[key] === 'string') {
                    csvRow.push("" + utils.escape_csv(row[key]) + "");
                } else {
                    csvRow.push(row[key]);
                }
            });
            csv.push(csvRow.join(del));
        });
        csv = csv.join("\n");
        return csv;
    },

    escape_csv: function(x) {
        if (x)
            return ('' + x.replace(/"/g, '').replace(/,/g, ';').replace(/\n/g, " ").replace(/\r/g, " ") + '');
        else
            return ('');
    },

    diffArray: function(a, b) {
        return a.filter(function(x) {
            return b.indexOf(x) < 0
        });
    },

    jsonToCsvSave: function(filepath, data, headers, cb) {

        var csvData = [];
        var error = null;
        var header;
        if (headers) {
            var keys = Object.keys(headers);
            header = keys.join(",");
        } else {
            var keys = Object.keys(data[0]);
            header = keys.join(",");
        }
        csvData.push(header);

        data.forEach(function(row) {
            writeData(row);
        });

        fs.writeFile(filepath, csvData.join("\n"), finalize);

        function writeData(row) {
            var csvRow = [];
            keys.forEach(function(key) {
                if (typeof row[key] === 'string') {
                    csvRow.push("" + row[key].replace(/"/, '""') + "");
                } else {
                    csvRow.push(row[key]);
                }
            });
            csvData.push(csvRow.join(","));

        }

        function finalize(err) {
            if (err)
                error = err;
            return cb(error);
        }
    }
}

module.exports = utils;

(function() {
    if (require.main == module) {
        console.log("starting..");
        // console.log(utils.toCapitalise(' '));
        var a = ['a', 'c', 'b', 'd', 'e'];
        var b = ['d', 'c', 'a', 'b', 'e'];
        console.log(utils.checkHeaders(a, b));
        // console.log(utils.compareString('Adidas tshirt blue', 'Adidas tshirt blue'))
    }
}());