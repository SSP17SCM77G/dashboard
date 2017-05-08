let instance = null;

class CSVParser {

	static get instance() {
    	return instance;
  	}

  	static set instance(_instance) {
    	instance = _instance;
  	}

	constructor() {
		if (CSVParser.instance === null) {
      		CSVParser.instance = this;
      		this.DataFrame = dfjs.DataFrame;
			this._df = null;
			this.parseComplete = new EventDispatcher(this);
    	}
    	return CSVParser.instance;	
	}

	static getInstance() {
    	return new CSVParser();
    }

	parseCSV(path){
		this.DataFrame.fromCSV(path, true).then(df => {
			this._df = df;
			this.parseComplete.notify([this._df, this.DataFrame]);
		});
	}

}	