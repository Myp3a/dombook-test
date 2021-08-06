const { test, expect } = require('@playwright/test');

const trace_api_requests = false;

test('dombook', async ({page}) => {  
  //const browser = await chromium.launch();  
  //const page = await browser.newPage();
  var sales_top;

  expect.extend({
    apiResponse(received, code) {
      if (received.status() == code) {
        return {
          message: () => `Expected status ${code}, received ${received.status()} on ${received.url()}`,
          pass: true
        };
      } else {
        return {
          message: () => `Expected status ${code}, received ${received.status()} on ${received.url()}`,
          pass: false
        };
      }
    }
  });

  page.on('request', async (request) => {
    //console.log('>>', request.method(), request.url());
    if (request.url().includes('https://api.dombook.ru/api/')) {
      if (trace_api_requests) {
        console.log('>>', request.method(), request.url());
      }
    }
    });
  page.on('response', async (response) => {
    //console.log('<<', response.status(), response.url())); 
    if (response.url().includes('https://api.dombook.ru/api/')) {
      if (trace_api_requests) {
        console.log('>>', response.status(), response.url());
      }
      if (response.url() == 'https://api.dombook.ru/api/project/top/saleCount' && typeof sales_top === 'undefined') {
        sales_top = await response.json()
      }
      expect(response).apiResponse(200)
        //console.log(response.url(), 'failed with code', response.status())
      }
    }); 

  await page.goto('https://dombook.ru/');
  for (const house of sales_top) {
    await page.goto(`https://dombook.ru/project/${house.id}`);
    await page.goto('https://dombook.ru/');
  }
});