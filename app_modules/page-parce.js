const fs = require('fs');

async function pageForParce(page) {

	// const pageStart = await start();

	const table = await page.evaluate(async () => {
		//определение названий столбцов и формирование массива
		resultThead = [];
		let thead = await document.querySelectorAll('#table_event_results_final > thead > tr > th');
		thead.forEach(element => {
			resultThead.push(element.innerText.split(' ').join(''));
		});
		//определение номеров столбцов с нужными данными
		//weightColumn определяется как номер колонки среднего пульса -1
		const theadNumber = {
			riderColumn: resultThead.indexOf('Rider') + 1,
			timerColumn: resultThead.indexOf('Time') + 1,
			avgWKgColumn: resultThead.indexOf('avg') + 1,
			avgWattsColumn: resultThead.indexOf('watts') + 1,
			twentyMinWKgColumn: resultThead.indexOf('20m') + 1,
			fiveMinWKgColumn: resultThead.indexOf('5m') + 1,
			oneMinWKgColumn: resultThead.indexOf('1m') + 1,
			thirtySeсWKgColumn: resultThead.indexOf('30s') + 1,
			fifteenSeсWKgColumn: resultThead.indexOf('15s') + 1,
			weightColumn: resultThead.indexOf('Avg'),
			avrHeartColumn: resultThead.indexOf('Avg') + 1,
			maxHeartColumn: resultThead.indexOf('Max') + 1
		}
		// console.log(theadNumber);

		let result = [];
		let container = await document.querySelectorAll('#table_event_results_final > tbody > tr');
		let i = 0;

		container.forEach(element => {
			i++
			let category = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(1)`) ?? { innerText: "" })
				.innerText;
			let rider = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.text-left.text-nowrap.athlete_col > div > a`) ?? { innerText: "" })
				.innerText;
			let riderFlag = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.text-left.text-nowrap.athlete_col > div > span`)
				.className.split('flag-icon flag-icon-').join('');
			let riderTeam = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.text-left.text-nowrap.athlete_col > div > small > span > a`) ?? { innerText: "" })
				.innerText;
			let riderLinkZp = element.querySelector('a').href;
			let timeFull = (element.querySelector('.pull-left') ?? { innerText: "" }).innerText;
			let timeGap = (element.querySelector('.pull-right') ?? { innerText: "" }).innerText.split('+').join('').split('s').join('');
			let avgWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let avgWatts = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWattsColumn})`) ?? { innerText: "" })
				.innerText.split('w').join('');
			let twentyMinWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.twentyMinWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let fiveMinWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fiveMinWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let oneMinWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.oneMinWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let thirtySeсWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.thirtySeсWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let fifteenSeсWKg = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fifteenSeсWKgColumn})`) ?? { innerText: "" })
				.innerText.split('w/kg').join('');
			let weight = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.weightColumn})`) ?? { innerText: "" })
				.innerText.split('kg').join('');
			let avrHeart = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avrHeartColumn})`) ?? { innerText: "" })
				.innerText.split('bpm').join('');
			let maxHeart = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.maxHeartColumn})`) ?? { innerText: "" })
				.innerText.split('bpm').join('');
			let height = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.info-expand.text-right.text-nowrap.padright24`) ?? { innerText: "" })
				.innerText.split('cm').join('');


			result.push({
				category,
				rider,
				riderFlag,
				riderTeam,
				riderLinkZp,
				timeFull,
				timeGap,
				avgWKg,
				avgWatts,
				twentyMinWKg,
				fiveMinWKg,
				oneMinWKg,
				thirtySeсWKg,
				fifteenSeсWKg,
				weight,
				avrHeart,
				maxHeart,
				height
			})
		});
		return result;
	})
	// table.unshift({ timeScraping: new Date().toLocaleString(), linkZp });

	fs.writeFile('zwiftpower.json', JSON.stringify(table), (error) => {
		if (error) {
			throw error
		}
		console.log(`Zwiftpower.json saved ${table[0].timeScraping}`);
	});
	return table;
}

module.exports = pageForParce;