class StackedChartModel extends ChartModel {

	constructor(type, ctx, labels, data) {
		super(type, ctx, labels, data);
	}

	plotGraph() {
		let _cdatasets = [];
		let maxWidth = 0;
		this._cdata.forEach(function(dataObj) {
			let dataSet = {
				label:'Data',
				data: [],
				backgroundColor: '',
				borderWidth: 1
			};
			let label = dataObj.key;
			let data =  dataObj.data;

			if(label) {
				dataSet.label = label;
			}
			dataSet.data = data;
			let randClrGen = new RandomColorGenerator();
			dataSet.backgroundColor = randClrGen.getRandomColor();
			_cdatasets.push(dataSet);
			
			if(maxWidth < data.length) {
				maxWidth = data.length;
			}
		});
		let labels = [];
		for(let i = 1; i <= maxWidth; i++) {
			labels.push('Data'+i);
		}
		let options = {
			responsive : true,
            maintainAspectRatio : false,
		    scales: {
		  		xAxes: [{stacked: true}],
		    	yAxes: [{
		      	stacked: true,
		      	ticks: {
		        	beginAtZero: true 
		         }
		      }]
		    }
		};

		this._labels = labels;
		this._chartStyleModel.setOptions(options);

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
}