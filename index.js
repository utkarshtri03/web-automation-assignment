const puppeteer = require('puppeteer');

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

  async goToSwapDefillama() {
    await this.page.goto('https://swap.defillama.com');
  }

  async fillForm() {
    await this.page.type('#react-select-2-input', 'Arbitrum One');
    await this.page.keyboard.press('Enter');

    const inputSelector = 'input.chakra-input.css-lv0ed5';
    await this.page.waitForSelector(inputSelector);
    await this.page.$eval(inputSelector, (input) => (input.value = ''));
    await this.page.type(inputSelector, '12');
  }

  async performActions() {
    const btn1 = await this.page.$$('[class="chakra-button css-qjhap"]');
    await btn1[0].click();
    await this.page.type('input.chakra-input.css-s1d1f4', 'wbtc');
    await this.page.waitForTimeout(1000);
    const example = await this.page.$$('[class="sc-b49748d5-3 cjxQGj"]');
    await example[0].click();

    await btn1[1].click();
    await this.page.waitForSelector('div.List');
    const exam = await this.page.$$('[class="sc-b49748d5-3 cjxQGj"]');
    await exam[4].click();

    await this.page.waitForTimeout(25000);
    const route = await this.page.$$(
      '[class="sc-18d0abec-0 knYyMy RouteWrapper"]'
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

// Usage:
const scraper = new SwapDefillamaScraper();
scraper.scrape();
