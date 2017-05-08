class PivotChartModel extends ChartModel {

	constructor(type, ctx, labels, data) {
		super(type, ctx, labels, data);
	}

	plotGraph() {
		let _cdatasets = [];
		let _chartStyleModel = this._chartStyleModel;
		this._cdata.forEach(function(dataObj) {
			let dataSet = {
				label:"Data",
				backgroundColor: "",
				data: []
			};
			let label = dataObj.key;
			let data =  dataObj.data;

			dataSet.label = label;
			dataSet.data = data;

			let randClrGen = new RandomColorGenerator();
			dataSet.backgroundColor = randClrGen.getRandomColor();

			_cdatasets.push(dataSet);
		});

		let _options = {
			responsive : true,
            maintainAspectRatio : false,
		    barValueSpacing: 20,
		    scales: {
		      yAxes: [{
		        ticks: {
		          min: 0,
		        }
		      }]
		    }
		}
		let myChart = new Chart(this._ctx, {
            type: this._type,
            data: {
                labels: this._labels,
                datasets: _cdatasets
            },
            options: _options
        });
	}
}