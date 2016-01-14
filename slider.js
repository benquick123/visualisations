function initSlider() {
    var sliderDiv = $("#sliderDiv");

    for(var i = 2007; i < 2015; i++) {
        var left = 5 + (i-2007)*(90/7);
        var color = i == year ? "#AA2A23" : "white";
        var textYear = '<span class="sliderText" style="left:' + left + '%; color:' + color + '">' + i +'</span>';
        sliderDiv.append(textYear);
    }
    $("#range").change(onRangeChange);

    //console.log("OK");
}

function onRangeChange() {
    var year = $("#range")[0].value;
    loadData(year);
    //console.log($("#range")[0].value);
}