class DataSetModel {

	constructor(df, DataFrame) {
		this._df = df;
		this._DataFrame = DataFrame;
		this._columns = df.listColumns();
		this._data = df.toArray();
		this.populatePlotDataEventDispatcher = new EventDispatcher(this);
		this._DataFrame.sql.registerTable(this._df, 'data2')
		this._filteredDF = this._df;
	}

	filterDataByColumns(columns) {
		this.filterDataByColumnsEventDispatcher.notify('');
	}

	getColumns() {
		return this._filteredDF.listColumns().slice();
	}

	getData() {
		return this._filteredDF.toArray().slice();
	}

	getCSVData() {
		return this._df.toCSV();
	}

	getJSONData() {
		return this._df.toJSON();
	}

	getDistinctDataByColumn(column) {
		return this._df.distinct(column).toArray();
	}

	getDataAlongX(field) {
		return this._df.distinct(field).toArray();
	}

	getDataAlongY(filterEntry, groupingField, aggregateField) {
		let df = this._df;

		if(!groupingField && !aggregateField) {
			throw 'Grouping / Aggregate field cannot be empty';
		}

		if(filterEntry) {
			df = df.filter(row => row.get(filterEntry['key']) == filterEntry['value']);
		}
		let result = df.groupBy(groupingField).aggregate(group => group.stat.mean(aggregateField)).rename('aggregation', 'values').toDict();
		
		return result['values'];
	}

	getFDataAlongY(filterEntry, groupingField, aggregateField, filterData) {
		let df = this._df;

		if(!groupingField && !aggregateField) {
			throw 'Grouping / Aggregate field cannot bu empty';
		}

		if(filterEntry) {
			df = df.filter(row => row.get(filterEntry['key']) == filterEntry['value']);
		}

		for(let i = 0; i < filterData.length; i++) {
			df = df.filter(row => row.get(groupingField) !== filterData[i]);
		}
		
		let result = df.groupBy(groupingField).aggregate(group => group.stat.mean(aggregateField)).rename('aggregation', 'values').toDict();

		return df.toDict();
	}

	getSumDataGroupedByColumn(column, sumOnColumns) {
		let df = this._df;
		let distinctValues = this.getDistinctDataByColumn(column);
		let dataObj = [];

		distinctValues.forEach(function(value) {
			let fdf = df.where({[column] : value[0]});
			let filteredDataCollection = fdf.select.apply(fdf, sumOnColumns).toArray();
			let sumByColumn = {
				'key':value[0],
				'data':[]
			};
			
			filteredDataCollection.forEach(function(data) {
				let sum = 0;
				data.forEach(function(value) {
						sum += parseFloat(value);
				});
				sumByColumn['data'].push(sum)
			});
			dataObj.push(sumByColumn);
		});
		return dataObj;
	}

	getSumDataGroupedByColumns(columns, sumOnColumns) {
		let df = this._df;
		let dataObj = [];

		columns.value.forEach(function(value) {
			let fdf = df.where({[columns.key] : value});
			let filteredDataCollection = fdf.select.apply(fdf, sumOnColumns).toArray();
			let sumByColumn = {
				'key':value[0],
				'data':[]
			};
			
			filteredDataCollection.forEach(function(data) {
				let sum = 0;
				data.forEach(function(value) {
						sum += parseFloat(value);
				});
				sumByColumn['data'].push(sum)
			});
			dataObj.push(sumByColumn);
		});
		return dataObj;
	}


	handleStackForSumOnColumn(column, sumByColumn, selectColumns) {
		let df = this._df;
		let distinctValues;
		if(selectColumns.length > 0) {
			distinctValues = selectColumns;
		} else {
			distinctValues = this.getDistinctDataByColumn(column);
		}
		let distinctSumByColumnValues = this.getDistinctDataByColumn(sumByColumn);
		let dataObj = [];
		
		distinctValues.forEach(function(value) {
			let sumByColumnObj = {
				'key': value,
				'data':[]
			};
			let cond;
			if(value instanceof Array) {
				cond = {[column] : value[0]};
			} else {
				cond = {[column] : value}
			}
			let fdf = df.where(cond);
			distinctSumByColumnValues.forEach(function(val) {
				let sum = fdf.where({[sumByColumn] : val[0]}).toArray().length;
				sumByColumnObj['data'].push(sum);
			});
			dataObj.push(sumByColumnObj);
		});

		return dataObj;
	}

	getColumnSumDataForupedByColumn(column, sumOnColumns) {
		let df = this._df;
		let distinctValues = this.getDistinctDataByColumn(column);
		
		let dataObj = [];

		distinctValues.forEach(function(value) {
			let fdf = df.where({[column] : value[0]});
			let filteredDataCollection = fdf.select.apply(fdf, sumOnColumns).toDict();
			let sumByColumn = {
				'key':value[0],
				'data':[]
			}
			for (var key in filteredDataCollection) {
    			let sum = 0;
    			filteredDataCollection[key].forEach(function(value) {
    				sum += parseFloat(value);
    			});
    			sumByColumn['data'].push(sum);
			}
			dataObj.push(sumByColumn);
		});
		return dataObj;
	}

	getColumnSumDataForupedByColumns(columns, sumOnColumns) {
		let df = this._df;
		let dataObj = [];

		columns.value.forEach(function(value) {
			let fdf = df.where({[columns.key] : value});
			let filteredDataCollection = fdf.select.apply(fdf, sumOnColumns).toDict();
			let sumByColumn = {
				'key':value,
				'data':[]
			}
			
			for (var key in filteredDataCollection) {
    			let sum = 0;
    			filteredDataCollection[key].forEach(function(value) {
    				sum += parseFloat(value);
    			});
    			sumByColumn['data'].push(sum);
			}
			dataObj.push(sumByColumn);
		});

		return dataObj;
	}

	getColumnsSumDataForupedByColumnValues(columns, sumOnColumns) {
		let df = this._df;
		let dataObj = [];

		columns.value.forEach(function(value) {
			let fdf = df.where({[columns.key] : value});
			let filteredDataCollection = fdf.select.apply(fdf, sumOnColumns).toDict();
			let sumByColumn = {
				'key':value,
				'data':[]
			}
			
			for (var key in filteredDataCollection) {
    			let sum = 0;
    			filteredDataCollection[key].forEach(function(value) {
    				sum += parseFloat(value);
    			});
    			dataObj.push(sum)
			}
		});
		console.log(dataObj);
		return dataObj;
	}

	getDataOfSelectedColumns(columns) {
		this._df.select.apply(this._df, sumOnColumns).toArray().slice();
	}

	getStatistics(columns) {
		let stats = {};
		let _this = this;

		columns.forEach(function(column) {
			stats[column] = _this._df.stat.stats(column);
		});

		return stats;
	}

	applyFiltering(selectColumns, selectRows1, selectRows2) {
		this._filteredDF = this._df;

		let sfdf = this._filteredDF;

		if(selectColumns.length > 0) {
			sfdf = sfdf.select.apply(sfdf, selectColumns);
		}

		if(selectRows1.value.length > 0) {
			let fdfT;
			selectRows1.value.forEach(function(value) {
				let dfI = sfdf.filter({[selectRows1.key] : value})
				if(fdfT) {
					fdfT = fdfT.union(dfI);
				} else {
					fdfT = dfI;
				}
			});
			sfdf = fdfT;
		}
		if(selectRows2.value.length > 0) {
			let fdfT;
			selectRows2.value.forEach(function(value) {
				let dfI = sfdf.filter({[selectRows2.key] : value})
				if(fdfT) {
					fdfT = fdfT.union(dfI);
				} else {
					fdfT = dfI;
				}
			});
			sfdf = fdfT;
		}
		this._filteredDF = sfdf;
	}

	getDataBySumOfColumnInstances(columnEntries) {
		let _this = this;
		let fdfT;
		let sfdf = this._filteredDF;
		let data = []
		columnEntries.value.forEach(function(value){
			let dfI = sfdf.filter({[columnEntries.key] : value});
			data.push(dfI.toArray().length)
		});
		return data;
	}

	populatePlotData(plotData) {
		let yData = [];
		let yDataObj = [];
		let dataObj = {
			'key' : 'Data',
			'data' : []
		};

		if(plotData.getPlotType() === 'TABLE') {

		} else if((plotData.getApplySumofInstances() && plotData.getPlotType() === 'STACKED_CHART') || (plotData.getApplySumofInstances() && plotData.getPlotType() === 'PIVOT_CHART')) {
			yDataObj = this.handleStackForSumOnColumn(plotData.getGroupByField(), plotData.getSumOnColumns()[0], plotData.getSumColumnEntries().value);
		} else if(plotData.getApplySumofInstances()) {
			yData = this.getDataBySumOfColumnInstances(plotData.getSumColumnEntries());
			dataObj.data = yData;
			yDataObj.push(dataObj);
		} else if(plotData.getPlotType() === 'STACKED_CHART') {
			if(plotData.getApplyOnColumns())
				yDataObj = this.getSumDataGroupedByColumns(plotData.getSelectRows1(), plotData.getSumOnColumns());
			else
				yDataObj = this.getSumDataGroupedByColumn(plotData.getGroupByField(), plotData.getSumOnColumns());
		} else if(plotData.getApplyOnColumns() && plotData.getPlotType() != 'PIVOT_CHART') {
			yData = this.getColumnsSumDataForupedByColumnValues(plotData.getSelectRows1(), plotData.getSumOnColumns());
			dataObj.data = yData;
			yDataObj.push(dataObj);
		}else if(plotData.getPlotType() === 'PIVOT_CHART') {
			if(plotData.getApplyOnColumns())
				yDataObj = this.getColumnSumDataForupedByColumns(plotData.getSelectRows1(), plotData.getSumOnColumns());
			else
				yDataObj = this.getColumnSumDataForupedByColumn(plotData.getGroupByField(), plotData.getSumOnColumns());
		} else if(plotData.getFilterData().length > 0) {
			let data = this.getFDataAlongY(plotData.getFilterFieldEntry(), plotData.getGroupByField(), plotData.getAggregateField(), plotData.getFilterData());
			if(plotData.getApplyYDataFiltering()) {
				let _yData = [];
				let xData = plotData.getXData();
				for(let i = 0; i < xData.length; i++) {
					let key = xData[i];
					_yData.push(data[key][0]);
				}
				yData = _yData;
			}
			dataObj.data = yData;
			yDataObj.push(dataObj);
		} else {
			yData = this.getDataAlongY(plotData.getFilterFieldEntry(), plotData.getGroupByField(), plotData.getAggregateField());
			dataObj.data = yData;
			// console.log
			yDataObj.push(dataObj);
		}
		plotData.setYData(yDataObj);
		this.populatePlotDataEventDispatcher.notify(plotData);
	}
}