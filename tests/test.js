const { test, expect } = require('@playwright/test');

// If true, logs every API call
const trace_api_requests = false;

test('dombook', async ({page}) => {  
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
      expect(response).apiResponse(200)
      }
    }); 

  await page.goto('https://dombook.ru/');

  // Load first 4 projects into array
  let sales_top = []
  for (const elem of (await page.$$('.project-card')).slice(0,4)) {
    sales_top.push(await elem.getAttribute('href'))
  }

  for (const elem of sales_top) {
    await page.goto(`https://dombook.ru${elem}`);
    await page.goto('https://dombook.ru/');
  }
});