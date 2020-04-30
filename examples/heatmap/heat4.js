var heatEntity = null;
var heatmapInstance = null;
var heatCanvas = null;
var _heatWidth, _heatHeight;
var overEntity = null;
let hideProperty = new Cesium.SampledProperty(Cesium.Color);
let showProperty = new Cesium.SampledProperty(Cesium.Color);
let latMin, latMax, lonMin, lonMax;
function heatMap(hetData, heatWidth, heatHeight) {

	var points = [];

	var max = 10;
	latMin = Math.min.apply(Math, hetData.map(function(o) {
		return o.lat
	}));
	latMax = Math.max.apply(Math, hetData.map(function(o) {
		return o.lat
	}));
	lonMin = Math.min.apply(Math, hetData.map(function(o) {
		return o.lon
	}));
	lonMax = Math.max.apply(Math, hetData.map(function(o) {
		return o.lon
	}));

	var _heatWidth = (lonMax - lonMin) * heatWidth;
	var _heatHeight = (latMax - latMin) * heatHeight;

	for (var i = 0; i < hetData.length; i++) {
		var dataItem = hetData[i];
		var point = {
			x: ((dataItem.lon - lonMin) / (lonMax - lonMin)) * _heatWidth,
			y: (Math.abs((dataItem.lat - latMax)) / (latMax - latMin)) * _heatHeight,
			value: Math.floor(dataItem.value)
		};
		max = Math.max(max, dataItem.value);
		points.push(point);
	}
	heatmapInstance = h337.create({
		container: document.getElementById("heatmap"),
		gradient: {
			'.1': 'blue',
			'.4': 'green',
			'.7': 'yellow',
			'.95': 'red'
		},
		maxOpacity: .8,
		minOpacity: .7,
		radius: 100 //半径
	});

	var data = {
		max: max,
		data: points
	};
	//
	heatmapInstance.setData(data);

	window.viewer._cesiumWidget._creditContainer.style.display = "none";
	this.entities = window.viewer.entities;
	const entities = window.viewer.entities;
	heatCanvas = document.getElementsByClassName("heatmap-canvas");



	// console.log(canvas);
	heatEntity = entities.add({
		rectangle: {
			coordinates: Cesium.Rectangle.fromDegrees(
				lonMin,
				latMin,
				lonMax,
				latMax
			),
			material: new Cesium.ImageMaterialProperty({
				image: new Cesium.CallbackProperty(function(time) {
					debugger
				//	return heatmapInstance._renderer.canvas;
				}, false),
				transparent: true,
				color: Cesium.Color.WHITE.withAlpha(0.5)
			})
		}
	});
}

function refreshData(data) {
	var points = [];
	for (var i = 0; i < data.length; i++) {
		var dataItem = data[i];
		var point = {
			x: ((dataItem.lon - lonMin) / (lonMax - lonMin)) * _heatWidth,
			y: (Math.abs((dataItem.lat - latMax)) / (latMax - latMin)) * _heatHeight,
			value: Math.floor(dataItem.value)
		};
		points.push(point);
	}

	if (heatmapInstance) {
		heatmapInstance.addData(points);
	}
}

//删除热力
function delHeatMap() {
	document.getElementById("heatmap").innerHTML = "";
	let that = this;
	if (heatEntity) {
		that.entities.remove(heatEntity)
		heatEntity = null;
	}
}

window.heat = {
	heatMap: heatMap,
	refreshData: refreshData,
	delHeatMap: delHeatMap
}
