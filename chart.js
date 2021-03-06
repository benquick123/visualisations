window.onresize = function() {if (chartDisplayed) return resizeChart();};

var svgChart, divChart;
var tooltip;
//          Chart global data
var chartDisplayed = false;
var idSlot1 = null, idSlot2 = null;
var dataSlot1 = null, dataSlot2 = null;

//          Chart Settings
var barPadding = 5;
var lineStart = 0.4;
var lineEnd = 0.92;
var spaceLabelChart = 20;
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
    d3.select("#chartDiv").style("width", w*lineStart-getWidthOfText("100%","1.5vh")-spaceLabelChart).style("height", h);
    jQuery.extend(true, data1, dataSlot1);
    data = data1.sort(byColumn);
    data1 = separateData(data1);

    // change if
    var dw = $("#compare-options").width();
    d3.select("#select_obcina_chosen_chosen").style("width",(dw/2)*0.8+"px");       // dropdown width updates based on width of compare options div
    d3.select("#select_obcina_compare_chosen").style("width",(dw/2)*0.8+"px");      // margin of
    if (idSlot2 == null){
        //        Chart lines
        svgChart.selectAll("#rect2")
            .attr("y", function(d,i) { return i * (h / data1[0].length);})
            .attr("height", function() { var tmp = h/ data1[1].length - barPadding;  if (tmp<0) return 1; return tmp;})
            .attr("x", lineEnd*w);

        svgChart.selectAll("#rect1")
            .attr("width", function(d,i) {
                var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) * data1[0][i]);
                if (wid < 1 &&  data1[0][i] > 0) return 1;
                return wid;
            })
            .attr("height", function() { var tmp = h/ data1[1].length - barPadding;  if (tmp<0) return 1; return tmp;})
            .attr("y", function(d,i) {      return i * (h / data1[0].length); })
            .attr("x", lineStart*w);

        svgChart.selectAll("#value1")
            .attr("x", function(d,i) {return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) *  data1[0][i] +5);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+((h / data1[0].length)*0.5) ;});

        svgChart.selectAll("#value2")
            .attr("x", function(d,i) {return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data1[0]) *  data1[0][i] +5);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+((h / data1[0].length)*0.5) ;});
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
            .attr("height", function() { var tmp = h/ data1[1].length - barPadding;  if (tmp<0) return 1; return tmp;})
            .attr("x", lineStart*w);

        svgChart.selectAll("#rect2")
            .attr("height", function() { var tmp = h/ data1[1].length - barPadding;  if (tmp<0) return 1; return tmp;})
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
            .attr("x", function(d) {return parseInt(w*lineStart-getWidthOfText("100%","1.5vh")-3); })
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+((h / data1[0].length)*0.55) ;})
            .attr("id", "value1");

        svgChart.selectAll("#value2")
            .text(function(d,i) {
                var v1 = parseInt(dataSlot1[i][0])/parseInt(masterTable[idSlot1]["sum"]) * 100;
                var v2 = parseInt(dataSlot2[i][0])/parseInt(masterTable[idSlot2]["sum"]) * 100;
                var r = v2/(v1+v2) * 100;
                if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "0%";
                else return Math.round(r)+ " %" + "  ";
            })
            .attr("x", function(d) {return parseInt(w*lineEnd+3);})
            .attr("y", function(d,i) {  return i * (h / data1[0].length)+((h / data1[0].length)*0.55) ;})
            .attr("id", "value2");
    }
    divChart.selectAll("#label")
        .style("width", "100%")
        .style("height", function(d,i) {    return h/ data1[1].length})
        .attr("y", function(d,i) {      return i * (h / data1[0].length); });

    $('.chosen-select').trigger('chosen:updated');
}

function onMouseClickChart(){
    idSlot1 = null;
    idSlot2 = null;
    dataSlot1 = null;
    dataSlot2 = null;
    chartDisplayed = false;
    svgChart.remove();
    divChart.remove();
    tooltip.remove();
    lineEnd = 0.92;
    showButtons();
    removeRectListener()
    d3.select("#name").selectAll("text").remove();
    d3.select("#chart-container").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
    d3.select("#compare-options").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#compare-options").style("display","none")});

}
function removeRectListener(){
    d3.selectAll("#rect1").on("mouseover",null).on("mousemove",null).on("mouseout", null);
    d3.selectAll("#rect2").on("mouseover",null).on("mousemove",null).on("mouseout", null);
}
function onObcinaChosenChange(event, params) {
    var id = params["selected"];
    redoChart(id - 1, 1);
}

function onObcinaCompareChange(event, params) {
    var id = params["selected"];
    if (id == "compare") {

        d3.select("#obcina-compare").selectAll("a.chosen-single").style("background-color", "#444");
        $("#chartText").css("visibility", "hidden");
        var sel = $("#select-obcina-chosen")[0];
        var selID = sel.options[sel.selectedIndex].value;
        //call function to display only one chart. selID is an id of green municipality.

        if (idSlot2 != null){
            idSlot2 = null;
            dataSlot2 = null;
            redoChart(idSlot1, 1);
        }
    }
    else {
        d3.select("#obcina-compare").selectAll("a.chosen-single").style("background-color", "#0b4e8b");
        redoChart(id - 1, 2);
        $("#chartText").css("visibility", "visible");
    }
}

function loadDropdowns(id) {
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

    compareInnerHTML += '<option value="compare">Primerjaj z ...</option>';

    for (var obcina in idObcine) {
        if (obcina == (id+1))
            chosenInnerHTML += '<option selected="selected" value="' + obcina + '">' + idObcine[obcina] + '</option>';

        else
            chosenInnerHTML += '<option value="' + obcina + '">' + idObcine[obcina] + '</option>';
        compareInnerHTML += '<option value="' + obcina + '">' + idObcine[obcina] + '</option>';
    }

    obcinaChosen[0][0].innerHTML = chosenInnerHTML;
    obcinaCompare[0][0].innerHTML = compareInnerHTML;

    d3.select("#obcina-chosen").selectAll("a.chosen-single").style("background-color", "#147B4F").style("font-size","1.5vh");

    chosenDiv.trigger('chosen:updated');
}

function getData(id){
    var data = [];

    for (var i = 1; i < 9; i++){
        data.push([parseInt(masterTable[id]["0" + i.toString()]), "0" + i.toString()]);}
    for (var i = 10; i < 24; i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]), i.toString()]);
    return data;
}
function displayChart(id) {                                                                         // DISPLAY CHART
    d3.select("#chart-container").style("display", "flex").transition().duration(300).style("opacity", 1).each("end",function(){d3.select("#chart-container").on("click", onMouseClickChart, false)});
    d3.select("#compare-options").style("display", "flex").transition().duration(300).style("opacity", 1);

    d3.select("#obcina-compare").selectAll("a.chosen-single").style("background-color", "#444");
    $("#chartText").css("visibility", "hidden");

    var ido = 0;
    if (id > 143) ido = 1;


    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    tooltip  = d3.select("body")
        .append("div")
        .attr("id","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("color","#4a4a4a")
        .style("font-size","2vh")
        .style("text-align","center")
        .style("background-color","#bababa")
        .style("border-radius","3px")
        .style("font-weight", "bold")
        .style("opacity",0.8)
        .style("visibility", "hidden");

    //      Create SVG element
    svgChart = d3.select("#chart")
        .append("svg")
        .style("width", w)
        .style("height", h)
        .attr("id","chartSvg")
        .style("position","absolute")
        .on("click", onMouseClickChart);
    divChart = d3.select("#chart")
        .append("div")
        .style("width", w*lineStart-getWidthOfText("100%","1.5vh")-spaceLabelChart)
        .style("height", h)
        .style("left", 0)
        .style("position","absolute")
        .attr("id","chartDiv")
        .on("click", onMouseClickChart);

    redoChart(id,1);
    loadDropdowns(id + ido);
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

function redoChart(id, slot) {
    removeRectListener()
    var data = [];
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    if (!chartDisplayed){                                                       // on chart load
        chartDisplayed = true;
        dataSlot1 = getData(id);
        idSlot1 = id;


        jQuery.extend(true, data, dataSlot1);
        data = data.sort(byColumn);
        data = separateData(data);
        hideButtons();

        //        Chart lines

        svgChart.selectAll("rect1").data(data[0]).enter().append("rect")
            .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(d,i){return tooltip
                .style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px")
                .style("width",function() {return getWidthOfText((parseInt(d)/parseInt(masterTable[idSlot1]["sum"])*100).toFixed(2) + " %","2vh") + 20})
                .text((parseInt(d)/parseInt(masterTable[idSlot1]["sum"])*100).toFixed(2) + " %");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            .attr("y", function(d,i) {
                return i * (h / data[0].length);
            })
            .style("fill", "#147B4F")
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
            .style("font-size", "1.5vh")

            .attr("x",  w*lineStart)
            .transition().duration(500)
            .attr("x", function(d) {
                return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * d +5);
            })
            .attr("y", function(d,i) {
                return i * (h / data[0].length)+((h / data[0].length)*0.55);
            })
            .attr("id", "value1");

        svgChart.selectAll("value2").data(data[0]).enter().append("text")
            .text("")
            .style("fill", "white")
            .style("font-size", "1.5vh")
            .attr("x", function(d) {
                return parseInt(w*lineEnd);
            })
            .attr("y", function(d,i) {
                return i * (h / data[0].length)+((h / data[0].length)*0.55) ;
            })
            .attr("id", "value2");

        //        Chart legend
        divChart.selectAll("label").data(data[1]).enter().append("div")
            .text(function(d) {
                return idCategories[d].toLowerCase().replace(" ", "").capitalizeFirstLetter();
            })
            .style("left", 0)
            .style("height", function() { return h/ data[0].length  })
            .style("top", function(d,i) {
                return i * (h / data[0].length);
            })
            .attr("width", w*lineStart-getWidthOfText("100%","1.5vh")-6)
            .attr("id", "label")
            .on("mouseover", function(){
                this.style.overflow="visible";
                this.style.textShadow="0px 0px 10px #000000, 0px 0px 5px #000000";
            })
            .on("mouseout", function(){
                this.style.overflow="hidden";
                this.style.textShadow="none";
            });

    }
    else {                                                          // on single-view update or deselect comparing municipality
        if (slot == 1 && idSlot2 == null){
            dataSlot1 = getData(id);
            idSlot1 = id;
            data = [];
            jQuery.extend(true, data, dataSlot1);
            data = data.sort(byColumn);
            data = separateData(data);
            //        Chart lines

            svgChart.selectAll("#rect1")
                .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                .on("mousemove", function(d,i){return tooltip
                    .style("top", (event.pageY-10)+"px")
                    .style("left",(event.pageX+10)+"px")
                    .style("width",function() {return getWidthOfText((parseInt( data[0][i])/parseInt(masterTable[idSlot1]["sum"])*100).toFixed(2) + " %","2vh") + 20})
                    .text((parseInt( data[0][i])/parseInt(masterTable[idSlot1]["sum"])*100).toFixed(2) + " %");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
                .transition().duration(250)
                .attr("width", function(d,i) {
                    var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * data[0][i]);
                    if (wid < 1 &&  data[0][i] > 0) return 1;
                    return wid;
                })
                .style("fill", "#147B4F")

            svgChart.selectAll("#rect2")
                .attr("fill", "#0B4E8B")
                .transition().duration(250)
                .attr("x", function(d,i) {
                    var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) * data[0][i]);
                    if (wid < 1 &&  data[0][i] > 0) return (w*lineStart);
                    return (w*lineStart) + wid;
                })
                .attr("width", 0)
                .transition().duration(0).attr("x", lineEnd*w);

            //        Chart values - € or %
            svgChart.selectAll("#value1")
                .text(function(d,i) {
                    return numberWithCommas(parseInt( data[0][i]))+ " €" + "  ";
                })
                .transition().duration(250)
                .attr("x", function(d,i) {
                    return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, data[0]) *  data[0][i] +5);
                })

            svgChart.selectAll("#value2")
                .text("")
                .attr("x", function(d) {
                    return parseInt(w*lineEnd);
                });
            //        Chart legend
            divChart.selectAll("#label")
                .text(function(d,i) {
                    return idCategories[data[1][i]].toLowerCase().replace(" ", "").capitalizeFirstLetter();
                });

        }
        else{                                                          // on update to from single to compare view
            if (slot == 2){
                idSlot2 = id;
                dataSlot2 = getData(id);
            }

            else{
                idSlot1 = id;
                dataSlot1 = getData(id);
            }
            lineEnd = 0.93;
            //        Chart lines
            svgChart.selectAll("#rect1")
                .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                .on("mousemove", function(d,i){return tooltip
                    .style("top", (event.pageY-10)+"px")
                    .style("left",(event.pageX+10)+"px")
                    .style("width",function() {return getWidthOfText(numberWithCommas(dataSlot1[i][0]) + " €", "2 vh")+20 })
                    .text(numberWithCommas(dataSlot1[i][0]) + " €");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
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
                    if (dataSlot1[i][0] == 0 && dataSlot2[i][0] == 0) return "grey";
                    else return "#147B4F";
                });

            svgChart.selectAll("#rect2")
                .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                .on("mousemove", function(d,i){return tooltip
                    .style("top", (event.pageY-10)+"px")
                    .style("left",(event.pageX+10)+"px")
                    .style("width",function() {return getWidthOfText(numberWithCommas(dataSlot2[i][0]) + " €", "2 vh")+20 })
                    .text(numberWithCommas(dataSlot2[i][0]) + " €");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
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
                .style("font-size", "1.5vh")
                .transition().duration(100)
                .attr("x", function(d) {
                    return parseInt(w*lineStart-getWidthOfText("100%","1.5vh")-3);
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
                .style("font-size", "1.5vh")
                .attr("x", function(d) {
                    return parseInt(w*lineEnd+3);
                })
                .attr("id", "value2");

            divChart.selectAll("#label")
                .text(function(d,i) {
                    return idCategories[dataSlot1[i][1]].toLowerCase().replace(" ", "").capitalizeFirstLetter();
                })
                .attr("width", w*lineStart-getWidthOfText("100%","1.5vh")-6);


        }

    }
}
function getWidthOfText(txt, size){
    var c=document.createElement('canvas');
    var ctx=c.getContext('2d');
    ctx.font = size + fontFamily;
    var length = ctx.measureText(txt).width;
    return length;
}