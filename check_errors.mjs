import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        let errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(`Console Error: ${msg.text()}`);
            }
        });
        page.on('pageerror', error => {
            errors.push(`Page Error: ${error.message}`);
        });

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
        
        console.log('--- ERRORS ---');
        console.log(errors.join('\n'));
        console.log('--- END ERRORS ---');
        
        await browser.close();
    } catch (e) {
        console.log('Script failed:', e.message);
    }
})();
