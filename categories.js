var selectedCAT = new Array();
var toggleOn = false;
var normalisationButton = false;
function toggleNormButton(){
    if (!normalisationButton)   d3.select("#toggleNormalisationButton").text("Prebivalci");
    else                        d3.select("#toggleNormalisationButton").text("Proračun");

    normalisationButton = !normalisationButton;
    console.log(normalisationButton);
}
function toggleSidebar(){
    var categoriesDIV = d3.select("#categories-container");
    if (toggleOn) {
        categoriesDIV.style("margin-left", "-300px").transition().duration(250).style("margin-left", "0px");
        toggleOn = false;
    }
    else {
        categoriesDIV.style("margin-left", "0px").transition().duration(300).style("margin-left", "-300px");
        toggleOn = true;
    }
}
function loadCategories(idCategories) {
    var categoriesDIV = $("#categories")[0];
    var inner = "";
    var catID = [];
    var i = 0;
    for (var cat in idCategories) {
        catID[i++] = cat;
    }
    catID.sort();

    var style = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis;"';

    var styleexpand2 = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis; margin-left: 10%;"';
    var styleexpand3 = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis; margin-left: 20%;"';

    var stylecat2 = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis; width: 77.3%;"';
    var stylecat3 = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis; width: 67.3%;"';

    var hidden = 'style="display:none;"';

    for (var i = 0; i < catID.length; i++) {
        cat = catID[i];

        if (cat.length == 2) {
            inner += "<div id='cat-container" + cat + "' class='cat-container'>";
            inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + style + '></div>';
            inner += '<div id="cat' + cat + '" class="cat_single"' + style + '>';
        }
        else if (cat.length == 4) {
            inner += "<div id='cat-container" + cat + "' class='cat-container' " + hidden + ">";
            inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + styleexpand2 + '></div>';
            inner += '<div id="cat' + cat + '" class="cat_single"' + stylecat2 + '>';
        }
        else if (cat.length == 8) {
            inner += "<div id='cat-container" + cat + "' class='cat-container' " + hidden + ">";
            inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + styleexpand3 + '></div>';
            inner += '<div id="cat' + cat + '" class="cat_single"' + stylecat3 + '>';
        }
        inner += "["+cat+"] "+idCategories[cat].toLowerCase().replace(" ", "");
        inner += '</div>';
        inner += "</div>";
    }

    categoriesDIV.innerHTML = inner;
    d3.select("#toggleButton").on("click",toggleSidebar);
    d3.select("#categories").selectAll("div.cat_single").on("click", onCategoryMouseClick);
    d3.select("#categories").selectAll("div.cat_single").on("mouseover", onCategoryMouseOver);
    d3.select("#categories").selectAll("div.cat_single").on("mouseout", onCategoryMouseOut);

    d3.select("#categories").selectAll("div.cat_expand").on("click", onExpandMouseClick);
    d3.select("#categories").selectAll("div.cat_expand").on("mouseover", onExpandMouseOver);
    d3.select("#categories").selectAll("div.cat_expand").on("mouseout", onExpandMouseOut);
}

function onExpandMouseOver() {
    d3.select(this).transition().duration(250).style("background-color", "#1D417E");
}

function onExpandMouseOut() {
    d3.select(this).transition().duration(250).style("background-color", "#4A4A4A");
}

function onExpandMouseClick() {
    var id = this.getAttribute("id").replace("expand-cat", "");
    var categories = d3.selectAll(".cat-container")[0];

    for (var i = 0; i < categories.length; i++) {
        var idi = categories[i].id.replace("cat-container", "").substring(0, id.length);
        //console.log();

        var divBlock = d3.select("#" + categories[i].id)[0][0];
        if (idi == id && categories[i].id.replace("cat-container", "").length == 2*id.length && divBlock.style.display == "none") {
            divBlock.style.display = "block";
        }
        else if (idi == id && categories[i].id.replace("cat-container", "").length >= 2*id.length)
            divBlock.style.display = "none";

    }
    //console.log(id);
}



function onCategoryMouseOver() {
    if (selectedCAT[this.getAttribute("id")] == null)
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
}

function onCategoryMouseClick() {
    if (selectedCAT[this.getAttribute("id")] == null) {
        selectedCAT[this.getAttribute("id")] = this;
        d3.select(this).transition().duration(250).style("background-color", "#AA2A23");
        d3.select("#expand-" + this.getAttribute("id")).transition().duration(250).style("background-color", "#AA2A23");
        colorMapWithData(selectedCAT);
    }
    else {
        delete selectedCAT[this.getAttribute("id")];
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
        d3.select("#expand-" + this.getAttribute("id")).transition().duration(250).style("background-color", "#4A4A4A");
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

        if (normalisationButton){}              // TODO normalisation toggle
        else {}


        var ido = 0;
        var paths = svg.children[1].children;
        var sumObcine = new Array(Object.keys(idObcine).length + 2).join('0').split('').map(parseFloat);
        for (var cat in selectedCAT) {
            cat = cat.replace("cat", "");
            //console.log(cat);
            for (var obcina in idObcine) {
                ido = obcina > 144 ? 1 : 0;
                sumObcine[obcina-1] += masterTable[obcina-ido-1][cat];
            }
        }

        var min = 1, max = 0;
        for (var obcina in idObcine) {
            sumObcine[obcina-1] /= prebivalci[obcina];
            if (sumObcine[obcina-1] > max)
                max = sumObcine[obcina-1];
            else if (sumObcine[obcina-1] < min)
                min = sumObcine[obcina-1];
        }

        for (var obcina in idObcine) {
            sumObcine[obcina-1] = (sumObcine[obcina-1] - min) / (max - min);
        }

        var r, g, b;
        for (var obcina in idObcine) {
            r = 136 * (1-sumObcine[obcina-1]) + 22 * (sumObcine[obcina-1]);
            g = 136 * (1-sumObcine[obcina-1]) + 146 * (sumObcine[obcina-1]);
            b = 136 * (1-sumObcine[obcina-1]) + 44 * (sumObcine[obcina-1]);
            d3.select("#ob" + obcina).transition().duration(250).style("fill", "rgb(" + r + "," + g + "," + b + ")");    //"rgb(22, 146, 44)");//.style("fill-opacity", sumObcine[obcina-1]);
        }
    }

}

         /*
        var min = 1, max = 0;
        for (var obcina in idObcine) {
            ido = obcina > 144 ? 1 : 0;
            sumObcine[obcina-1] /= masterTable[obcina-ido-1]["sum"];
            if (sumObcine[obcina-1] > max)
                max = sumObcine[obcina-1];
            else if (sumObcine[obcina-1] < min)
                min = sumObcine[obcina-1];
        }

        var max1 = 0, min1 = 1;

        for (var obcina in idObcine) {
            sumObcine[obcina-1] = (sumObcine[obcina-1]) / (max);
            if (sumObcine[obcina-1] > max1)
                max1 = sumObcine[obcina-1];
            else if (sumObcine[obcina-1] < min1)
                min1 = sumObcine[obcina-1];
        }*/