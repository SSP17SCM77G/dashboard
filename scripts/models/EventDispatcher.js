class EventDispatcher {
	constructor(sender) {
		this.sender = sender;
		this.observers = [];
	}

	attach(observer) {
		this.observers.push(observer);
	}

	notify(args) {
		for (var i = 0; i < this.observers.length; i++) {
            this.observers[i](this.sender, args);
        }
	}
}