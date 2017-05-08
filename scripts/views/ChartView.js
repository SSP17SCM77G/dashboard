class ChartView {

	constructor(model, elements) {
        this._model = model;
        this._elements = elements;

        this.plotDataEventDispatcher = new EventDispatcher(this);

        var _this = this;

        //attach model events
        this._model.populatePlotDataEventDispatcher.attach(function(sender, data) {
            if(data.getPlotType() === 'TABLE') {
                let tableData = [];
                tableData.push(_this._model.getColumns());
                tableData.push(_this._model.getData());
                _this.createTable(tableData);
            } else {
                _this.buildGraph(data)
            }
        });

        // attach listeners to HTML controls
        this._elements.plotDataButton.addEventListener("click", function () {
            let type = _this._elements.dataSetType;
            let plotData;
            if(type === 'INFLUENZA') {
                plotData = _this.buildInfluenzaData();   
            } else if (type === 'CARDIO_ARTHRITIS_DIABETES') {
                plotData = _this.buildCardioVascularOrArthritisData();
            } else if (type === 'VISUAL_IMPAIRMENT') {
                plotData = _this.buildVisualImpairmentData();
            }
    
            _this.plotDataEventDispatcher.notify(plotData);
        });
    }

    buildGraph(data) {
        let canvas = this.getCanvas();
        let ctx = canvas.getContext('2d');
        
        let chart = ChartFactory.getInstance(data.getPlotType(), ctx, data.getXData(), data.getYData());

        let chartStyleModel = new ChartStyleModel();

        let options = {
            responsive : true,
            maintainAspectRatio : false
        }
        chartStyleModel.setOptions(options);

        let randClrGen = new RandomColorGenerator();

        chartStyleModel.setBackgroundColors(randClrGen.getNRandmColors(data.getYData()[0].data.length));
        chartStyleModel.setBorderWidth(2);

        chart.setChartStyleModel(chartStyleModel);

        chart.plotGraph();
    }

    createTable(tableData) {
        let _this = this;
        this._elements.visualContainer.innerHTML = "";

        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');

        let th = document.createElement('tr');
        tableData[0].forEach(function(cellData) {
            let cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            th.appendChild(cell);
        });
        tableBody.appendChild(th);

        tableData[1].forEach(function(rowDataArray){
            let row = document.createElement('tr');
            rowDataArray.forEach(function(cellData) {
                let cell = document.createElement('td');
                cell.appendChild(document.createTextNode(cellData));
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);
        // table.style.overflow = 'scroll';
        // table.style.display = 'block';
        this._elements.visualContainer.appendChild(table);
    }

    initInfluenzaView() {
        this.populateInfluenzaFilterOptions();
        this.populateInfluenzaGroupByOptions();
        this.populateInfluenzaColumnFilterContainerOptions();
        this.populateInfluenzaRowFilterOptions();
    }

    initCVDView() {
        this.populateCVDColumnFilterContainerOptions();
        this.populateCVDRowFilterOptions();
    }

    initArthritisView() {
        this.populateArthritisColumnFilterContainerOptions();
        this.populateArthritisRowFilterOptions();
    }

    initDiabetesView() {
        this.populateDiabetesColumnFilterContainerOptions();
        this.populateDiabetesRowFilterOptions();
    }

    initVisualImpairmentView() {
        this.populateVisualImpairmentFilterContainerOptions();
        this.populateVisualImpairmentRowFilterOptions();
    }

    buildInfluenzaData() {
        let season = this.getSelectedRadioButtonValues("season");
        let groupBySelector = this.getSelectedRadioButtonValues("groupBySelector");
        let groupByField = this.getSelectedRadioButtonValues("groupByFields");
        let XData = [];
        let filterData = [];

        if(groupBySelector != ' Virus') {
            groupBySelector = groupByField;
            XData = this._model.getDataAlongX(' Virus')
        } else {
            groupByField = groupBySelector;
            XData = this.getInfluenzaAgeGroups();
            filterData = this.getUnselectedRCValues("groupByFields");
        }

        let plotType = this.getSelectedRadioButtonValues("plotType");

        let filterEntry = {
            'key': 'Season',
            'value': season
        };
        let plotData = new PlotDataModel(plotType, filterEntry, groupBySelector, groupByField);
        plotData.setXData(XData)
        if(filterData.length > 0) {
            plotData.setFilterData(filterData);
            plotData.setApplyYDataFiltering(true);
        }
        if(plotType === 'STACKED_CHART' || plotType === 'PIVOT_CHART') {
            plotData.setGroupByField(' Virus');
            let columns = this._model.getColumns();
            let index = columns.indexOf('Season');
            columns.splice(index, 1);
            index = columns.indexOf(' Virus');
            columns.splice(index, 1);
            plotData.setSumOnColumns(columns);
            
        }
        if(plotType === 'PIVOT_CHART') {
            plotData.setXData(plotData.getSumOnColumns());
        }
        let selectColumns = this.getSlectedRCValues("columnSelector");
        let selectRows1 = this.getMultiSelectedValues("rowselector1");
        let selectRows2 = this.getMultiSelectedValues("rowselector2");
        
        let selectRow1Obj = {
            'key' : 'Season',
            'value' : selectRows1 
        }

        let selectRow2Obj = {
            'key' : ' Virus',
            'value' : selectRows2
        }
        
        plotData.setSelectColumns(selectColumns);
        plotData.setSelectRows1(selectRow1Obj);
        plotData.setSelectRows2(selectRow2Obj);

        this._model.applyFiltering(selectColumns, selectRow1Obj, selectRow2Obj);
        return plotData;
    }

    buildCardioVascularOrArthritisData() {
        let plotType = this.getSelectedRadioButtonValues("plotType");

        let plotData = new PlotDataModel(plotType, {}, 'LocationDesc', '');

        let selectColumns = this.getSlectedRCValues("columnSelector");
        let selectRows1 = this.getMultiSelectedValues("rowselector1");
        let selectRows2 = this.getMultiSelectedValues("rowselector2");
        
        let selectRow1Obj = {
            'key' : 'Year',
            'value' : selectRows1 
        }

        let selectRow2Obj = {
            'key' : 'LocationDesc',
            'value' : selectRows2
        }
        if(selectRows2.length == 0 && plotType !== 'TABLE') {
            alert('Select at least two from row filters');
            return;
        }
        plotData.setXData(selectRows2);

        plotData.setSelectColumns(selectColumns);
        
        plotData.setSelectRows1(selectRow1Obj);
        plotData.setSelectRows2(selectRow2Obj);
        plotData.setApplySumofInstances(true);
        plotData.setSumColumnEntries(selectRow2Obj);
        plotData.setSumOnColumns(['Year']);

        this._model.applyFiltering(selectColumns, selectRow1Obj, selectRow2Obj);
        return plotData;
    }

    buildVisualImpairmentData() {
        let XData = this.getVisualImpairmentXdata();
        let plotType = this.getSelectedRadioButtonValues("plotType");

        let plotData = new PlotDataModel(plotType, {}, 'Category', '');

        let selectColumns = this.getSlectedRCValues("columnSelector");
        let selectRows1 = this.getMultiSelectedValues("rowselector1");
        let selectRows2 = this.getMultiSelectedValues("rowselector2");
        
        let selectRow1Obj = {
            'key' : 'Category',
            'value' : selectRows1 
        }

        let selectRow2Obj = {
            'key' : 'Prevalence',
            'value' : selectRows2
        }
        if(selectRows1.length == 0 && plotType !== 'TABLE') {
            alert('Select at least two from row filters');
            return;
        }
        plotData.setXData(XData);

        plotData.setSelectColumns(selectColumns);
        
        plotData.setSelectRows1(selectRow1Obj);
        plotData.setSelectRows2(selectRow2Obj);
        plotData.setSumColumnEntries(selectRow2Obj);
        plotData.setSumOnColumns(XData);

        plotData.setGroupByField('Category');
        plotData.setApplyOnColumns(true);
        this._model.applyFiltering(selectColumns, selectRow1Obj, selectRow2Obj);
        return plotData;
    }
    
    getCSVData() {
        return this._model.getCSVData();
    }

    getJSONData() {
        return this._model.getJSONData();
    }

    showInfluenzaStats() {
        let stats = this._model.getStatistics(this.getInfluenzaXdata());
        this.showStatistics(stats)
    }

    showVisualImpairmentStats() {
        let stats = this._model.getStatistics(this.getVisualImpairmentXdata());
        this.showStatistics(stats)
    }

    showStatistics(stats) {
        let headers = ['Parameter'];
        let rowData = [];

        let data = [];
        let index = 0;
        let shouldPushToHeader = true;
        for(var key in stats) {
            data.push(key);
            let rData = stats[key];
            for(var rowKey in rData) {
                data.push(rData[rowKey]+"")
                if(shouldPushToHeader) {
                    headers.push(rowKey);
                }
            }
            rowData[index] = data;
            data = [];
            index++;
            shouldPushToHeader = false;
        }
        let tableData = [headers, rowData];
        this.createTable(tableData);
    }
    populateInfluenzaColumnFilterContainerOptions() {
        let columns = this._model.getColumns();

        this.populateColumnFilterOptions(columns);
    }
    populateCVDColumnFilterContainerOptions() {
        let columns = this._model.getColumns();

        this.populateColumnFilterOptions(columns);
    }
    
    populateArthritisColumnFilterContainerOptions() {
        let columns = this._model.getColumns();

        this.populateColumnFilterOptions(columns);
    }

    populateDiabetesColumnFilterContainerOptions() {
        let columns = this._model.getColumns();

        this.populateColumnFilterOptions(columns);
    }

    populateVisualImpairmentFilterContainerOptions() {
        let columns = this._model.getColumns();

        this.populateColumnFilterOptions(columns);
    }

    populateInfluenzaRowFilterOptions() {
        let distinctSeasons = this._model.getDistinctDataByColumn("Season");
        let distinctVirus = this._model.getDistinctDataByColumn(" Virus");
        let filterContainer = this._elements.rowFilterContainer;

        this.populateRowFilterOptions(distinctSeasons, distinctVirus);
    }

    populateCVDRowFilterOptions() {
        let distinctSeasons = this._model.getDistinctDataByColumn("Year");
        let distinctVirus = this._model.getDistinctDataByColumn("LocationDesc");
        let filterContainer = this._elements.rowFilterContainer;

        this.populateRowFilterOptions(distinctSeasons, distinctVirus);
    }

    populateArthritisRowFilterOptions() {
        let distinctSeasons = this._model.getDistinctDataByColumn("Year");
        let distinctVirus = this._model.getDistinctDataByColumn("LocationDesc");
        let filterContainer = this._elements.rowFilterContainer;

        this.populateRowFilterOptions(distinctSeasons, distinctVirus);
    }

    populateDiabetesRowFilterOptions() {
        let distinctSeasons = this._model.getDistinctDataByColumn("Year");
        let distinctVirus = this._model.getDistinctDataByColumn("LocationDesc");
        let filterContainer = this._elements.rowFilterContainer;

        this.populateRowFilterOptions(distinctSeasons, distinctVirus);
    }

    populateVisualImpairmentRowFilterOptions() {
        let distinctSeasons = this._model.getDistinctDataByColumn("Category");
        let distinctVirus = this._model.getDistinctDataByColumn("Prevalence");
        let filterContainer = this._elements.rowFilterContainer;

        this.populateRowFilterOptions(distinctSeasons, distinctVirus);
    }

    populateColumnFilterOptions(columns) {
        let filterContainer = this._elements.columnFilterContainer;

        let html = '';
        let _this = this;

        columns.forEach(function(value) {
            html = _this.getCheckboxTypeHtml(html, 'columnSelector', value);
        });
        filterContainer.innerHTML = html;
    }

    populateRowFilterOptions(list1, list2) {
        let filterContainer = this._elements.rowFilterContainer;

        let list1MultiSelect = document.createElement('select');
        list1MultiSelect.name = 'rowselector1';
        list1MultiSelect.multiple = true;

        list1.forEach(function(value) {
            let option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            list1MultiSelect.appendChild(option);
        });
        filterContainer.appendChild(list1MultiSelect);

        filterContainer.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

        let list2MultiSelect = document.createElement('select');
        list2MultiSelect.name = 'rowselector2';
        list2MultiSelect.multiple = true;

        list2.forEach(function(value) {
            let option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            list2MultiSelect.appendChild(option);
        });
        filterContainer.appendChild(list2MultiSelect);
    }

    populateInfluenzaFilterOptions() {
        let seasonList = this._elements.seasonList;
        seasonList.innerHTML = "";
        let isFirstElement = true;
        let html = '';
        let filterName="season";

        var _this = this;
        this._model.getDistinctDataByColumn('Season').forEach(function(value) {
            html = _this.getRadioTypeHtml(html, filterName, value, isFirstElement);
            if(isFirstElement) {
                isFirstElement = false;
            }
        });
        seasonList.innerHTML = html;
    }

    populateInfluenzaGroupByOptions() {
        let groupBySelector = this.getSelectedRadioButtonValues("groupBySelector");
        let isFirstElement = true;
        let groupByFieldsDiv = this._elements.groupByFieldsDiv;
        let html = '';
        let groupName = "groupByFields";
        groupByFieldsDiv.innerHTML = "";
        
        if(groupBySelector == ' Virus') {
           var _this = this;
            this._model.getDistinctDataByColumn(' Virus').forEach(function(value) {
                html = _this.getRadioTypeHtml(html, groupName, value, isFirstElement);
                if(isFirstElement) {
                    isFirstElement = false;
                }
            });
        } else {
            let columns = this.getInfluenzaAgeGroups();

            var _this = this;
            columns.forEach(function(value) {
                html = _this.getRadioTypeHtml(html, groupName, value, isFirstElement);
                if(isFirstElement) {
                    isFirstElement = false;
                }
            });
        }
        groupByFieldsDiv.innerHTML = html;
       
        html = '';
    }

    getCanvas() {
        this._elements.visualContainer.innerHTML = "";

        var canv = document.createElement('canvas');
        canv.id = 'plotContainer';
        canv.width = 350;
        canv.height = 450;
        this._elements.visualContainer.appendChild(canv);
        return canv;
    }

    getInfluenzaAgeGroups() {
        let columns = this._model.getColumns();

        columns.splice(columns.indexOf('Season'), 1);
        columns.splice(columns.indexOf(' Virus'), 1);

        return columns;
    }

    getCheckboxTypeHtml(html, name, value) {
        html += '<input type="checkbox" name="'+name+'" value="'+value+'" >';
        let text = '&nbsp;&nbsp;' + value + '<br>';
        html += text;
        return html;
    }

    getkSelectTypeHtml(html, name, value) {
        html += '<input type="checkbox" name="'+name+'" value="'+value+'" >';
        let text = '&nbsp;&nbsp;' + value + '<br>';
        html += text;
        return html;
    }

    getRadioTypeHtml(html, name, value, isFirstElement) {
        if(isFirstElement) {
            html += '<input type="radio" name="'+name+'" value="'+value+'" checked="checked">';
        } else {
            html += '<input type="radio" name="'+name+'" value="'+value+'">';
        }
        let text = '&nbsp;&nbsp;' + value + '<br>';
        html += text;
        return html;
    }

    getMultiSelectedValues(name) {
        let x = document.getElementsByName(name)[0];
        let values = [];

        for (var i = 0; i < x.options.length; i++) {
            if(x.options[i].selected){
                  values.push(x.options[i].value);
            }
        }
        return values;
    }

    getSelectedRadioButtonValues(name) {
        return document.querySelector('input[name="'+name+'"]:checked').value;
    }

    getSlectedRCValues(name) {
        var elements = document.getElementsByName(name);
        var values = [];
        for(var i = 0; i < elements.length; i++){
            if(elements[i].checked || elements[i].selected){
                values.push(elements[i].value)
            }
        }
        return values;
    }
    getUnselectedRCValues(name) {
        var elements = document.getElementsByName(name);
        var values = [];
        for(var i = 0; i < elements.length; i++){
            if(!elements[i].checked){
                values.push(elements[i].value)
            }
        }
        return values;
    }

    getInfluenzaXdata() {
        return ['0-4 yr','5-24 yr','25-64 yr','65+ yr'];
    }

    getVisualImpairmentXdata() {
        return ['1988-1994', '1999-2002', '2001-2004', '2003-2006'];
    }
}