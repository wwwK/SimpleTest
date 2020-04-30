var Color = Cesium.Color;
var defaultValue = Cesium.defaultValue;
var defined = Cesium.defined;
var defineProperties = Cesium.defineProperties;
var Event = Cesium.Event;
var createPropertyDescriptor = Cesium.createPropertyDescriptor;
var Property = Cesium.Property;
var Material = Cesium.Material;

var defaultColor = Color.WHITE;

function PolylineTrailMaterialProperty(options) {
	this._definitionChanged = new Cesium.Event();
	this._color = undefined;
	this._colorSubscription = undefined;
	this.color = options.color;
	this.duration = options.duration;
	this.image = options.image;
	this._time = (new Date()).getTime();
}

Cesium.defineProperties(PolylineTrailMaterialProperty.prototype, {
	isConstant: {
		get: function() {
			return false;
		}
	},

	definitionChanged: {
		get: function() {
			return this._definitionChanged;
		}
	},
	color: Cesium.createPropertyDescriptor('color')
});

PolylineTrailMaterialProperty.prototype.getType = function(time) {
	return 'PolylineTrail';
}

PolylineTrailMaterialProperty.prototype.getValue = function(time, result) {
	if (!Cesium.defined(result)) {
		result = {};
	}

	result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
	result.image = this.image;
	result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
	return result;
}

PolylineTrailMaterialProperty.prototype.equals = function(other) {
	return this === other || (other instanceof PolylineTrailMaterialProperty && Cesium.Property.equals(this._color, other
		._color))
}

Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty;
Cesium.Material.PolylineTrailType = 'PolylineTrail';
Cesium.Material.PolylineTrailImage = "./sampledata/images/colors.png";
Cesium.Material.PolylineTrailSource =
	"czm_material czm_getMaterial(czm_materialInput materialInput)\n\{\n\
	czm_material material = czm_getDefaultMaterial(materialInput);\n\
	vec2 st = materialInput.st;\n\
	vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
	material.alpha = colorImage.a * color.a;\n\
	material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
	return material;\n\
	}";

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
	type: Cesium.Material.PolylineTrailType,
	uniforms: {
		color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
		image: this.image,
		time: 10
	},
	source: Cesium.Material.PolylineTrailSource,
	translucent: function(material) {
		return true;
	}
});
