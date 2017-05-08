class PlotDataModel {

	constructor(plotType, filterFieldEntry, groupByField, aggregateField) {
		this._plotType = plotType;
		this._filterFieldEntry = filterFieldEntry;
		this._groupByField = groupByField;
		this._aggregateField = aggregateField;
		this._XData = [];
		this._YData = [];
		this._filterData = []
		this._applyYDataFiltering = false;
		this._sumOnColumns = [];
		this._selectColumns = [];
		this._selectRows1;
		this._selectRows2;
		this._applySumOfInstances = false;
		this._sumColumnEntries = {};
		this._applyOnColumns = false;
	}

	setApplyOnColumns(value) {
		this._applyOnColumns = value;
	}

	getApplyOnColumns() {
		return this._applyOnColumns;
	}

	setSumColumnEntries(entries) {
		this._sumColumnEntries = entries;
	}

	setApplySumofInstances(value){
		this._applySumOfInstances = value;
	}

	setSelectColumns(columns) {
		this._selectColumns = columns;
	}

	setSelectRows1(rows) {
		this._selectRows1 = rows;
	}

	setSelectRows2(rows) {
		this._selectRows2 = rows;
	}

	getApplySumofInstances() {
		return this._applySumOfInstances;
	}

	getSelectColumns() {
		return this._selectColumns;
	}

	getSelectRows1() {
		return this._selectRows1;
	}

	getSelectRows2() {
		return this._selectRows2;
	}
	getSumColumnEntries() {
		return this._sumColumnEntries;
	}
	setPlotType(plotType) {
		this._plotType = plotType;
	}

	setFilterFieldEntry(filterFieldEntry) {
		this._filterFieldEntry = filterFieldEntry;
	}

	setGroupByField(groupByField) {
		this._groupByField = groupByField;
	}

	setAggregateField(aggregateField) {
		this._aggregateField = aggregateField;
	}

	setYData(data) {
		this._YData = data;
	}

	setXData(data) {
		this._XData = data;
	}

	setFilterData(data) {
		this._filterData = data;
	}

	setApplyYDataFiltering(value) {
		this._applyYDataFiltering = value;
	}

	setSumOnColumns(data) {
		this._sumOnColumns = data;
	}

	getPlotType() {
		return this._plotType;
	}

	getFilterFieldEntry() {
		return this._filterFieldEntry;
	}

	getGroupByField() {
		return this._groupByField;
	}

	getAggregateField() {
		return this._aggregateField;
	}

	getXData() {
		return this._XData;
	}

	getYData() {
		return this._YData;
	}
	
	getFilterData() {
		return this._filterData;
	}

	getApplyYDataFiltering() {
		return this._applyYDataFiltering;
	}

	getSumOnColumns() {
		return this._sumOnColumns;
	}
}