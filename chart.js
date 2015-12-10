/**
 * Created by Tim on 25.11.2015.
 */
window.onresize = resizeChart;
var barPadding = 1;
var lineStart = 0.4;
var lineEnd = 0.9;
var values = [];
var idx = [];

function byColumn(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

function resizeChart(){
    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    d3.select("#chart")
        .selectAll("svg")
        .style("width", w)
        .style("height", h);

    d3.selectAll("rect")
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
    //var h = window.innerHeight * 0.8;
    //var w = window.innerWidth * 0.7;
    //d3.select("#chart").selectAll("value").transition().duration(500).attr("x",w*0.4);
    //d3.select("#chart").selectAll("rect").transition().duration(500).attr("width",0);

    d3.select("#chart")
        .selectAll("svg")
        .remove();
    d3.select("#name")
        .selectAll("text")
        .remove();

    d3.select("#chart-container").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
    d3.select("#compare-options").transition().duration(250).style("opacity",0).each("end", function () {d3.select("#chart-container").style("display","none")});
}

function onObcinaChosenChange(event, params) {
    var id = params["selected"];
    console.log(id);
}

function onObcinaCompareChange(event, params) {
    var id = params["selected"];
    console.log(id);
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

    var ido = 0;
    if (id > 144) ido = 1;
    var data = [];
    for(var i = 1;i<9;i++)
        data.push([parseInt(masterTable[id]["0" + i.toString()]),"0" + i.toString()])
    for(var i = 10;i<24;i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]),i]);

    loadDropdowns(id+ido);
    data.sort(byColumn);

    for (var i = 0; i < data.length; i++){
        idx[i] = data[i][1];
        values[i] = data[i][0];
    }

    var chartDiv = $("#chart");
    var h = chartDiv.height();
    var w = chartDiv.width();

    //        Municipality name
    d3.select("#name")
        .append("text")
        .text(idObcine[parseInt(ido+id+1)]);

    //      Create SVG element
    var svg = d3.select("#chart")
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
        .attr("opacity",0.8);

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

    d3.select("#chart-container").style("display","flex")
        .on("click",onMouseClickChart);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

