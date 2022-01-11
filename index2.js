const puppeteer = require('puppeteer');

//функция обёртка для синхронных операций
async function start() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1
	})
	await page.goto('https://gw.cmo.sai.msu.ru/webcam5.jpg');
	// await page.screenshot({ path: 'example.png' });

	// чтобы дождаться загружаемого селектора:
	await page.waitForSelector('body > img');
	// const subs = await page.$eval('body > img', (elem) => elem.innerText);
	// console.log(suтщвуbs);



	// await page.waitForTimeout(5000)

	await page.screenshot({ path: 'example.png' });



	await browser.close();
}

start()