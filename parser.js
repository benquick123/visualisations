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
    data = tmpData;
    masterTable = cloneObject(data[0]);
    emptyMaster();
    sumTables();
    //createTable();

});
function emptyMaster(){
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
                if (sm == "id")     masterTable[prop][sm] = parseFloat(data[table][prop][sm]);
                else                masterTable[prop][sm] += parseFloat(data[table][prop][sm]);
            }
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