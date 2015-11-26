var svg;

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
            var path = d3.select("#" +  code);
            path.transition().duration(250).style("fill", "#AA2A23");
        },

        onRegionOut: function(e, code) {
            var path = d3.select("#" +  code);
            path.transition().duration(250).style("fill", "#888888");
        },

        onRegionClick: function (e, code) {
            var id = code.replace("ob", "");
            console.log(id);
            //console.log(region);
        }
    });

    svg = $(".jvectormap-container")[0].children[0];
    var paths = svg.children[1].children;
    for (var i = 0; i < paths.length; i++) {
        var dataCode = paths[i].getAttribute("data-code");
        paths[i].setAttribute("id", dataCode);
    }
})
