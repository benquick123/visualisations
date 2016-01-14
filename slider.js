var prevYear = 2014;

function initSlider() {
    var sliderDiv = $("#sliderDiv");

    for(var i = 2007; i < 2015; i++) {
        var left = 5 + (i-2007)*(90/7);
        var color = i == year ? "#47A57D" : "#FFFFFF";
        var textYear = '<span id="text' + i +'" class="sliderText" style="left:' + left + '%; color:' + color + ';">' + i +'</span>';
        sliderDiv.append(textYear);
    }
    $("#range").change(onRangeChange);

    //console.log("OK");
}

function onRangeChange() {
    var year = $("#range")[0].value;
    loadData(year);
    d3.select("#text" + prevYear).transition().style("color", "#FFFFFF").duration(250);
    d3.select("#text" + year).transition().style("color", "#47A57D").duration(250);
    prevYear = year;
}