import { SaveCaScraper } from './scrapers/saveca';
import * as fs from 'fs';
import * as path from 'path';

interface FlyerCSVRow {
    id: string;
    storeName: string;
    title: string;
    validFrom: string;
    validTo: string;
    postalCode: string;
    sourceUrl: string;
}

function convertToCSV(flyers: any[], postalCode: string): string {
    const headers = ['id', 'storeName', 'title', 'validFrom', 'validTo', 'postalCode', 'sourceUrl'];
    const rows = flyers.map(flyer => [
        flyer.id,
        `"${flyer.storeName.replace(/"/g, '""')}"`, // Escape quotes
        `"${flyer.title.replace(/"/g, '""')}"`,
        flyer.validFrom,
        flyer.validTo,
        flyer.postalCode,
        flyer.sourceUrl
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    return csv;
}

async function scrapeAndSave() {
    const scraper = new SaveCaScraper();

    // Postal codes to scrape
    const postalCodes = ['B3K0H6'];

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    for (const postalCode of postalCodes) {
        console.log(`Scraping ${postalCode}...`);

        try {
            const flyers = await scraper.scrape(postalCode);

            // Save as CSV
            const csv = convertToCSV(flyers, postalCode);
            const csvPath = path.join(dataDir, `${postalCode}.csv`);
            fs.writeFileSync(csvPath, csv, 'utf-8');

            console.log(`✓ Saved ${flyers.length} flyers to ${csvPath}`);
        } catch (error) {
            console.error(`✗ Error scraping ${postalCode}:`, error);
        }
    }

    console.log('\n✓ All done! CSV files saved to data/ directory');
}

scrapeAndSave();
