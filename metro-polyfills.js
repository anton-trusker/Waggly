/**
 * Polyfills for Metro bundler
 * This file must be required before any Metro imports to ensure polyfills are loaded
 */

// Polyfill for Array.prototype.toReversed (Node < 20)
if (!Array.prototype.toReversed) {
    // @ts-expect-error
    Array.prototype.toReversed = function () {
        return this.slice().reverse();
    };
}

// Polyfill for Array.prototype.toSorted (Node < 20)
if (!Array.prototype.toSorted) {
    // @ts-expect-error
    Array.prototype.toSorted = function (compareFn) {
        return this.slice().sort(compareFn);
    };
}

// Polyfill for Object.groupBy (Node < 21)
if (!Object.groupBy) {
    // @ts-expect-error
    Object.groupBy = function (items, keySelector) {
        return items.reduce((acc, item, index) => {
            const key = keySelector(item, index);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    };
}
