const { Schema, model } = require('mongoose');
const rawChartSchema = new Schema({
	url: {
		type: String
	},
	timeRequest: {
		type: Number
	},
	zpData: {
		type: JSON
	}
})
module.exports = model('rowCharts', rawChartSchema);