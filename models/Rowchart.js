const { Schema, model } = require('mongoose');
const rowChartSchema = new Schema({
	url: {
		type: String
	},
	timeRequest: {
		type: String
	},
	zpData: {
		type: JSON
	}
})
module.exports = model('rowCharts', rowChartSchema);