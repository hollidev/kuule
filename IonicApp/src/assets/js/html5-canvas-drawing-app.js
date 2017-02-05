// Copyright 2010 William Malone (www.williammalone.com)
// Heavily modified (reduced funtionality) - 2017 Nina Kuisma (kuule.then.fi)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var canvasWidth = window.innerWidth;
var canvasHeight = 300;
var padding = 25;
var lineWidth = 8;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorBlack = "#000000";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();
var clickX = [];
var clickY = [];
var clickColor = [];
var clickTool = [];
var clickSize = [];
var clickDrag = [];
var paint = false;
var curColor = colorBlack;
var curTool = "marker";
var curSize = "normal";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 5;
var drawingAreaY = 5;
var drawingAreaWidth = canvasWidth;
var drawingAreaHeight = canvasHeight;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = {};
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
    if(document.getElementById("canvas") != null) {
        document.getElementById("canvas").remove();
    }
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
    clickX = [];
    clickY = [];
    clickColor = [];
    clickTool = [];
    clickSize = [];
    clickDrag = [];
	//     context = document.getElementById('canvas').getContext("2d");
	
	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop*2;
		
		if(mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight)
		{
			// Mouse click location on drawing area
		}
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	$('#canvas').bind('touchstart', function(e) {
		e.preventDefault();
		// Mouse down location
		var mouseX = e.touches[0].pageX - this.offsetLeft;
		var mouseY = e.touches[0].pageY - this.offsetTop*2;
		
		if(mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight)
		{
			// Mouse click location on drawing area
		}
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
		
	});
	$('#canvas').bind('touchmove', function(e) {
		if(paint==true){
			addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop*2, true);
			redraw();
		}
	});
	$('#canvas').mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop*2, true);
			redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
	  	redraw();
	});
	
	$('#canvas').mouseleave(function(e){
		paint = false;
	});
    clearCanvas();
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
* Redraws the canvas.
*/
function redraw()
{
	// Make sure required resources are loaded before redrawing
	
	clearCanvas();
	
	var locX;
	var locY;
	
	if(curSize == "small"){
		locX = 467;
	}else if(curSize == "normal"){
		locX = 450;
	}else if(curSize == "large"){
		locX = 428;
	}else if(curSize == "huge"){
		locX = 399;
	}
	locY = 189;
	context.beginPath();
	// context.rect(locX, locY, 2, 12);
	context.closePath();
	context.fillStyle = '#333333';
	context.fill();	
	
	// Keep the drawing in the drawing area
	context.save();
	context.beginPath();
	context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	context.clip();
		
	var radius;
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}else if(clickSize[i] == "huge"){
			radius = 20;
		}else{
			alert("Error: Radius is zero for click " + i);
			radius = 0;	
		}
		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		
		if(clickTool[i] == "eraser"){
			//context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
			context.strokeStyle = 'white';
		}else{
			//context.globalCompositeOperation = "source-over";	// To erase instead of draw over with white
			context.strokeStyle = clickColor[i];
		}
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
		
	}
	//context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
	context.restore();
	
	// Overlay a crayon texture (if the current tool is crayon)
	context.globalAlpha = 1; // No IE support
}


/**/
