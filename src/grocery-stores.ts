/**
 * Grocery chains to retain from the Flipp/Save.ca results.
 *
 * Store names are normalized before comparison so harmless differences in
 * capitalization or spacing do not cause a flyer to be dropped.
 */
export const GROCERY_STORES = [
    'Atlantic Superstore',
    'Sobeys',
    'No Frills',
    'Giant Tiger',
    'Walmart',
    'Food Basics',
    'Wholesale Club and Club Entrepôt',
] as const;

function normalizeStoreName(name: string): string {
    return name.trim().toLocaleLowerCase('en-CA');
}

const groceryStoreNames = new Set(GROCERY_STORES.map(normalizeStoreName));

export function isGroceryStore(name: string): boolean {
    return groceryStoreNames.has(normalizeStoreName(name));
}
