var year = 2014;

var tmpData = [];
var data = [];
var masterTable = [];
var dataLoaded = false;
var idObcine, idCategories;
var prebivalci;

function loadData(newYear) {
    year = newYear;
    console.log(year);
    var urls = ["data/odhodki_tekoci_" + year + ".json", "data/odhodki_investicijski_" + year + ".json",  "data/transferji_tekoci_" + year + ".json", "data/transferji_investicijski_" + year + ".json"];
    var othrData = ["data/obcine.json", "data/categories.json", "data/prebivalci.json"];
    tmpData = [];
    data = [];
    masterTable = [];
    dataLoaded = false;
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
        }),
        $.getJSON(othrData[0], function(arr) {
            idObcine = arr;
        }),
        $.getJSON(othrData[1], function(arr) {
            idCategories = arr;
        }),
        $.getJSON(othrData[2], function(arr) {
            prebivalci = arr;
        })
    ).then(function() {
        data = tmpData;
        masterTable = cloneObject(data[0]);
        emptyMaster();
        sumTables();
        dataLoaded = true;
        loadCategories(idCategories);
        console.log(masterTable);
    });
}

function emptyMaster(){
    for(var prop in masterTable){
        for(var sm in masterTable[prop]) {
            masterTable[prop][sm] = 0;
        }
    }
}
function sumTables() {
    //console.log(masterTable);
    for (var table in data){
        //console.log(table);
        for(var prop in data[table]){
            for(var sm in data[table][prop]) {
                //console.log(table + " " + prop + " " + sm);
                if (sm == "id")     masterTable[prop][sm] = parseFloat(data[table][prop][sm]);
                else                masterTable[prop][sm] += parseFloat(data[table][prop][sm]);            }
        }
    }
}

function createTable() {
    var out = "<table>";
    for (var property in masterTable[0])
        out += "<th>" + property + "</th>";

    for(var i = 0; i < masterTable.length; i++) {
        out += "<tr>";
        for (var property in masterTable[i])
            out += "<th>" + masterTable[i][property] + "</th>";
        out += "</tr>";
    }
    out += "</table>";
    document.getElementById("data").innerHTML = out;
}
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj)
        temp[key] = cloneObject(obj[key]);
    return temp;
}