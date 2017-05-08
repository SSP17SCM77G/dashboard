class ChartStyleModel {

	constructor() {
		this._options = {};
		this._backgroundColors = [];
		this._borderWidth = 1;
	}

	setOptions(options) {
		this._options = options;
	}

	setBackgroundColors(colors) {
		this._backgroundColors = colors;
	}

	setBorderWidth(width) {
		this._borderWidth = width;
	}

	getOptions() {
		return this._options;
	}

	getBackgroundColors() {
		return this._backgroundColors;
	}

	getBorderWidth() {
		return this._borderWidth;
	}	
	
}