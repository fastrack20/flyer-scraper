import axios from 'axios';
import { Flyer, Scraper, ProductDetail } from '../types';
import { isGroceryStore } from '../grocery-stores';

export class SaveCaScraper implements Scraper {
    private baseUrl = 'https://backflipp.wishabi.com/flipp';

    async scrape(postalCode: string): Promise<Flyer[]> {
        try {
            const url = `${this.baseUrl}/flyers?postal_code=${postalCode}`;
            console.log(`Fetching flyers for ${postalCode}...`);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const data = response.data;
            const rawFlyers = Array.isArray(data) ? data : (data.flyers || []);

            console.log(`Found ${rawFlyers.length} flyers.`);

            const flyers: Flyer[] = rawFlyers.map((raw: any) => ({
                id: raw.id?.toString() || 'unknown',
                storeName: raw.merchant || raw.name || 'Unknown Store',
                storeAddress: this.extractAddress(raw),
                title: raw.name || raw.title || 'No Title',
                validFrom: raw.valid_from || '',
                validTo: raw.valid_to || '',
                postalCode: postalCode,
                sourceUrl: `https://flipp.com/flyer/${raw.id}-${raw.flyer_run_id || ''}`
            }));

            const groceryFlyers = flyers.filter(flyer => isGroceryStore(flyer.storeName));
            console.log(`Keeping ${groceryFlyers.length} flyers from the grocery-store allowlist.`);
            return groceryFlyers;

        } catch (error) {
            console.error('Error scraping flyers:', error);
            return [];
        }
    }

    async scrapeProducts(postalCode: string): Promise<ProductDetail[]> {
        try {
            console.log(`\nScraping product details for ${postalCode}...`);

            // First get all flyers
            const flyers = await this.scrape(postalCode);
            const allProducts: ProductDetail[] = [];

            // Limit to first 10 flyers to avoid overwhelming the API
            const flyersToProcess = flyers.slice(0, 10);

            for (const flyer of flyersToProcess) {
                console.log(`  Fetching items from ${flyer.storeName}...`);

                try {
                    const itemsUrl = `${this.baseUrl}/items/search?flyer_ids=${flyer.id}&postal_code=${postalCode}`;

                    const response = await axios.get(itemsUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    const data = response.data;
                    const items = data.items || data.ecom_items || [];

                    console.log(`    Found ${items.length} items`);

                    for (const item of items) {
                        allProducts.push({
                            flyerId: flyer.id,
                            storeName: flyer.storeName,
                            storeAddress: flyer.storeAddress || 'N/A',
                            productName: item.name || item.title || 'Unknown Product',
                            brand: item.brand || item.brand_name || 'N/A',
                            salePrice: this.formatPrice(item.current_price || item.sale_price || item.price),
                            regularPrice: this.formatPrice(item.original_price || item.regular_price),
                            unitSize: item.size || item.unit_size || 'N/A',
                            validUnit: item.unit || item.valid_unit || 'each',
                            imageUrl: this.extractImageUrl(item),
                            validFrom: flyer.validFrom,
                            validTo: flyer.validTo,
                            category: item.category || item.category_name || 'N/A',
                            postalCode: postalCode
                        });
                    }

                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (error: any) {
                    console.log(`    Error fetching items: ${error.message}`);
                    continue;
                }
            }

            console.log(`\nTotal products scraped: ${allProducts.length}`);
            return allProducts;

        } catch (error) {
            console.error('Error scraping products:', error);
            return [];
        }
    }

    private extractAddress(flyer: any): string {
        if (flyer.store_address) return flyer.store_address;
        if (flyer.address) return flyer.address;

        const parts = [];
        if (flyer.street) parts.push(flyer.street);
        if (flyer.city) parts.push(flyer.city);
        if (flyer.province) parts.push(flyer.province);

        return parts.length > 0 ? parts.join(', ') : 'N/A';
    }

    private formatPrice(price: any): string {
        if (!price) return 'N/A';
        if (typeof price === 'number') return `$${price.toFixed(2)}`;
        if (typeof price === 'string') return price.startsWith('$') ? price : `$${price}`;
        return 'N/A';
    }

    private extractImageUrl(item: any): string {
        if (item.image_url) return item.image_url;
        if (item.cutout_image_url) return item.cutout_image_url;
        if (item.thumbnail_url) return item.thumbnail_url;
        if (item.images && item.images.length > 0) return item.images[0];
        return 'N/A';
    }
}
