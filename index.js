const puppeteer = require('puppeteer');
const fs = require('fs')

//функция обёртка для синхронных операций
async function start() {
	try {
		// открываем браузер
		const browser = await puppeteer.launch();
		// const browser = await puppeteer.launch({ headless: false, slowMo: 100, devtools: true })
		// открываем страницу в браузере
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
			deviceScaleFactor: 1
		});
		const link = 'https://zwiftpower.com/events.php?zid=2619563';
		await page.goto(link, { waitUntil: 'domcontentloaded' });
		await page.$eval('#username', (elem) => elem.value = 'Sanchous');
		await page.$eval('#password', (elem) => elem.value = 'abkbfk.nr');
		await page.click('#login > fieldset > div.row.mobile-fix > div:nth-child(1) > input.btn.btn-success.btn-block.btn-lg');
		await page.waitForTimeout(6000);



		const table = await page.evaluate(async () => {
			//определение названий столбцов и формирование массива
			resultThead = [];
			let thead = await document.querySelectorAll('#table_event_results_final > thead > tr > th');
			thead.forEach(element => {
				resultThead.push(element.innerText.split(' ').join(''))
			});
			//определение номеров столбцов с нужными данными
			const theadNumber = {
				riderColumn: resultThead.indexOf('Rider') + 1,
				timerColumn: resultThead.indexOf('Time') + 1,
				avgWKgColumn: resultThead.indexOf('avg') + 1,
				avgWattsColumn: resultThead.indexOf('watts') + 1,
				twentyMinWattsColumn: resultThead.indexOf('20m') + 1,
				fiveMinWattsColumn: resultThead.indexOf('5m') + 1,
				oneMinWattsColumn: resultThead.indexOf('1m') + 1,
				thirtySeсWattsColumn: resultThead.indexOf('30s') + 1,
				fifteenSeсWattsColumn: resultThead.indexOf('15s') + 1,
				avrHeartColumn: resultThead.indexOf('Avg') + 1,
				maxHeartColumn: resultThead.indexOf('Max') + 1
			}
			// console.log(theadNumber);

			let result = [];
			let container = await document.querySelectorAll('#table_event_results_final > tbody > tr')
			let i = 0;

			container.forEach(element => {
				i++
				let category = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(1)`).innerText;
				let rider = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.text-left.text-nowrap.athlete_col > div > a`).innerText;
				//оптимизировать
				let riderTeam = '';
				try {
					riderTeam = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td.text-left.text-nowrap.athlete_col > div > small > span > a`).innerText;
				} catch (error) {
					riderTeam = '';
				}
				let riderLinkZp = element.querySelector('a').href;
				let timeFull = element.querySelector('.pull-left').innerText;
				let timeGap = element.querySelector('.pull-right').innerText;
				let avgWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWKgColumn})`).innerText;
				let avgWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWattsColumn})`).innerText;
				let twentyMinWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.twentyMinWattsColumn})`).innerText;
				let fiveMinWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fiveMinWattsColumn})`).innerText;
				let oneMinWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.oneMinWattsColumn})`).innerText;
				let thirtySeсWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.thirtySeсWattsColumn})`).innerText;
				let fifteenSeсWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fifteenSeсWattsColumn})`).innerText;
				let avrHeart = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avrHeartColumn})`).innerText;
				let maxHeart = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.maxHeartColumn})`).innerText;


				result.push({ category, rider, riderTeam, riderLinkZp, timeFull, timeGap, avgWKg, avgWatts, twentyMinWatts, fiveMinWatts, oneMinWatts, thirtySeсWatts, fifteenSeсWatts, avrHeart, maxHeart })
			});
			return result
		})

		fs.writeFile('zwiftpower.json', JSON.stringify(table), (error) => {
			if (error) {
				throw error
			}
			console.log('Saved zwiftpower.json');
		})


		await browser.close();
	} catch (error) {
		throw error
	}

}

start()