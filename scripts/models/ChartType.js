const ChartType = {
	'BAR_CHART' : {'constructor':BarChartModel, ctype:'bar'},
	'PIE_CHART': {'constructor':PieChartModel, ctype:'pie'},
	'LINE_CHART': {'constructor':LineChartModel, ctype:'line'},
	'STACKED_CHART' : {'constructor':StackedChartModel, ctype:'bar'},
	'PIVOT_CHART' : {'constructor':PivotChartModel, ctype:'bar'}
}