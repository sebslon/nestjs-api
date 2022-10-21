"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class PostNotFoundException extends common_1.NotFoundException {
    constructor(id) {
        super(`Post with id ${id} not found`);
    }
}
exports.PostNotFoundException = PostNotFoundException;
//# sourceMappingURL=post-not-found.exception.js.map