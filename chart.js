
window.onresize = resizeChart;
var svgChart;

//          Chart global data
var chartDesplayed = false;
var idSlot1 = null, idSlot2 = null;
var dataSlot1 = null, dataSlot2 = null;

//          Chart Settings
var barPadding = 1;
var lineStart = 0.4;
var lineEnd = 0.92;

//          Sort by first column
function byColumn(a, b) {
    if (a[0] === b[0]) return 0;
    return (a[0] > b[0]) ? -1 : 1;
}

function resizeChart(){
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();
    var data1 = [], data2 = [];
    d3.select("#chartSvg").style("width", w).style("height", h);
    jQuery.extend(true, data1, dataSlot1);
    data = data1.sort(byColumn);
    data1 = separateData(data1);
    if (idSlot2 == null){

        //        Chart lines
        svgChart.selectAll("#rect2")
            .attr("y", function(d,i) { return i * (h / data1[0].length);})
            .attr("height", function() {return h/ data1[0].length - barPadding});

        svgChart.selectAll("#rect1")
            .attr("width", function(d,i) {
                var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) * data1[0][i]);
                if (wid < 1 &&  data1[0][i] > 0) return 1;
                return wid;
            })
            .attr("height", function() {    return h/ data1[1].length - barPadding})
            .attr("y", function(d,i) {      return i * (h / data1[0].length); })
            .attr("x", lineStart*w);

        svgChart.selectAll("#value1")
            .attr("x", function(d,i) {return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) *  data1[0][i] +5);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+14 ;});

        svgChart.selectAll("#value2")
            .attr("x", function(d,i) {return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) *  data1[0][i] +5);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+14 ;});
    }
    else {
        jQuery.extend(true, data2, dataSlot1);
        data2 = data2.sort(byColumn);
        data2 = separateData(data2);
        svgChart.selectAll("#rect1")
            .attr("width", function(d,i) {
                var wid;
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);
                if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) wid = w*(lineEnd-lineStart);
                else if (v1 == 0) wid  = 0;
                else  wid = w*(lineEnd-lineStart) * v1/(v1+v2);
                return wid;
            })
            .attr("y", function(d,i) {      return i * (h / data1[0].length); })
            .attr("height", function() {    return h/ data1[1].length - barPadding})
            .attr("x", lineStart*w);

        svgChart.selectAll("#rect2")
            .attr("height", function() {    return h/ data1[1].length - barPadding})
            .attr("y", function(d,i) {      return i * (h / data1[0].length); })
            .attr("x",function(d,i) {
                var x;
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);
                if (v2 == 0) x  = lineEnd*w;
                else  x = lineStart*w + w*(lineEnd-lineStart) * v1/(v1+v2);
                return x;
            })
            .attr("width", function(d,i) {
                var wid;
                var x;
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);

                if ( v2 == 0) x = lineEnd*w;
                else  x = lineStart*w + w*(lineEnd-lineStart) * v1/(v1+v2);
                if ( v2 == 0) wid  = 0;
                else  wid = lineEnd*w-x;
                if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) wid = 0;
                return wid;
            });

        //        Chart values - € or %
        svgChart.selectAll("#value1")
            .text(function(d,i) {
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]) * 100;
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]) * 100;
                var r = v1/(v1+v2) * 100;
                if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "0%";
                else return Math.round(r)+ " %" + "  ";
            })
            .attr("x", function(d) {return parseInt(w*lineStart-w*0.03); })
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+14 ;})
            .attr("id", "value1");

        svgChart.selectAll("#value2")
            .text(function(d,i) {
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]) * 100;
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]) * 100;
                var r = v2/(v1+v2) * 100;
                if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "0%";
                else return Math.round(r)+ " %" + "  ";
            })
            .attr("x", function(d) {return parseInt(w*lineEnd);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+14 ;})
            .attr("id", "value2");
    }
    svgChart.selectAll("#label")
        .attr("y", function(d,i) { return i * (h / data1[1].length) +14;})
        .attr("width", lineStart);

    $('.chosen-select').trigger('chosen:updated');
}

function onMouseClickChart(){
    idSlot1 = null;
    idSlot2 = null;
    dataSlot1 = null;
    dataSlot2 = null;
    chartDesplayed = false;
    svgChart.remove();
    lineEnd = 0.92;
    d3.select("#name").selectAll("text").remove();
    d3.select("#chart-container").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
    d3.select("#compare-options").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#compare-options").style("display","none")});
}

function onObcinaChosenChange(event, params) {
    var id = params["selected"];
    redoChart(id - 1, 1);
}

function onObcinaCompareChange(event, params) {
    var id = params["selected"];
    d3.select("#obcina-compare").selectAll("a.chosen-single").style("background-color", "#0b4e8b");
    redoChart(id - 1, 2);
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
        .attr("id","chartSvg")
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

function redoChart(id, slot) {                                                       // REDO CHART
    var data = [];

    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    if (!chartDesplayed){   // There is no chart
        chartDesplayed = true;
        dataSlot1 = getData(id);
        idSlot1 = id;
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
            .attr("id", "rect1")
            .style("opacity", 0.8);



        svgChart.selectAll("rect2").data(data[0]).enter().append("rect")
            .attr("y", function(d,i) {
                return i * (h / data[0].length);
            })
            .attr("fill", "#0B4E8B")
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

        svgChart.selectAll("value2").data(data[0]).enter().append("text")
            .text("")
            .style("fill", "white")
            .style("font-family", "sans-serif")
            .style("font-size", "1vmax")
            .attr("x", function(d) {
                return parseInt(w*lineEnd);
            })
            .attr("y", function(d,i) {
                return i * (h / data[0].length)+14 ;
            })
            .attr("id", "value2");

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
        if (slot == 1 && idSlot2 == null){
            dataSlot1 = getData(id);
            idSlot1 = id;
            jQuery.extend(true, data, dataSlot1);
            data = data.sort(byColumn);
            data = separateData(data);
            //        Chart lines

            svgChart.selectAll("#rect1")
                .transition().duration(250)
                .attr("width", function(d,i) {
                    var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * data[0][i]);
                    if (wid < 1 &&  data[0][i] > 0) return 1;
                    return wid;
                })

            //        Chart values - € or %
            svgChart.selectAll("#value1")
                .text(function(d,i) {
                    return numberWithCommas(parseInt( data[0][i]))+ " €" + "  ";
                })
                .transition().duration(250)
                .attr("x", function(d,i) {
                    return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) *  data[0][i] +5);
                })

            //        Chart legend
            svgChart.selectAll("#label")
                .text(function(d,i) {
                    return idCategories[data[1][i]];
                });

        }
        else{
            if (slot == 2){
                idSlot2 = id;
                dataSlot2 = getData(id);
            }

            else{
                idSlot1 = id;
                dataSlot1 = getData(id);
            }
            lineEnd = 0.93;
            console.log(dataSlot1);
            //        Chart lines
            svgChart.selectAll("#rect1")
                .transition().duration(250)
                .attr("width", function(d,i) {
                    var wid;
                    var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                    var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);


                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) wid = w*(lineEnd-lineStart);
                    else if (v1 == 0) wid  = 0;
                    else  wid = w*(lineEnd-lineStart) * v1/(v1+v2);
                    return wid;
                })
                .style("fill", function(d,i) {
                    console.log(dataSlot1[i][0], dataSlot2[i][0]);
                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "grey";
                    else return "teal";
                });

            svgChart.selectAll("#rect2")
                .transition().duration(250)
                .attr("x",function(d,i) {
                    var x;
                    var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                    var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);
                    if (v2 == 0) x  = lineEnd*w;
                    else  x = lineStart*w + w*(lineEnd-lineStart) * v1/(v1+v2);
                    return x;
                })
                .attr("width", function(d,i) {
                    var wid;
                    var x;
                    var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]);
                    var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]);

                    if ( v2 == 0) x = lineEnd*w;
                    else  x = lineStart*w + w*(lineEnd-lineStart) * v1/(v1+v2);
                    if ( v2 == 0) wid  = 0;
                    else  wid = lineEnd*w-x;
                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) wid = 0;
                    return wid;
                });

            //        Chart values - € or %
            svgChart.selectAll("#value1")
                .text(function(d,i) {
                    var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]) * 100;
                    var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]) * 100;
                    var r = v1/(v1+v2) * 100;
                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "0%";
                    else return Math.round(r)+ " %" + "  ";
                })
                .style("fill", "white")
                .style("font-family", "sans-serif")
                .style("font-size", "1vmax")
                .attr("x", function(d) {
                    return parseInt(w*lineStart-w*0.03);
                })
                .attr("id", "value1");

            svgChart.selectAll("#value2")
                .text(function(d,i) {
                    var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]) * 100;
                    var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]) * 100;
                    var r = v2/(v1+v2) * 100;
                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "0%";
                    else return Math.round(r)+ " %" + "  ";
                })
                .style("fill", "white")
                .style("font-family", "sans-serif")
                .style("font-size", "1vmax")
                .attr("x", function(d) {
                    return parseInt(w*lineEnd);
                })
                .attr("id", "value2");

            svgChart.selectAll("#label")
                .text(function(d,i) {
                    return idCategories[dataSlot1[i][1]];
                });


        }

    }
}