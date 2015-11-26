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
    var svgContainer = div.append('svg').attr("width", window.innerWidth-50).attr("height", window.innerHeight-50).attr("id", "svgParent");
    var g = svgContainer.append('g').attr('class', 'svg-container').attr('id', 'viewport');

    d3.xml("data/obcinemap.svg", "image/svg+xml", function(xml) {
        g.node().appendChild(document.importNode(xml.documentElement, true));
        svg = document.getElementById("mainMap");

        var obcine = d3.select(svg).selectAll("g");
        obcine.selectAll("path").style("fill", "#147B4F");
        obcine.on("mouseover", onMouseOverMunicipality);
        obcine.on("click", onMouseClickMunicipality);
        obcine.on("mouseout", onMouseOutMunicipality);

    });
}

//http://paletton.com/#uid=70T1+0kranUh+v7mLrvudjCC4et
$(function(){
    var map=$('#world-map').vectorMap({
        map: 'Obcine_mill_en',
        backgroundColor: "#e4e4e4",
        zoomAnimate: true,
        regionStyle: {
            initial: {
                fill: "#888888"
            },
            hover: {
                "fill-opacity": 1,
                //fill: "#0F3068"
            }
        },

        onRegionOver: function(e, code) {
            var region = $('#world-map').vectorMap('get', 'mapObject').regions[code];
            var path = d3.select("#" +  code);
            path.transition().duration(250).style("fill", "#AA2A23");
        },

        onRegionOut: function(e, code) {
            var region = $('#world-map').vectorMap('get', 'mapObject').regions[code];
            var path = d3.select("#" +  code);
            path.transition().duration(250).style("fill", "#888888");
        },

        onRegionClick: function (e, code) {
            var id = code.replace("ob", "");
            var region = $('#world-map').vectorMap('get', 'mapObject').regions[code];
            console.log(id);
            console.log(region);
        }
    });

    var svg = $(".jvectormap-container")[0].children[0];
    var paths = svg.children[1].children;
    for (var i = 0; i < paths.length; i++) {
        var dataCode = paths[i].getAttribute("data-code");
        paths[i].setAttribute("id", dataCode);
    }
})
