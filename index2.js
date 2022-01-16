require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

//функция обёртка для синхронных операций
const linkZp = 'https://zwiftpower.com/events.php?zid=2556665';
async function start() {
	try {
		// открываем браузер
		// const browser = await puppeteer.launch();
		const browser = await puppeteer.launch({ headless: false, slowMo: 100, devtools: true })
		// открываем страницу в браузере
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
			deviceScaleFactor: 1
		});
		await page.goto(linkZp, { waitUntil: 'domcontentloaded' });
		const user = process.env.USER;
		const password = process.env.PASSWORD;
		await page.$eval('#username', (elem, user) => (elem.value = user), user);
		await page.$eval('#password', (elem, password) => (elem.value = password), password);
		await page.click('#login > fieldset > div.row.mobile-fix > div:nth-child(1) > input.btn.btn-success.btn-block.btn-lg');
		await page.waitForTimeout(6000);
	} catch (error) {
		throw error
	}
	return page
}
const a = start()
const table = a.evaluate(async () => {

	let container = await document.querySelectorAll('#table_event_results_final > tbody > tr');
	let i = 0;

	container.forEach(element => {
		i++
		let category = (element.querySelector(`#table_event_results_final > tbody > tr:nth-child(${i}) > td:nth-child(3)`) ?? { innerText: "" })
			.innerText;
		console.log(category)
	})

})
// await browser.close();




