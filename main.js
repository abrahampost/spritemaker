var isDown = false;
selecting = false;
var bitmap;

$(function() {
	bitmap = $("#bitmap");
	generateGrid();
	generateHexCodes();
	$("#eyedropper").on("click", function(){
		selecting = true;
	});

});

function copy() {
	bitmap.select();
	document.execCommand('copy');
}

function load() {
	var bitmapValues = bitmap.val();
	var hexcodes = bitmapValues.split("\n");
	if(hexcodes.length != 256){ 
		alert("Invalid number of lines. Found " + hexcodes.length + ", expected 256");
		return;
	}
	var tiles = $(".tile");
	for(var i = 0; i < tiles.length; i++){
		var hexcode = "#";
		if(hexcodes[i].length != 3){
			alert("Invalid hexcode at line " + (i + 1));
			return;
		}
		for(var j = 0; j < 3; j++){
			hexcode += hexcodes[i][j];
			hexcode += hexcodes[i][j];
		}
		$(tiles[i]).css("background-color", hexcode);
	}
}

function generateGrid() {
	$(".tiles").html("");
	var x = 16;
	var y = 16;

	for(var i = 0; i < x; i++) {
		var row = $('<div class = "row">');
		for(var j = 0; j < y; j++) {
			$(row).append('\t<div class = "tile border"></div>')
		}
		$(".tiles").append(row);
	}

	$(".tile").mousedown(function() {
		isDown = true;
	});

	$(document).mouseup(function() {
		isDown = false;
	});

	$(".tile").on("mousedown", function() {
		if(selecting){
			var color = colorToHex($(this).css("background-color"));
			$("#colorizer").val(color);
			selecting = false;
			$(".tiles").css("cursor", "default")
			return;
		}
		var color = $("#colorizer").val();
		$(this).css("background-color", color);
	});

	$(".tile").on("mouseover", function() {
		var color = $("#colorizer").val();
		if(isDown) {
			$(this).css("background-color", color);
		}
		if(selecting) {
			$(".tiles").css("cursor", "crosshair");
		}
	});
}

function colorBoard(){
	var color = $("#colorizer").val();
	$(".tile").css("background-color", color);
}

function generateHexCodes(){
	var tiles = $(".tile");
	var bitmap = "";
	for(var i = 0; i < tiles.length - 1; i++){
		var color = $(tiles[i]).css("background-color");
		bitmap += convertFromRGB(color) + "\n";
	}
	bitmap += convertFromRGB($(tiles[tiles.length - 1]).css("background-color"));
	$("#bitmap").val(bitmap);
}

function convertFromRGB(color){
	var colors = color.split(",");
	var red = parseInt(colors[0].replace(/[^\d.]/g, '' ));
	var green = parseInt(colors[1].replace(/[^\d.]/g, '' ));
	var blue = parseInt(colors[2].replace(/[^\d.]/g, '' ));
	hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd' ,'e', 'f'];
	code = hex[parseInt(red / 16)] + hex[parseInt(green / 16)] + hex[parseInt(blue / 16)];
	return code;
}

function toggleBorder(){
	$(".tile").toggleClass("border");
}

function colorToHex(color) {
    var rgb = color.substring(4, color.length - 1).split(",").map(x => parseInt(x));
    var hex = "#";
    rgb.forEach(function(d){
    	if(d < 16){
    		hex += "0";
    	}
    	hex += d.toString(16);
    })
    return hex;
};