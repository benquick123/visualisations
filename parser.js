var urls = ["data/odhodki_tekoci.json", "data/odhodki_investicijski.json",  "data/transferji_tekoci.json", "data/transferji_investicijski.json"];

var tmpData = [];
var data = [];
var masterTable = [];
$.when(
    $.getJSON(urls[0], function(arr) {
        tmpData.push(arr);
    }),
    $.getJSON(urls[1], function(arr) {
        tmpData.push(arr);
    }),
    $.getJSON(urls[2], function(arr) {
        tmpData.push(arr);
    }),
    $.getJSON(urls[3], function(arr) {
        tmpData.push(arr);
    })
).then(function() {
    console.log(tmpData);
    data = tmpData;
    masterTable = cloneObject(data[0]);
    orderMaster();
    sumTables();
    createTable();
    /*for (var arr in tmpData) {
        for (var obj in tmpData[arr]) {
            //console.log(arr);
            tmpObj = {};
            for (var property in tmpData[arr][obj]) {
                tmpObj[property] = tmpData[arr][obj][property];
            }
            if (arr == 0) {
                data.push(tmpObj);
            }
        }
        //console.log(data);
    }
*/
    //console.log(obj);
});
function orderMaster(){
    for(var prop in masterTable){
        for(var sm in masterTable[prop]) {
            masterTable[prop][sm] = 0;
        }
    }

}
function sumTables() {
    for (var table in data){
        for(var prop in data[table]){
            for(var sm in data[table][prop]) {
                if (sm == "id")
                    masterTable[prop][sm] = parseFloat(data[table][prop][sm]);
                else
                    masterTable[prop][sm] += parseFloat(data[table][prop][sm]);
            }
        }
    }
}

function createTable() {
    var data0 = masterTable;

    var out = "<table>";
    for (var property in data0[0]) {
        out += "<th>" + property + "</th>";
    }

    for(var i = 0; i < data0.length; i++) {
        out += "<tr>";
        for (var property in data0[i]) {
            out += "<th>" + data0[i][property] + "</th>";
        }

        out += "</tr>";
    }
    out += "</table>";
    document.getElementById("test").innerHTML = out;
}
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj)
        temp[key] = cloneObject(obj[key]);
    return temp;
}
/*var parser = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var obj = JSON.parse(xmlhttp.responseText);
        myFunction(obj);
    }
};

var ot = new XMLHttpRequest();
var oi = new XMLHttpRequest();
var tt = new XMLHttpRequest();
var ti = new XMLHttpRequest();

ot.onreadystatechange = parser;
oi.onreadystatechange = parser;
tt.onreadystatechange = parser;
ti.onreadystatechange = parser;

ot.open("GET", urls[0], true);
oi.open("GET", urls[1], true);
tt.open("GET", urls[2], true);
ti.open("GET", urls[3], true);

ot.send();
oi.send();
tt.send();
ti.send();

data = [];

function myFunction(arr) {
    if (data == null)
        data = arr;
    else {


    }
    /*data.push(arr);
    var out = "<table>";
    for (var property in arr[0]) {
        out += "<th>" + property + "</th>";
    }

    for(var i = 0; i < arr.length; i++) {
        out += "<tr>";
        for (var property in arr[i]) {
            out += "<th>" + arr[i][property] + "</th>";
        }

        out += "</tr>";
    }
    out += "</table>";
    document.getElementById("test").innerHTML = out;*/
//}