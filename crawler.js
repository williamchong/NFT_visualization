require('chromedriver');
const webdriver = require('selenium-webdriver');
const jsdom = require("jsdom");
const fs = require("fs");

const { JSDOM } = jsdom;

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function run() {
  const driver = await new webdriver.Builder().forBrowser("chrome").build();
  for (let i = 1; i <= 10000; i += 1) {
    const url = `https://api.opensea.io/api/v1/asset/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/${i}?format=json`;
    await driver.get(url);
    const s = await driver.getPageSource();
    const dom = new JSDOM(s);
    const data = dom.window.document.querySelector('body > pre').textContent;
    console.log(data);
    fs.writeFileSync(`./output/${i}.json`, data);
    await sleep(500);
  }
}

run();
