var isDown = false;

$(function(){
	generateGrid();
});

function generateGrid(){
	$(".tiles").html("");
	var x = $("#x").val();
	var y = $("#y").val();

	for(var i = 0; i < x; i++){
		var row = $('<div class = "row">');
		for(var j = 0; j < y; j++){
			$(row).append('\t<div class = "tile"></div>')
		}
		$(".tiles").append(row);
	}

	$(".tile").mousedown(function(){
		isDown = true;
	});

	$(document).mouseup(function(){
		isDown = false;
	});

	$(".tile").on("mousedown", function(){
		var color = $("#colorizer").val();
		console.log(color);
		$(this).css("background-color", color);
	});

	$(".tile").on("mouseover", function(){
		var color = $("#colorizer").val();
		if(isDown){
			$(this).css("background-color", color);
		}
	});

	$("#copy").on("click",function(){
		$("#bitmap").readonly=false;
    	$("#bitmap").select();
   		document.execCommand('copy');
   		$("#bitmap").readonly=true;
	});
}

function colorBoard(){
	var color = $("#colorizer").val();
	$(".tile").css("background-color", color);
}

function generateBitmap(){
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