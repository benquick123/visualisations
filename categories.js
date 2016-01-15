var selectedCAT = new Array();
var toggleOn = false;
var normalisationButton = false;

function toggleNormButton(){
    if (!normalisationButton)   d3.select("#toggleNormalisationButton").text("Normalizacija po prebivalcih");
    else                        d3.select("#toggleNormalisationButton").text("Normalizacija po proračunu");

    colorMapWithData(selectedCAT);
    normalisationButton = !normalisationButton;
    console.log(normalisationButton);
}
function hideNormButton(){ d3.select("#toggleNormalisationButton").style("margin-left", "0px").style("opacity",0.8).transition().duration(200).style("margin-left", "-300px").style("opacity",0);}
function showNormButton(){ d3.select("#toggleNormalisationButton").style("margin-left", "-300px").style("opacity",0).transition().duration(200).style("margin-left", "0").style("opacity",0.8);}

function toggleSidebar(){
    var categoriesDIV = d3.select("#categories-container");
    if (toggleOn) {
        categoriesDIV.style("margin-left", "-300px").transition().duration(250).style("margin-left", "0px");
        $("#arrow")[0].src = "images/leftBig.svg";

        toggleOn = false;
    }
    else {
        categoriesDIV.style("margin-left", "0px").transition().duration(300).style("margin-left", "-300px");
        $("#arrow")[0].src = "images/rightBig.svg";
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

    var stylecat2 = 'style="white-space: nowrap; overflow:hidden; text-overflow: ellipsis; width: 77%;"';
    var stylecat3 = 'style="position:relative; left:22%; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; width: 77%;"';

    var hidden = 'style="display:none;"';

    for (var i = 0; i < catID.length; i++) {
        cat = catID[i];

        if (cat.length == 2) {
            inner += "<div id='cat-container" + cat + "' style='background-color:#585858; ' class='cat-container'>";
            inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + style + '><img src="images/right.svg"/></div>';
            inner += '<div id="cat' + cat + '" class="cat_single"' + style + '>';
        }
        else if (cat.length == 4) {
            inner += "<div id='cat-container" + cat + "' style='background-color:#585858; display:none;' class='cat-container' " + hidden + ">";
            inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + styleexpand2 + '><img src="images/right.svg"/></div>';
            inner += '<div id="cat' + cat + '" class="cat_single"' + stylecat2 + '>';
        }
        else if (cat.length == 8) {
            inner += "<div id='cat-container" + cat + "' style='background-color:#585858; display:none' class='cat-container' " + hidden + ">";
            //inner += '<div id="expand-cat' + cat + '" class="cat_expand"' + styleexpand3 + '></div>';
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

    for (var key in selectedCAT) {
        d3.select("#" + key).transition().style("background-color", "#AA2A23").duration(250);
    }

    colorMapWithData(selectedCAT);
}

function onExpandMouseOver() {
    d3.select(this).transition().duration(250).style("background-color", "#1D417E");
}

function onExpandMouseOut() {
    if (selectedCAT[this.getAttribute("id").replace("expand-", "")] == null)
        d3.select(this).transition().duration(250).style("background-color", "#585858");
    else
        d3.select(this).transition().duration(250).style("background-color", "#AA2A23");

}

function onExpandMouseClick() {
    var id = this.getAttribute("id").replace("expand-cat", "");
    var categories = d3.selectAll(".cat-container")[0];
    var visible = false;

    for (var i = 0; i < categories.length; i++) {
        var idi = categories[i].id.replace("cat-container", "").substring(0, id.length);
        //console.log();

        var divBlock = d3.select("#" + categories[i].id)[0][0];
        if (idi == id && categories[i].id.replace("cat-container", "").length == 2*id.length && divBlock.style.display == "none") {
            divBlock.style.display = "block";
            visible = true;

        }
        else if (idi == id && categories[i].id.replace("cat-container", "").length >= 2*id.length) {
            divBlock.style.display = "none";
        }
        if(visible) {
            $("#" + this.id).empty();
            $("#" + this.id).append('<img src="images/down.svg"/>');
        }
        else {
            $("#" + this.id).empty();
            $("#" + this.id).append('<img src="images/right.svg"/>');
        }

    }
    //console.log(id);
}

function onCategoryMouseOver() {
    if (selectedCAT[this.getAttribute("id")] == null) {
        d3.select("#cat-container" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#1D417E");
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
        d3.select("#expand-cat" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#1D417E");
    }
}

function onCategoryMouseClick() {
    if (selectedCAT[this.getAttribute("id")] == null) {
        selectedCAT[this.getAttribute("id")] = this;
        d3.select(this).transition().duration(250).style("background-color", "#AA2A23");
        d3.select("#cat-container" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#AA2A23");
        d3.select("#expand-cat" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#AA2A23");
        colorMapWithData(selectedCAT);
    }
    else {
        delete selectedCAT[this.getAttribute("id")];
        d3.select(this).transition().duration(250).style("background-color", "#1D417E");
        d3.select("#cat-container" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#1D417E");
        d3.select("#expand-cat" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#1D417E");
        colorMapWithData(selectedCAT);
    }
}

function onCategoryMouseOut() {
    if (selectedCAT[this.getAttribute("id")] == null) {
        d3.select("#cat-container" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#585858");
        d3.select(this).transition().duration(250).style("background-color", "#585858");
        d3.select("#expand-cat" + this.getAttribute("id").replace("cat", "")).transition().duration(250).style("background-color", "#585858");
    }
}

function colorMapWithData(selectedCAT) {
    if (Object.keys(selectedCAT).length == 0) {
        for (var obcina in idObcine) {
            d3.select("#ob" + obcina).transition().duration(250).style("fill", "rgb(136, 136, 136)");//.style("fill-opacity", "1");
        }
    }
    else {

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

        if (!normalisationButton){               // TODO normalisation toggle
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
        }
        else {
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
            }
        }


        var r, g, b;
        for (var obcina in idObcine) {
        //#147B4F
            r = 136 * (1-sumObcine[obcina-1]) + 20 * (sumObcine[obcina-1]);
            g = 136 * (1-sumObcine[obcina-1]) + 123 * (sumObcine[obcina-1]);
            b = 136 * (1-sumObcine[obcina-1]) + 79 * (sumObcine[obcina-1]);
            d3.select("#ob" + obcina).transition().duration(250).style("fill", "rgb(" + r + "," + g + "," + b + ")");    //"rgb(22, 146, 44)");//.style("fill-opacity", sumObcine[obcina-1]);
        }
    }

}