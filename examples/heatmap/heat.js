var heatEntity = null;
var heatmapInstance = null;
var heatCanvas = null;
var _heatWidth, _heatHeight;
var overEntity = null;
let hideProperty = new Cesium.SampledProperty(Cesium.Color);
let showProperty = new Cesium.SampledProperty(Cesium.Color);

function heatMap(hetData, heatWidth, heatHeight) {
	_heatWidth = heatWidth;
	_heatHeight = heatHeight;
	var points = [];

	var max = 10;
	var latMin = Math.min.apply(Math, hetData.map(function(o) {
		return o.lat
	}));
	var latMax = Math.max.apply(Math, hetData.map(function(o) {
		return o.lat
	}));
	var lonMin = Math.min.apply(Math, hetData.map(function(o) {
		return o.lon
	}));
	var lonMax = Math.max.apply(Math, hetData.map(function(o) {
		return o.lon
	}));

	var width = (lonMax - lonMin) * heatWidth;
	var height = (latMax - latMin) * heatHeight;

	for (var i = 0; i < hetData.length; i++) {
		var dataItem = hetData[i];
		var point = {
			x: ((dataItem.lon - lonMin) / (lonMax - lonMin)) * width,
			y: (Math.abs((dataItem.lat - latMax)) / (latMax - latMin)) * height,
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
				image: heatmapInstance._renderer.canvas, // heatCanvas[0],
				transparent: true,
				color: Cesium.Color.WHITE.withAlpha(0.5)
			})
		}
	});
}

function refreshData(data) {
	var points = [];

	var max = 10;
	var latMin = Math.min.apply(Math, data.map(function(o) {
		return o.lat
	}));
	var latMax = Math.max.apply(Math, data.map(function(o) {
		return o.lat
	}));
	var lonMin = Math.min.apply(Math, data.map(function(o) {
		return o.lon
	}));
	var lonMax = Math.max.apply(Math, data.map(function(o) {
		return o.lon
	}));

	var width = (lonMax - lonMin) * _heatWidth;
	var height = (latMax - latMin) * _heatHeight;

	for (var i = 0; i < data.length; i++) {
		var dataItem = data[i];
		var point = {
			x: ((dataItem.lon - lonMin) / (lonMax - lonMin)) * width,
			y: (Math.abs((dataItem.lat - latMax)) / (latMax - latMin)) * height,
			value: Math.floor(dataItem.value)
		};
		max = Math.max(max, dataItem.value);
		points.push(point);
	}

	var data = {
		max: max,
		data: points
	};

	if (heatmapInstance) {
		heatmapInstance.setData(data);
	}


	overEntity = window.viewer.entities.add({
		rectangle: {
			coordinates: Cesium.Rectangle.fromDegrees(
				lonMin,
				latMin,
				lonMax,
				latMax
			),
			zIndex: 2,
			material: new Cesium.ImageMaterialProperty({
				image: new Cesium.CallbackProperty(function() {
					return heatmapInstance._renderer.canvas;
				}, false), // heatCanvas[0],
				transparent: true,
				color: Cesium.Color.WHITE.withAlpha(0.5)
			})
		}
	});

	/* let now = viewer.clock.currentTime;
	showProperty.addSample(now, new Cesium.Color.WHITE.withAlpha(0.5));
	showProperty.addSample(Cesium.JulianDate.addSeconds(now, 1, new Cesium.JulianDate()), new Cesium.Color.WHITE.withAlpha(
		0));

	heatEntity.rectangle.material.color = showProperty; */
	viewer.entities.remove(heatEntity)
	heatEntity = Cesium.clone(overEntity);

}

//删除热力
function delHeatMap() {
	document.getElementById("heatmap").innerHTML = "";
	let that = this;
	if (heatArr) {
		heatArr.map((item) => {
			that.entities.remove(item)
		});
		heatArr = [];
	}
}

window.heat = {
	heatMap: heatMap,
	refreshData: refreshData,
	delHeatMap: delHeatMap
}
