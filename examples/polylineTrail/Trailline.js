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
"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    vec2 st = materialInput.st;\n\
    if(texture2D(image, vec2(0.0, 0.0)).a == 1.0){\n\
        discard;\n\
    }else{\n\
         material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
    }\n\
    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
    return material;\n\
}";

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
	fabric: {
		type: Cesium.Material.PolylineTrailType,
		uniforms: {
			color: new Cesium.Color(1.0, 0.0, 0.0, 0.8),
			image: Cesium.Material.PolylineTrailImage,
			time: 0
		},
		source: Cesium.Material.PolylineTrailSource
	},
	translucent: function(material) {
		return true;
	}
});
