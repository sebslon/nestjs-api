"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class CategoryNotFoundException extends common_1.NotFoundException {
    constructor(id) {
        super(`Category with id ${id} not found`);
    }
}
exports.CategoryNotFoundException = CategoryNotFoundException;
//# sourceMappingURL=category-not-found.exception.js.map