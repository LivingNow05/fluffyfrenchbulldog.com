const { chromium, devices } = require('playwright');
const fs = require('fs');

(async () => {
    const urls = [
        'http://localhost:4321/',
        'http://localhost:4321/bulldog-frances-fluffy-bogota/',
        'http://localhost:4321/precios-bulldog-fluffy/',
        'http://localhost:4321/colores/fluffy-blue/',
        'http://localhost:4321/destinos/'
    ];

    let report = "QA Automation Report\n====================\n\n";
    
    let browser;
    try {
        browser = await chromium.launch();
    } catch (e) {
        console.error("Failed to launch browser", e);
        process.exit(1);
    }
    
    async function checkUrls(context, deviceName) {
        report += `\nTesting on ${deviceName}\n--------------------\n`;
        const page = await context.newPage();
        
        for (const url of urls) {
            report += `\nTesting URL: ${url}\n`;
            let hasErrors = false;
            
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    report += `  [Console Error] ${msg.text()}\n`;
                    hasErrors = true;
                }
            });
            
            page.on('pageerror', error => {
                report += `  [Page Error] ${error.message}\n`;
                hasErrors = true;
            });

            try {
                const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                if (response && response.status() >= 400) {
                    report += `  [HTTP Error] Status: ${response.status()}\n`;
                    hasErrors = true;
                }
                
                // Check internal links on this page for 404s
                const links = await page.$$eval('a', as => as.map(a => a.href).filter(href => href.startsWith('http://localhost:4321')));
                const uniqueLinks = [...new Set(links)];
                
                for (const link of uniqueLinks) {
                    try {
                        const linkResponse = await context.request.get(link);
                        if (linkResponse.status() === 404) {
                            report += `  [Broken Link] ${link} returns 404\n`;
                            hasErrors = true;
                        }
                    } catch (e) {
                        // ignore fetch errors
                    }
                }
                
            } catch (error) {
                report += `  [Navigation Error] ${error.message}\n`;
                hasErrors = true;
            }
            
            if (!hasErrors) {
                report += `  [OK] No errors found.\n`;
            }
        }
        await page.close();
    }
    
    // Desktop
    const desktopContext = await browser.newContext();
    await checkUrls(desktopContext, 'Desktop Chrome');
    
    // Mobile
    const mobileContext = await browser.newContext({
      ...devices['Pixel 5'],
    });
    await checkUrls(mobileContext, 'Mobile Pixel 5');

    await browser.close();
    
    fs.writeFileSync('qa_report.txt', report);
    console.log("QA finished, report generated.");
})();
