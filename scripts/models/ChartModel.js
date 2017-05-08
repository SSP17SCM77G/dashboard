class ChartModel {

	constructor(type, ctx, labels, data) {
		this._type = type;
		this._ctx = ctx;
		this._labels = labels;
		this._cdata = data;
		this._chartStyleModel = new ChartStyleModel();
	}

	plotGraph() {
		let _cdatasets = [];
		let _chartStyleModel = this._chartStyleModel;
		this._cdata.forEach(function(dataObj) {
			let dataSet = {
				label:'Data',
				data: [],
				backgroundColor: [],
				borderWidth: 1
			};
			let label = dataObj.key;
			let data =  dataObj.data;

			if(label) {
				dataSet.label = label;
			}	
			dataSet.data = data;
			let randClrGen = new RandomColorGenerator();
			dataSet.backgroundColor = randClrGen.getNRandmColors(data.length);
			_cdatasets.push(dataSet);
		});
		
		let _options = this._chartStyleModel.getOptions();
		let myChart = new Chart(this._ctx, {
            type: this._type,
            data: {
                labels: this._labels,
                datasets: _cdatasets
            },
            options: _options
        });
	}

	setType(type) {
		this._type = type;
	}

	setCtx(ctx) {
		this._ctx = ctx;
	}

	setLabels(labels) {
		this._labels = labels;
	}

	setData(Data) {
		this._cdata = data;
	}

	setChartStyleModel(styleModel) {
		this._chartStyleModel = styleModel;
	}

	getType() {
		return this._type;
	}

	getCtx() {
		return this._ctx;
	}

	getLabels() {
		return this._labels;
	}

	getData() {
		return this._cdata;
	}

	getChartStyleModel() {
		return this._chartStyleModel;
	}
}