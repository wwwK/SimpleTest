/**
 * 动态扩散圆纹理
 * @param {} color 颜色
 * @param {} duration 持续时间毫秒
 **/
function AddBubbleMaterial () {
	//改造，加延时参数
	function BubbleFadeMaterialProperty (color, duration, delay) {
		this._definitionChanged = new Cesium.Event();
		this._color = undefined;
		this._colorSubscription = undefined;
		this.color = color;
		this.duration = duration;
		this._delay = delay;
		this._time = new Date().getTime();
	}

	Cesium.defineProperties(BubbleFadeMaterialProperty.prototype, {
		isConstant: {
			get: function () {
				return false;
			},
		},
		definitionChanged: {
			get: function () {
				return this._definitionChanged;
			},
		},
		color: Cesium.createPropertyDescriptor("color"),
	});
	BubbleFadeMaterialProperty.prototype.getType = function (time) {
		return "BubbleFade";
	};
	BubbleFadeMaterialProperty.prototype.getValue = function (time, result) {
		if (!Cesium.defined(result)) {
			result = {};
		}
		result.color = Cesium.Property.getValueOrClonedDefault(
			this._color,
			time,
			Cesium.ColorWHITE,
			result.color
		);
		result.time =
			((new Date().getTime() - this._time) % this.duration) / this.duration;

		//添加delay
		result.delay = this._delay;
		return result;
	};

	BubbleFadeMaterialProperty.prototype.equals = function (other) {
		return (
			this === other ||
			(other instanceof BubbleFadeMaterialProperty &&
				Cesium.Property.equals(this._color, other._color))
		);
	};

	Cesium.BubbleFadeMaterialProperty = BubbleFadeMaterialProperty;

	Cesium.Material.BubbleFadeMaterialType = "BubbleFade";
	// 自定义着色器
	Cesium.Material.BubbleFadeSource =
		"czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
		"{\n" +
		"  czm_material material = czm_getDefaultMaterial(materialInput);\n" +
		// 反射
		"  material.diffuse = 1.5 * color.rgb;\n" +
		// 纹理坐标值
		"  vec2 st = materialInput.st;\n" +
		"  float dis = distance(st, vec2(0.5, 0.5));\n" +
		"  float per = fract(time);\n" +
		"  if(dis > per * 0.5) {\n" +
		//测试下面效果，会发现神奇的东西
		// "  if(dis < per * 0.5) {\n" +
		"    material.alpha = 0.0;\n" +
		// 丢弃，不绘制片段
		//"    discard;\n" +
		"  }" +
		//  add 加上这段防止全局透明度处理。让中心完全透明度
		/* "else if(dis ){\n" +
		"    material.alpha = color.a * dis / per / 1.0;\n" +
		"  }\n" + */
		// add end

		// add delay 效果
		"else if(delay&& time<delay){\n" +
		"    material.alpha = 0.0;\n" +
		"    discard;\n" +
		"  }\n"
	"else{\n" +
	"    material.alpha = color.a * dis / per / 1.0;\n" +
	"  }\n" +
	"  return material;\n" +
	"}";

	Cesium.Material._materialCache.addMaterial(
		Cesium.Material.BubbleFadeMaterialType, {
			fabric: {
				type: Cesium.Material.BubbleFadeMaterialType,
				uniforms: {
					color: new Cesium.Color(1.0, 0.0, 0.0, 1),
					time: 0,
				},
				source: Cesium.Material.BubbleFadeSource,
			},
			translucent: function (material) {
				return true;
			},
		}
	);

	return BubbleFadeMaterialProperty;
}

export default AddBubbleMaterial;
