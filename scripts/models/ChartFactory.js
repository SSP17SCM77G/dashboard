class ChartFactory {

	static getInstance(type, ctx, labels, data) {
		let chartObj = ChartType[type];
		let Chart = chartObj.constructor;
		let _type = chartObj.ctype;

		let chart = null;

		if(Chart) {
			chart = new Chart(_type, ctx, labels, data);
		}
		return chart;
	}

}