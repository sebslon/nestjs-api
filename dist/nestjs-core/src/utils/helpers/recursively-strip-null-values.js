"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recursivelyStripNullValues = void 0;
function recursivelyStripNullValues(value) {
    if (Array.isArray(value)) {
        return value.map(recursivelyStripNullValues);
    }
    if (value instanceof Date) {
        return value;
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, value]) => [
            key,
            recursivelyStripNullValues(value),
        ]));
    }
    if (value !== null) {
        return value;
    }
}
exports.recursivelyStripNullValues = recursivelyStripNullValues;
//# sourceMappingURL=recursively-strip-null-values.js.map