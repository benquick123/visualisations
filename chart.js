/**
 * Created by Tim on 25.11.2015.
 */
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
function onMouseClickChart(){
    //var h = window.innerHeight * 0.8;
    //var w = window.innerWidth * 0.7;
    //d3.select("#chart").selectAll("value").transition().duration(500).attr("x",w*0.4);
    //d3.select("#chart").selectAll("rect").transition().duration(500).attr("width",0);
    d3.select("#chart").selectAll("svg").remove();
    d3.select("#name").selectAll("text").remove();
    d3.select("#chart-container").style("display","none");
}
function displayChart(id) {
    var ido = 0;
    if (id > 144) ido = 1;
    var data = [];
    for(var i = 1;i<9;i++)
        data.push([parseInt(masterTable[id]["0" + i.toString()]),"0" + i.toString()])
    for(var i = 10;i<24;i++)
        if (i != 21) data.push([parseInt(masterTable[id][i.toString()]),i]);

    data.sort(byColumn);

    var idx = []; var values = [];
    for (var i = 0; i < data.length; i++){
        idx[i] = data[i][1];
        values[i] = data[i][0];
    }

    var h = window.innerHeight * 0.8;
    var w = window.innerWidth * 0.7;
    var barPadding = 1;

    //Create SVG element
    console.log(idObcine, id);
    d3.select("#name")
        .append("text")
        .text(idObcine[parseInt(ido+id+1)]);


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
        .attr("x","40%")
        .attr("width", 0)
        .transition().duration(500)
        .attr("width", function(d) {
            return (parseInt(w*0.50/Math.max.apply(Math, values) * d));
        })
        .attr("height", function() {
            return h/ values.length - barPadding})
        .attr("opacity",0.8)
        .attr("display","flex");

    //        Chart values
    svg.selectAll("value")
        .data(values)
        .enter()
        .append("text")
        .text(function(d) {
            return numberWithCommas(parseInt(d))+ " €" + "  ";
        })
        .attr("fill", "white")
        .attr("x", w*0.4)
        .transition().duration(500)
        .attr("x", function(d, i) {
            return parseInt(w*0.50/Math.max.apply(Math, values) * d)+w*0.4+5;
        })
        .attr("y", function(d,i) {
            return i * (h / values.length) +14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px");

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
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "white");

    d3.select("#chart-container").style("display","flex")
        .on("click",onMouseClickChart);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
