const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Pretend to be a real browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  );

  console.log('Navigating to page...');
  await page.goto('https://diskprices.com/', {
    waitUntil: 'domcontentloaded'
  });

  // Wait for Cloudflare challenge to finish
  console.log('Waiting for diskprices table to appear...');
  await page.waitForSelector('table#diskprices');

  // data ohm nom nom
  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll('table#diskprices tbody tr.disk');
    return Array.from(rows).map(row => {
      const pricePerTB = row.querySelector('td.price-per-tb')?.textContent.trim() || 'N/A';
      const price = row.querySelectorAll('td')[2]?.textContent.trim() || 'N/A';
      const warranty = row.querySelectorAll('td')[4]?.textContent.trim().toLowerCase() || 'N/A';
      const link = row.querySelector('td.name a')?.href || 'N/A';
      return { pricePerTB, price, warranty, link };
    });
  });

  // Process the data
  const enrichedData = data.map(item => {
    const pricePerTBNum = parseFloat(item.pricePerTB.replace(/[^0-9.]/g, ''));
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));

    let warrantyYears = null;
    if (item.warranty.includes('month')) {
      const months = parseFloat(item.warranty);
      if (!isNaN(months)) warrantyYears = months / 12;
    } else if (item.warranty.includes('year')) {
      const years = parseFloat(item.warranty);
      if (!isNaN(years)) warrantyYears = years;
    }

    let pricePerTBPerYear = 'N/A';
    if (!isNaN(pricePerTBNum) && !isNaN(warrantyYears) && warrantyYears > 0) {
      pricePerTBPerYear = (pricePerTBNum / warrantyYears).toFixed(2) + ' $/TB/year';
    }

    return {
      ...item,
      warrantyYears: warrantyYears ? warrantyYears.toFixed(2) : 'N/A',
      pricePerTBPerYear
    };
  });

  // Filter out entries where pricePerTBPerYear is not a number
  const filteredData = enrichedData.filter(item => !isNaN(parseFloat(item.pricePerTBPerYear)));

  // Sort by pricePerTBPerYear (ascending)
  const sortedData = filteredData.sort(
    (a, b) => parseFloat(a.pricePerTBPerYear) - parseFloat(b.pricePerTBPerYear)
  );

  // Take the top 10
  const top10 = sortedData.slice(0, 15);

  console.log('Top 10 Best Drives (by Price per TB per Year):');
  console.table(top10);

//   console.log('Scraped items:', enrichedData.length);
//   console.log(enrichedData);

  await browser.close();
})();
