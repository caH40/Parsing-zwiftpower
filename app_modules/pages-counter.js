async function pagesCounter(page) {
	try {
		// поиск кнопок пагинации, если их только две, значит результатов еще нет и присутствуют кнопки "Previous", "Next"
		const serviceKeys = 2; // количество служебных кнопок пагинации
		let pages = await page.$$eval('#table_event_results_final_paginate > ul > li', element => element.length) - serviceKeys;
		return pages;
	} catch (error) {
		console.log(error);
	}
}

module.exports = pagesCounter