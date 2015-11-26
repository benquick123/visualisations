/**
 * Created by Tim on 25.11.2015.
 */
function numerical(a,b) {
    return b -a ;
}
function onMouseClickChart(){
    d3.select("#chart").selectAll("svg").remove()
    d3.select("#container").style("display","none");
}
function displayChart(id) {
    console.log("display");
    var data = [];
    for(var i = 1;i<9;i++)
        data.push(parseInt(masterTable[id]["0" + i.toString()]))
    for(var i = 10;i<24;i++)
        if (i != 21) data.push(parseInt(masterTable[id][i.toString()]));
    data.sort(numerical);
    var list = [];
    for (var i = 1; i <= data.length; i++) {
        list.push(i);
    }

    var h = window.innerHeight * 0.5;
    var w = window.innerWidth* 0.9;
    var cx =window.innerWidth*  0.1;
    var cy = window.innerHeight * 0.15;
    var barPadding = 1;

    //Create SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .on("click",onMouseClickChart);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d,i) {
            console.log(i, i * (h / data.length), h ,window.innerHeight,d);
            return cy + i * (h / data.length);
        })
        .attr("x", cx)
        .attr("width", 0)
        .transition().duration(250)
        .attr("width", function(d) {
            return (parseInt(w/Math.max.apply(Math, data) * d))})
        .attr("height", function() {
            console.log(h, data.length, h / data.length - barPadding);
            return h/ data.length - barPadding})
        .attr("fill", "teal");

    d3.select("#container").style("display","block")
        .on("click",onMouseClickChart);
}