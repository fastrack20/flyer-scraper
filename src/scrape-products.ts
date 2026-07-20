import { SaveCaScraper } from './scrapers/saveca';
import * as fs from 'fs';
import * as path from 'path';

function convertToCSV(products: any[]): string {
    const headers = [
        'flyerId',
        'storeName',
        'storeAddress',
        'productName',
        'brand',
        'salePrice',
        'regularPrice',
        'unitSize',
        'validUnit',
        'imageUrl',
        'validFrom',
        'validTo',
        'category',
        'postalCode'
    ];

    const rows = products.map(product => [
        product.flyerId,
        `"${(product.storeName || '').replace(/"/g, '""')}"`,
        `"${(product.storeAddress || '').replace(/"/g, '""')}"`,
        `"${(product.productName || '').replace(/"/g, '""')}"`,
        `"${(product.brand || '').replace(/"/g, '""')}"`,
        product.salePrice,
        product.regularPrice,
        `"${(product.unitSize || '').replace(/"/g, '""')}"`,
        product.validUnit,
        `"${(product.imageUrl || '').replace(/"/g, '""')}"`,
        product.validFrom,
        product.validTo,
        `"${(product.category || '').replace(/"/g, '""')}"`,
        product.postalCode
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
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Processing ${postalCode}...`);
        console.log('='.repeat(60));

        try {
            const products = await scraper.scrapeProducts(postalCode);

            if (products.length === 0) {
                console.log(`⚠️ No products found for ${postalCode}`);
                continue;
            }

            // Save as CSV
            const csv = convertToCSV(products);
            const csvPath = path.join(dataDir, `${postalCode}_products.csv`);
            fs.writeFileSync(csvPath, csv, 'utf-8');

            console.log(`✓ Saved ${products.length} products to ${csvPath}`);
        } catch (error) {
            console.error(`✗ Error scraping ${postalCode}:`, error);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✓ All done! Product CSV files saved to data/ directory');
    console.log('='.repeat(60));
}

scrapeAndSave();
