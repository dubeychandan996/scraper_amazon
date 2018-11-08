
const request = require('request-promise');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const amz_scr = async (url, currency, debug) => {
  debug = (debug) ? debug : false;
  return new Promise(async(resolve, reject) => {
    return await request(url).then(async (html) => {
          const $ = cheerio.load(html);
          const title = $('#productTitle').text().trim();
          const price = await $('#priceblock_ourprice').text().replace( `${currency} `, '')
          const availability = await $('span', '#availability').text().trim()
          let seller = $('#merchant-info').text().trim().replace(new RegExp('\\n', 'g'), '').replace(new RegExp('  ', 'g'), '');
          seller = seller.slice(0, seller.indexOf('.')+1)
          if(debug){
            let browser = await puppeteer.launch({ headless: false });
            let page = await browser.newPage({ width: 1920, height: 926 });
            await page.goto(url);
            await page.screenshot({ path: './image.jpg', type: 'jpeg' });
            await page.close();
            await browser.close();
          }

          return resolve({'price': price, 'availability': availability, 'seller': seller, 'title': title})
    }).catch((err)=>{
      return reject(err)
    });
  })
}

module.exports = amz_scr
