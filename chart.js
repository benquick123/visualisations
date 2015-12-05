/**
 * Created by Tim on 25.11.2015.
 */
window.onresize = resizeChart;
var barPadding = 1;
var lineStart = 0.4;
var lineEnd = 0.85;
var values = [];
var idx = [];

function numerical(a,b) {
    return b -a ;
}
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

    console.log(d3.selectAll("#value"));
    d3.selectAll("value")
        .data(values)
        .style("x", function(d) {
            return parseInt(w*lineStart+w*(lineEnd-lineStart)/Math.max.apply(Math, values) * d +5);
        })
        .style("y", function(d,i) {
            return i * (h / values.length)+14 ;
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
}
function displayChart(id) {
    d3.select("#chart-container").style("display","flex").style("opacity",1)
        .on("click",onMouseClickChart);

    var ido = 0;
    if (id > 144) ido = 1;
    var data = [];
    for(var i = 1;i<9;i++)
        data.push([parseInt(masterTable[id]["0" + i.toString()]),"0" + i.toString()])
    for(var i = 10;i<24;i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]),i]);

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
        .attr("font-size", "1vmax");

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
        .attr("font-size", "8px")
        .attr("fill", "white");

    d3.select("#chart-container").style("display","flex")
        .on("click",onMouseClickChart);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

