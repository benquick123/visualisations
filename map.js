var svg;

function onMouseOverMunicipality() {
    //console.log("onmouseover: " + this.getAttribute("id"));
    d3.select(this).selectAll("path").transition().duration(250).style("fill", "#B3481D");
}

function onMouseClickMunicipality() {
    var id = parseInt(this.getAttribute("id").replace("obc_", ""));
    if(dataLoaded) {
        console.log("onmouseclick: " + id);
        console.log(masterTable[id-1]);
    }
}

function onMouseOutMunicipality() {
    //console.log("onmouseout: " + this.getAttribute("id"));
    d3.select(this).selectAll("path").transition().duration(250).style("fill", "#147B4F");
}

function loadMap() {
    var div = d3.select('#map')
    var svgContainer = div.append('svg').attr("width", window.innerWidth-50).attr("height", window.innerHeight-50);
    var g = svgContainer.append('g').attr('class', 'svg-container');

    d3.xml("data/obcinemap.svg", "image/svg+xml", function(xml) {
        g.node().appendChild(document.importNode(xml.documentElement, true));
        svg = document.getElementById("mainMap");

        var obcine = svg.children;

        for (var i = 0; i < obcine.length; i++) {//child in svg.children) {
            for (var j = 0; j < obcine[i].children.length; j++)
                obcine[i].children[j].setAttribute("fill", "#147B4F");

            obcine[i].addEventListener("mouseover", onMouseOverMunicipality);
            obcine[i].addEventListener("click", onMouseClickMunicipality);
            obcine[i].addEventListener("mouseout", onMouseOutMunicipality);
        }
    });
}
