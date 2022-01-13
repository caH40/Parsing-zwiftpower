require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

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
		const user = process.env.USER;
		const password = process.env.PASSWORD;
		await page.$eval('#username', (elem, user) => (elem.value = user), user);
		await page.$eval('#password', (elem, password) => (elem.value = password), password);
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

			let result = [{ timeScraping: new Date().toLocaleString() }];
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
				let timeGap = element.querySelector('.pull-right')
					.innerText.split('+').join('').split('s').join('');
				let avgWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWKgColumn})`)
					.innerText.split('w/kg').join('');
				let avgWatts = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avgWattsColumn})`)
					.innerText.split('w').join('');
				let twentyMinWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.twentyMinWKgColumn})`)
					.innerText.split('w/kg').join('');
				let fiveMinWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fiveMinWKgColumn})`)
					.innerText.split('w/kg').join('');
				let oneMinWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.oneMinWKgColumn})`)
					.innerText.split('w/kg').join('');
				let thirtySeсWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.thirtySeсWKgColumn})`)
					.innerText.split('w/kg').join('');
				let fifteenSeсWKg = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.fifteenSeсWKgColumn})`)
					.innerText.split('w/kg').join('');
				let weight = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.weightColumn})`)
					.innerText.split('kg').join('');
				let avrHeart = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.avrHeartColumn})`)
					.innerText.split('bpm').join('');
				let maxHeart = element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(${theadNumber.maxHeartColumn})`)
					.innerText.split('bpm').join('');


				result.push({
					category,
					rider,
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
					maxHeart
				})
			});
			return result
		})

		fs.writeFile('zwiftpower.json', JSON.stringify(table), (error) => {
			if (error) {
				throw error
			}
			console.log(`Zwiftpower.json saved ${table[0].timeScraping}`);
		})


		await browser.close();
	} catch (error) {
		throw error
	}

}

start()