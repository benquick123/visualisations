
window.onresize = resizeChart;
var svgChart;

//          Chart global data
var chartDesplayed = false;
var idSlot1, idSlot2;
var dataSlot1, dataSlot2;

//          Chart Settings
var barPadding = 1;
var lineStart = 0.4;
var lineEnd = 0.9;

//          Sort by first column
function byColumn(a, b) {

    if (a[0] === b[0]) return 0;
    return (a[0] > b[0]) ? -1 : 1;
}

function resizeChart(){
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();
    $('.chosen-select').trigger('chosen:updated');
}

function onMouseClickChart(){
    chartDesplayed = false;
    svgChart.remove();
    d3.select("#name").selectAll("text").remove();
    d3.select("#chart-container").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
    d3.select("#compare-options").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#compare-options").style("display","none")});
}

function onObcinaChosenChange(event, params) {
    var id = params["selected"];
    console.log(id);
}

function onObcinaCompareChange(event, params) {
    var id = params["selected"];
    console.log(id);
}


function getData(id){
    var data = [];
    for (var i = 1; i < 9; i++)
        data.push([parseInt(masterTable[id]["0" + i.toString()]), "0" + i.toString()])
    for (var i = 10; i < 24; i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]), i.toString()]);
    return data;
}
function displayChart(id) {                                                                         // DISPLAY CHART
    d3.select("#chart-container").style("display", "flex").style("opacity", 1).on("click", onMouseClickChart, false);
    d3.select("#compare-options").style("display", "flex").style("opacity", 1);

    var ido = 0;
    if (id > 143) ido = 1;


    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    //      Create SVG element
    svgChart = d3.select("#chart")
        .append("svg")
        .style("width", w)
        .style("height", h)
        .on("click", onMouseClickChart);


    redoChart(id,1);
    loadDropdowns(id + ido);
}

function loadDropdowns(id) {                                                                        // DROPDOWN
    var chosenDiv = $('.chosen-select');
    chosenDiv.chosen({
        placeholder_text_single: "Primerjaj z ...",
        no_results_text: "Ni rezultatov"
    });

    $("#select-obcina-chosen").on("change", function(evt, params) {
        onObcinaChosenChange(evt, params);
    });
    $("#select-obcina-compare").on("change", function(evt, params) {
        onObcinaCompareChange(evt, params);
    });

    var obcinaChosen = d3.select("#obcina-chosen").select(".chosen-select");
    var obcinaCompare = d3.select("#obcina-compare").select(".chosen-select");

    var chosenInnerHTML = '<option value=""></option>';
    var compareInnerHTML = '<option value=""></option>';

    for (var obcina in idObcine) {
        if (obcina == (id+1))
            chosenInnerHTML += '<option selected="selected" value="' + obcina + '">' + idObcine[obcina] + '</option>';
        else
            chosenInnerHTML += '<option value="' + obcina + '">' + idObcine[obcina] + '</option>';
        compareInnerHTML += '<option value="' + obcina + '">' + idObcine[obcina] + '</option>';
    }

    obcinaChosen[0][0].innerHTML = chosenInnerHTML;
    obcinaCompare[0][0].innerHTML = compareInnerHTML;

    d3.select("#obcina-chosen").selectAll("a.chosen-single").style("background-color", "teal");
    //0b4e8b

    chosenDiv.trigger('chosen:updated');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function separateData(data){
    var values = [], idx = [];
    for (var i = 0; i < data.length; i++) {
        idx[i] = data[i][1];
        values[i] = data[i][0];
    }
    return [values,idx]
}
function redoChart(id, slot){                                                                       // REDO CHART
    var ido = 0;
    if (id > 143) ido = 1;
    var data = [];

    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    if (!chartDesplayed){   // There is no chart
        chartDesplayed = true;
        dataSlot1 = getData(id);

        jQuery.extend(true, data, dataSlot1);
        data = data.sort(byColumn);
        data = separateData(data);


        //        Chart lines

        svgChart.selectAll("rect1").data(data[0]).enter().append("rect")
            .attr("y", function(d,i) {
                return i * (h / data[0].length);
            })
            .style("fill", "teal")
            .attr("x",lineStart*w)
            .attr("width", 0)
            .transition().duration(500)
            .attr("width", function(d) {
                var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * d);
                if (wid < 1 && d > 0) return 1;
                return wid;
            })
            .attr("height", function() {
                return h/ data[1].length - barPadding})
            .style("opacity", 0.8)
            .attr("id", "rect1");



        svgChart.selectAll("rect2").data(data[0]).enter().append("rect")
            .attr("y", function(d,i) {
                return i * (h / data[0].length);
            })
            .attr("x", lineEnd*w)
            .attr("width", 0)
            .attr("height", function() {
                return h/ data[0].length - barPadding})
            .style("opacity", 0.8)
            .attr("id", "rect2");

        //        Chart values - € or %
        svgChart.selectAll("value1").data(data[0]).enter().append("text")
            .text(function(d) {
                return numberWithCommas(parseInt(d))+ " €" + "  ";
            })
            .style("fill", "white")
            .style("font-family", "sans-serif")
            .style("font-size", "1vmax")

            .attr("x",  w*lineStart)
            .transition().duration(500)
            .attr("x", function(d) {
                return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * d +5);
            })
            .attr("y", function(d,i) {
                return i * (h / data[0].length)+14 ;
            })
            .attr("id", "value1");



        //        Chart legend
        svgChart.selectAll("label").data(data[1]).enter().append("text")
            .text(function(d) {
                return idCategories[d];
            })
            .attr("x", 0)
            .attr("y", function(d,i) {
                return i * (h / data[1].length) +14;
            })
            .attr("width", lineStart)
            .style("font-family", "sans-serif")
            .style("font-size", "0.9vmax")
            .style("fill", "white")
            .attr("id", "label");

    }
    else {
        if (slot == 2 && idSlot2 == null){
            dataSlot2 = getData(id);


            //        Chart lines
            svgChart.selectAll("rect1").data(data[0]).enter().append("rect")
                .attr("y", function(d,i) {
                    return i * (h / data[0].length);
                })
                .style("fill", "teal")
                .attr("x",lineStart*w)
                .attr("width", 0)
                .transition().duration(500)
                .attr("width", function(d) {
                    var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * d);
                    if (wid < 1 && d > 0) return 1;
                    return wid;
                })
                .attr("height", function() {
                    return h/ data[1].length - barPadding})
                .style("opacity", 0.8)
                .attr("id", "rect1");



            svgChart.selectAll("rect2").data(data[0]).enter().append("rect")
                .attr("y", function(d,i) {
                    return i * (h / data[0].length);
                })
                .attr("x", lineEnd*w)
                .attr("width", 0)
                .attr("height", function() {
                    return h/ data[0].length - barPadding})
                .style("opacity", 0.8)
                .attr("id", "rect2");

            //        Chart values - € or %
            svgChart.selectAll("value1").data(data[0]).enter().append("text")
                .text(function(d) {
                    return numberWithCommas(parseInt(d))+ " €" + "  ";
                })
                .style("fill", "white")
                .style("font-family", "sans-serif")
                .style("font-size", "1vmax")

                .attr("x",  w*lineStart)
                .transition().duration(500)
                .attr("x", function(d) {
                    return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * d +5);
                })
                .attr("y", function(d,i) {
                    return i * (h / data[0].length)+14 ;
                })
                .attr("id", "value1");



            //        Chart legend
            svgChart.selectAll("label").data(data[1]).enter().append("text")
                .text(function(d) {
                    return idCategories[d];
                })
                .attr("x", 0)
                .attr("y", function(d,i) {
                    return i * (h / data[1].length) +14;
                })
                .attr("width", lineStart)
                .style("font-family", "sans-serif")
                .style("font-size", "0.9vmax")
                .style("fill", "white")
                .attr("id", "label");

        }

    }
}