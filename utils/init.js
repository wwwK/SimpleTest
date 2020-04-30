function initEngine() {
	let viewer = new Cesium.Viewer('mapContainer', {
		baseLayerPicker: false,
		//播放
		shouldAnimate: true,
		imageryProvider: new Cesium.createTileMapServiceImageryProvider({
			url: "http://10.0.0.116:8082/Drawing/DHGStreet_World_00-09_P7/"
			// url: "http://10.1.0.34:8736/DHGStreet_World_00-09_Blue/"
		})
	});

	viewer.scene.imageryLayers.addImageryProvider(
		new Cesium.createTileMapServiceImageryProvider({
			// url: "http://10.0.0.116:8082/Drawing/DHGStreet_BeiJing_10-19_P7/"
			url: "http://10.0.0.116:8082/Drawing/DHGStreet_BeiJing_10-19_P7/"
		})
	);

	window.viewer = viewer;
}

setTimeout(initEngine, 0);

function done() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, 100);
	})
}
