class RandomColorGenerator {

	getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	getNRandmColors(n) {
		let colors = [];
		let count = 0;

		while(count < n) {
			let color = this.getRandomColor();

			while(colors.indexOf(color) > 0) {
				color = this.getRandomColor();
			}
			colors.push(color);
			count++;
		}

		return colors;
	}
}