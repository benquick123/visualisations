var selectedCAT = new Array();
var toggleOn = false;
function byColumn(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}
function onButtonClick(){
    var categoriesDIV = d3.select("#categories-container");
    if (toggleOn) {
        categoriesDIV.style("left", "300px").transition().duration(250).style("left", "0px");
        toggleOn = false;
    }
    else {
        categoriesDIV.style("left", "0px").transition().duration(300).style("left", "300px");
        toggleOn = true;
    }
}
function loadCategories(idCategories) {
    var categoriesDIV = $("#categories")[0];
    var inner = "";
    for (var cat in idCategories) {
        if (cat.length == 2) {
            inner += '<div id="cat' + cat + '" class="cat_single">';
            inner += "["+cat+"] "+idCategories[cat].toLowerCase().replace(" ", "");
            inner += '</div>';
        }
    }
    categoriesDIV.innerHTML = inner;
    d3.select("#toggleButton").on("click",onButtonClick);
    d3.select("#categories").selectAll("div").on("click", onCategoryMouseClick);
    d3.select("#categories").selectAll("div").on("mouseover", onCategoryMouseOver);
    d3.select("#categories").selectAll("div").on("mouseout", onCategoryMouseOut);
}

function onCategoryMouseOver() {
    if (selectedCAT[this.getAttribute("id")] == null)
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
}

function onCategoryMouseClick() {
    if (selectedCAT[this.getAttribute("id")] == null) {
        selectedCAT[this.getAttribute("id")] = this;
        d3.select(this).transition().duration(250).style("background-color", "#AA2A23");
        colorMapWithData(selectedCAT);
    }
    else {
        delete selectedCAT[this.getAttribute("id")];
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
        colorMapWithData(selectedCAT);
    }
}

function onCategoryMouseOut() {
    if (selectedCAT[this.getAttribute("id")] == null)
        d3.select(this).transition().duration(250).style("background-color", "#4A4A4A");
}

function colorMapWithData(selectedCAT) {
    if (Object.keys(selectedCAT).length == 0) {
        for (var obcina in idObcine) {
            d3.select("#ob" + obcina).transition().duration(250).style("fill", "rgb(136, 136, 136)");//.style("fill-opacity", "1");
        }
    }
    else {
        var paths = svg.children[1].children;
        var sumObcine = new Array(Object.keys(idObcine).length + 2).join('0').split('').map(parseFloat);
        for (var cat in selectedCAT) {
            cat = cat.replace("cat", "");
            console.log(cat);
            for (var obcina in idObcine) {
                sumObcine[obcina-1] += masterTable[obcina-1][cat];
            }
        }

        var min = 1, max = 0;
        for (var obcina in idObcine) {
            sumObcine[obcina-1] /= masterTable[obcina-1]["sum"];
            if (sumObcine[obcina-1] > max)
                max = sumObcine[obcina-1];
            else if (sumObcine[obcina-1] < min)
                min = sumObcine[obcina-1];
        }

        //console.log(sumObcine);

        console.log(max);
        console.log(min);

        var max1 = 0, min1 = 1;

        for (var obcina in idObcine) {
            sumObcine[obcina-1] = (sumObcine[obcina-1]) / (max);
            if (sumObcine[obcina-1] > max1)
                max1 = sumObcine[obcina-1];
            else if (sumObcine[obcina-1] < min1)
                min1 = sumObcine[obcina-1];
        }


        //console.log(max1);
        console.log(sumObcine);


       // console.log(sumObcine);
        var r, g, b;
        for (var obcina in idObcine) {
            r = 136 * (1-sumObcine[obcina-1]) + 22 * (sumObcine[obcina-1]);
            g = 136 * (1-sumObcine[obcina-1]) + 146 * (sumObcine[obcina-1]);
            b = 136 * (1-sumObcine[obcina-1]) + 44 * (sumObcine[obcina-1]);
            d3.select("#ob" + obcina).transition().duration(250).style("fill", "rgb(" + r + "," + g + "," + b + ")");    //"rgb(22, 146, 44)");//.style("fill-opacity", sumObcine[obcina-1]);
        }
    }

}