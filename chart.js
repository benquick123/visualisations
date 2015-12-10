/**
 * Created by Tim on 25.11.2015.
 */
window.onresize = resizeChart;
var slot1, slot2;
var dataSlot1, dataSlot2;
var barPadding = 1;
var lineStart = 0.4;
var lineEnd = 0.9;
var values = [];
var idx = [];
var svg;

function byColumn(a, b) {
    if (a[0] === b[0])
        return 0;
    else
        return (a[0] > b[0]) ? -1 : 1;
}

function resizeChart(){
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    d3.select("#chart")
        .selectAll("svg")
        .style("width", w)
        .style("height", h);

    d3.selectAll("#rect-comp1")
        .data(values)
        .style("y", function(d,i) {
            return i * (h / values.length);
        })
        .style("x",lineStart*w)
        .style("width", function(d) {
            var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, values) * d);
            if (wid < 1) return 1;
            return wid;
        })
        .style("height", function() {
            return h/ values.length - barPadding});

    d3.selectAll("#value")
        .data(values)
        .attr("x", function(d) {
            return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, values) * d +5);
        })
        .attr("y", function(d,i) {
            return i * (h / values.length)+14 ;
        });

    d3.selectAll("#label")
        .data(values)
        .attr("y", function(d,i) {
            return i * (h / idx.length) +14;
        });
}

function onMouseClickChart(){
    slot1 = null;
    slot2 = null;
    dataSlot1 = null;
    dataSlot2 = null;

    var ch = d3.select("#chart");
    ch.selectAll("rect").remove();
    ch.selectAll("text").remove();
    ch.selectAll("svg").remove();
    d3.select("#chart-container").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
    d3.select("#compare-options").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#compare-options").style("display","none")});
}

function onObcinaChosenChange(event, params) {
    var id = params["selected"];
    console.log(id);
}

function onObcinaCompareChange(event, params) {
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();
    var id = params["selected"];
    slot2 = id;
    var values1 = [], values2 = [];
    var ido = 0;
    if (id > 143) ido = 1;
    var data = [];
    for(var i = 1;i<9;i++)
        data.push([parseInt(masterTable[id+ido]["0" + i.toString()]),"0" + i.toString()])
    for(var i = 10;i<24;i++)
        if (i != 21) data.push([parseInt(masterTable[id+ido][i.toString()]),i]);
    dataSlot2 = cloneObject(data);

    for (var i = 0; i < dataSlot1.length; i++){
        idx[i] = dataSlot1[i][1];
        values1[i] = dataSlot1[i][0];
        values2[i] = dataSlot2[i][0];
    }
    d3.selectAll("#value").remove();
    d3.selectAll("#label").remove();

    console.log(id, parseInt(ido+id+1), idObcine[parseInt(ido+id+1)]);
    d3.select("#name")
        .append("text")
        .text(' x ' + idObcine[parseInt(id)]);

    d3.selectAll("#rect-comp1")
        .transition().duration(250)
        .attr("width", function(d,i) {
            var wid;
            if (values1[i] == 0) wid  = 0;
            else  wid = parseInt(w*(lineEnd-lineStart) * values1[i]/(values1[i]+values2[i]));
            return wid;
        });

    svg.selectAll("rect2")
        .data(values2)
        .enter()
        .append("rect")
        .attr("y", function(d,i) {
            return i * (h / values2.length);
        })
        .attr("fill", "#0B4E8B")
        .attr("x",function(d,i) {
            var x2;
            if (values2[i] == 0) x2  = lineEnd*w;
            else  x2 = lineStart*w + w*(lineEnd-lineStart) * values1[i]/(values1[i]+values2[i]);
            return x2;
        })
        .attr("width", 0)
        .transition().duration(250)
        .attr("width", function(d,i) {
            var wid;
            var x2;
            if (values2[i] == 0) x2  = lineEnd*w;
            else  x2 = lineStart*w + w*(lineEnd-lineStart) * values1[i]/(values1[i]+values2[i]);
            if (values2[i] == 0) wid  = 0;
            else  wid = lineEnd*w-x2;
            return wid;
        })
        .attr("height", function() {
            return h/ values2.length - barPadding})
        .attr("opacity",0.8)
        .attr("id","rect-comp2");

    svg.selectAll("#label")
        .data(idx)
        .enter()
        .append("text")
        .text(function(d) {
            return idCategories[d];
        })
        .attr("x", 0)
        .attr("y", function(d,i) {
            return i * (h / idx.length) +14;
        })
        .attr("width",lineStart)
        .style("text-align","right")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9vmax")
        .attr("fill", "white")
        .attr("id","label");
}

function loadDropdowns(id) {
    $('.chosen-select').chosen({
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

    $('.chosen-select').trigger('chosen:updated');
}

function displayChart(id) {
    d3.select("#chart-container").style("display","flex").style("opacity",1).on("click",onMouseClickChart, false);
    d3.select("#compare-options").style("display","flex").style("opacity",1);
    d3.select("#name").text("");
    var ido = 0;
    if (id > 143) ido = 1;
    var data = [];
    for(var i = 1;i<9;i++)
        data.push([parseInt(masterTable[id]["0" + i.toString()]),"0" + i.toString()])
    for(var i = 10;i<24;i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]),i]);

    loadDropdowns(id+ido);

    slot1=id;
    dataSlot1=cloneObject(data);         //data naj se shrani v dataSlot1 nesortirana!
    data.sort(byColumn);

    for (var i = 0; i < data.length; i++){
        idx[i] = data[i][1];
        values[i] = data[i][0];
    }

    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    //        Municipality name
    console.log(id, ido+1+id, idObcine[parseInt(ido+id+1)]);
    d3.select("#name")
        .append("text")
        .text(idObcine[parseInt(ido+id+1)]);

    //      Create SVG element
    svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .on("click",onMouseClickChart);

    //        Chart lines
    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("y", function(d,i) {
            return i * (h / values.length);
        })
        .attr("fill", "teal")
        .attr("x",lineStart*w)
        .attr("width", 0)
        .transition().duration(500)
        .attr("width", function(d) {
            var wid = parseInt(w*(lineEnd-lineStart)/Math.max.apply(Math, values) * d);
            if (wid < 1 && d > 0) return 1;
            return wid;
        })
        .attr("height", function() {
            return h/ values.length - barPadding})
        .attr("opacity",0.8)
        .attr("id","rect-comp1");

    //        Chart values
    svg.selectAll("value")
        .data(values)
        .enter()
        .append("text")
        .text(function(d) {
            return numberWithCommas(parseInt(d))+ " €" + "  ";
        })
        .attr("fill", "white")
        .attr("x", w*lineStart)
        .transition().duration(500)
        .attr("x", function(d) {
            return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, values) * d +5);
        })
        .attr("y", function(d,i) {
            return i * (h / values.length)+14 ;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "1vmax")
        .attr("id","value");

    //        Chart legend
    svg.selectAll("index")
        .data(idx)
        .enter()
        .append("text")
        .text(function(d) {
            return idCategories[d];
        })
        .attr("x", 0)
        .attr("y", function(d,i) {
            return i * (h / idx.length) +14;
        })
        .attr("width",lineStart)
        .style("text-align","right")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9vmax")
        .attr("fill", "white")
        .attr("id","label");

    //d3.select("#chart-container").style("display","flex")
    //    .on("click",onMouseClickChart);

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

