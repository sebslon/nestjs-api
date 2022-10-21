"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedConfigService = void 0;
exports.mockedConfigService = {
    get: (key) => {
        switch (key) {
            case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
                return 3600;
        }
    },
};
//# sourceMappingURL=config.service.js.map