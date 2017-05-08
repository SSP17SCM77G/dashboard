class ChartController {

    constructor(model, view) {
        this._model = model;
        this._view = view;

        var _this = this;

        this._view.plotDataEventDispatcher.attach(function (sender, data) {
            _this.populatePlotData(data);
        });
    }

    populatePlotData(data) {
        return this._model.populatePlotData(data);
    }
}