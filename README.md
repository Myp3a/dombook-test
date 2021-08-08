# dombook-test
Test suite for https://dombook.ru/

# Test case
1. Load main page
2. Go to every project in "Top Sellers" and return to main page
3. Check, if every API request to https://api.dombook.ru/api/ returned status 200

# Installation
Install NodeJS from https://nodejs.org/en/download/  

Install required packages
```
npm install
```

# Usage
Run in console
```
npx playwright test --timeout=60000
```
