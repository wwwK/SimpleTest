function getHandler() {
	if (!window.handler) {
		window.handler = new Cesium.ScreenSpaceEventHandler(
			viewer.scene.canvas
		);
	}
}


function addMoveListener() {
	getHandler();
	//鼠标移动事件
	window.handler.setInputAction(function(e) {
			var pick = this.viewer.scene.pick(e.endPosition);
			if (pick != undefined) {
				console.log(pick);
			}
		},
		Cesium.ScreenSpaceEventType.MOUSE_MOVE
	);
}
