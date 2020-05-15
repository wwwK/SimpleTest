export default class ColorLadder {
  constructor(color1, color2, color3) {
    //区域着色颜色
    
    this.color1 = this.Hex2Rgb(color1);
    this.color2 = this.Hex2Rgb(color2);
    this.color3 = this.Hex2Rgb(color3);

    //阶梯参数
    this.ladder = null;
  }

  Hex2Rgb(hex) {
    hex = hex.replace("#", "");
    let color = {
      R: parseInt(hex.substring(0, 2), 16),
      G: parseInt(hex.substring(2, 4), 16),
      B: parseInt(hex.substring(4, 6), 16),
    };
    return color;
  }

  Rgb2Hex(rgb) {
    let color = "#";
    for (const key in rgb) {
      color += rgb[key].toString(16);
    }
    return color;
  }

  getMaxMin(objArr, propName) {
    if (objArr.length == 0) {
      return {
        max: 0,
        min: 0,
        center: 0,
      };
    }
    //倒序排列
    objArr.sort((prev, next) => {
      return next[propName] - prev[propName];
    });
    let len = objArr.length;
    this.ladder = {
      max: objArr[0][propName],
      min: objArr[len - 1][propName],
      center: (objArr[len - 1][propName] + objArr[0][propName]) / 2,
    };
    return this.ladder;
  }

  getColorV(from, to, dataMin, dataMax, dataCurrent) {
    let ratio = "";
    if (dataCurrent <= dataMin) {
      ratio = from;
    } else if (from == to || dataCurrent >= dataMax) {
      ratio = to;
    } else {
      ratio =
        ((to - from) / (dataMax - dataMin)) * (dataCurrent - dataMin) + from;
    }
    let colorV = parseInt(ratio).toString(16);
    colorV = this.padLeft(colorV, 2, "0");
    return colorV;
  }

  padLeft(str, len, charStr) {
    return new Array(len - str.length + 1).join(charStr || "") + str;
  }

  getColor(value) {
    let fillColor = "";
    let R, G, B;
    if (this.ladder.max == this.ladder.min) {
      return this.Rgb2Hex(this.color3);
    } else if (value < this.ladder.center) {
      R = this.getColorV(
        this.color1.R,
        this.color2.R,
        this.ladder.min,
        this.ladder.center,
        value
      );
      G = this.getColorV(
        this.color1.G,
        this.color2.G,
        this.ladder.min,
        this.ladder.center,
        value
      );
      B = this.getColorV(
        this.color1.B,
        this.color2.B,
        this.ladder.min,
        this.ladder.center,
        value
      );
    } else {
      R = this.getColorV(
        this.color2.R,
        this.color3.R,
        this.ladder.center,
        this.ladder.max,
        value
      );
      G = this.getColorV(
        this.color2.G,
        this.color3.G,
        this.ladder.center,
        this.ladder.max,
        value
      );
      B = this.getColorV(
        this.color2.B,
        this.color3.B,
        this.ladder.center,
        this.ladder.max,
        value
      );
    }

    fillColor = "#" + R + G + B;
    return fillColor;
  }
}
