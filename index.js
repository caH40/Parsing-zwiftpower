require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

const pageForParce = require('./app_modules/page-parce');
const pageCounter = require('./app_modules/pages-counter');

//функция обёртка для синхронных операций
const linkZp = 'https://zwiftpower.com/events.php?zid=2556652';
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
		await page.goto(linkZp, { waitUntil: 'domcontentloaded' });
		const user = process.env.USER;
		const password = process.env.PASSWORD;
		await page.$eval('#username', (elem, user) => (elem.value = user), user);
		await page.$eval('#password', (elem, password) => (elem.value = password), password);
		await page.click('#login > fieldset > div.row.mobile-fix > div:nth-child(1) > input.btn.btn-success.btn-block.btn-lg');
		await page.waitForTimeout(6000);

		const numberPages = await pageCounter(page);

		let parcerPage = await pageForParce(page);

		for (let i = 3; i < pages + 2; i++) {
			await page.click(`#table_event_results_final_paginate > ul > li:nth-child(${i}) > a`);
			await page.waitForTimeout(5000);
			parcerPage = await pageForParce(page);


		}
		await browser.close();
	} catch (error) {
		throw error
	}
}
start()
