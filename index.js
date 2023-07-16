const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

class SwapDefillamaScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  }

  async createPage() {
    this.page = await this.browser.newPage();
  }

  // Opening the url swap.defillama
  async goToSwapDefillama() {
    await this.page.goto('https://swap.defillama.com');
  }

  // Filling the form
  async fillForm() {
    // Entering Arbitrum one in chain field
    await this.page.type('#react-select-2-input', 'Arbitrum');
    await this.page.keyboard.press('Enter');

    // Entering 12 in "You Sell" field
    const inputSelector = 'input.chakra-input.css-lv0ed5';
    await this.page.waitForSelector(inputSelector);
    await this.page.$eval(inputSelector, (input) => (input.value = ''));
    await this.page.type(inputSelector, '12');
  }

  async performActions() {
    // Selecting WBTC
    const btn1 = await this.page.$$('[class="chakra-button css-qjhap"]');
    await btn1[0].click();
    await this.page.type('input.chakra-input.css-s1d1f4', 'wbtc');
    await this.page.waitForTimeout(1000);
    const example = await this.page.$$('[class="sc-b49748d5-3 cjxQGj"]');
    await example[0].click();

    // Selecting USDC
    await btn1[1].click();
    await this.page.waitForSelector('div.List');
    await this.page.type('input.chakra-input.css-s1d1f4', 'usd');
    await this.page.waitForTimeout(1000);
    const exam2 = await this.page.$$('[class="sc-b49748d5-3 cjxQGj"]');
    await exam2[1].click();

    await this.page.waitForTimeout(25000);
    const route = await this.page.$$(
      '[class="sc-d413ea6e-0 ppUJr RouteWrapper"]'
    );
    await route[1].click();
  }

  async scrape() {
    try {
      await this.launchBrowser();
      await this.createPage();
      await this.goToSwapDefillama();
      await this.fillForm();
      await this.performActions();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}

app.get('/scrape', async (req, res) => {
  try {
    const scraper = new SwapDefillamaScraper();
    await scraper.scrape();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred during scraping.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
