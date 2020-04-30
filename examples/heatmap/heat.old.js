var heatEntity = null;
var heatmapInstance = null;
var heatCanvas = null;
var _heatWidth, _heatHeight;
var overEntity = null;

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
				color: Cesium.Color.WHITE.withAlpha(0.3)
			})
		}
	});
}

function heatMapCall(hetData, heatWidth, heatHeight) {
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

			/* material: new Cesium.CallbackProperty(function(time, result) {
				if (heatCanvas && heatCanvas.length > 0) {
					return new Cesium.ImageMaterialProperty({
						image: heatCanvas[0],
						transparent: true,
						color: Cesium.Color.WHITE.withAlpha(0.3)
					});
				}
				return null;
			}, false) */

			/* material: new Cesium.ImageMaterialProperty({
				image: new Cesium.CallbackProperty(function(time, result) {
					if (heatCanvas && heatCanvas.length > 0) {
						// return heatCanvas[0]
						return $('.heatmap-canvas')[0]
					}
					return null;
				}, false),
				// image: heatCanvas[0],
				transparent: true,
				color: Cesium.Color.WHITE.withAlpha(0.3)
			}) */
			// material: heatmapInstance._renderer.canvas
			zIndex: 1,
			material: new Cesium.ImageMaterialProperty({
				image: new Cesium.CallbackProperty(function(time, result) {
					return heatmapInstance._renderer.canvas
				}, false),
				// image: heatCanvas[0],
				transparent: true,
				color: Cesium.Color.WHITE.withAlpha(0.3)
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

	// heatEntity.rectangle.material.image = heatmapInstance._renderer.canvas;

	let timeProperty = new Cesium.TimeIntervalCollectionProperty();
	let tick = viewer.clock.currentTime;;
	timeProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: tick,
		stop: Cesium.JulianDate.addSeconds(tick, 0.1, new Cesium.JulianDate()),
		isStartIncluded: true,
		isStopIncluded: false,
		data: Cesium.Color.WHITE.withAlpha(0.1)
	}));
	timeProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: Cesium.JulianDate.addSeconds(tick, 0.1, new Cesium.JulianDate()),
		stop: Cesium.JulianDate.addSeconds(tick, 0.2, new Cesium.JulianDate()),
		isStartIncluded: true,
		isStopIncluded: false,
		data: Cesium.Color.WHITE.withAlpha(0.2)
	}));
	timeProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: Cesium.JulianDate.addSeconds(tick, 0.2, new Cesium.JulianDate()),
		stop: Cesium.JulianDate.addSeconds(tick, 0.3, new Cesium.JulianDate()),
		isStartIncluded: false,
		isStopIncluded: true,
		data: Cesium.Color.WHITE.withAlpha(0.3)
	}));

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
				image: heatCanvas[0],
				transparent: true,
				color: timeProperty
			})
		}
	});

	let hideProperty = new Cesium.TimeIntervalCollectionProperty();
	let tickNew = viewer.clock.currentTime;

	hideProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: tickNew,
		stop: Cesium.JulianDate.addSeconds(tickNew, 0.1, new Cesium.JulianDate()),
		isStartIncluded: true,
		isStopIncluded: false,
		data: Cesium.Color.WHITE.withAlpha(0.2)
	}));
	hideProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: Cesium.JulianDate.addSeconds(tickNew, 0.1, new Cesium.JulianDate()),
		stop: Cesium.JulianDate.addSeconds(tickNew, 0.2, new Cesium.JulianDate()),
		isStartIncluded: true,
		isStopIncluded: false,
		data: Cesium.Color.WHITE.withAlpha(0.1)
	}));
	hideProperty.intervals.addInterval(new Cesium.TimeInterval({
		start: Cesium.JulianDate.addSeconds(tickNew, 0.2, new Cesium.JulianDate()),
		stop: Cesium.JulianDate.addSeconds(tickNew, 0.3, new Cesium.JulianDate()),
		isStartIncluded: false,
		isStopIncluded: true,
		data: Cesium.Color.WHITE.withAlpha(0)
	}));


	if (heatEntity) {
		heatEntity.rectangle.material.color = hideProperty;
		setTimeout(() => {
			viewer.entities.remove(heatEntity)
			heatEntity = Cesium.clone(overEntity);
		}, 400);
	}
}

function refreshCall(data) {
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
	heatMapCall: heatMapCall,
	refreshCall: refreshCall,
	delHeatMap: delHeatMap
}
