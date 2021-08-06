const { test, expect } = require('@playwright/test');

// If true, logs every API call
const trace_api_requests = false;

test('dombook', async ({page}) => {  
  var sales_top;

  // Custom checker to return errored API
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

  // Listen for page network requests
  page.on('request', async (request) => {
    if (request.url().includes('https://api.dombook.ru/api/')) {
      if (trace_api_requests) {
        console.log('>>', request.method(), request.url());
      }
    }
    });
  page.on('response', async (response) => {
    if (response.url().includes('https://api.dombook.ru/api/')) {
      if (trace_api_requests) {
        console.log('>>', response.status(), response.url());
      }
      // API endpoint with top sellers
      // Array gets populated only on first load
      if (response.url() == 'https://api.dombook.ru/api/project/top/saleCount' && typeof sales_top === 'undefined') {
        sales_top = await response.json()
      }
      expect(response).apiResponse(200)
      }
    }); 

  await page.goto('https://dombook.ru/');
  for (const house of sales_top) {
    await page.goto(`https://dombook.ru/project/${house.id}`);
    await page.goto('https://dombook.ru/');
  }
});