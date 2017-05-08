function require(path) {
	let jsPath = getScriptsPath().concat(path);
    document.write('<script type="text/javascript" src="'+jsPath+'"><\/script>');
}

function getScriptsPath() {
	return getRootWebSitePath().concat("/scripts");
}

function getRootWebSitePath() {
    let _location = document.location.toString();

    //Generic implementation
    // let applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
    // let applicationName = _location.substring(0, applicationNameIndex) + '/';
    // let webFolderIndex = _location.indexOf('/', _location.indexOf(applicationName) + applicationName.length);
    // var webFolderFullPath = _location.substring(0, webFolderIndex);

    // return webFolderFullPath;

    //Specific implementation
    let APP_NAME = 'HealthStats'
    let appIndex = _location.lastIndexOf(APP_NAME);
   	let webFolderFullPath = _location.substring(0, appIndex+APP_NAME.length);

    return webFolderFullPath;
}

// import controllers
require("/controllers/ChartController.js");

//import models
require("/models/EventDispatcher.js");
require("/models/CSVParser.js");
require("/models/DataSetModel.js");
require("/models/PlotDataModel.js");
require("/models/ChartStyleModel.js");
require("/models/ChartModel.js");
require("/models/BarChartModel.js");
require("/models/PieChartModel.js");
require("/models/LineChartModel.js");
require("/models/StackedChartModel.js");
require("/models/PivotChartModel.js");
require("/models/ChartType.js");
require("/models/ChartFactory.js");
require("/models/RandomColorGenerator.js");


//import views
require("/views/ChartView.js");

//import dataframe-js
require("/lib/dataframe.js");
require("/lib/Chart.js");