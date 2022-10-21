"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateFilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const private_files_service_1 = require("./private-files.service");
const private_file_entity_1 = require("./private-file.entity");
let PrivateFilesModule = class PrivateFilesModule {
};
PrivateFilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([private_file_entity_1.default]), config_1.ConfigModule],
        providers: [private_files_service_1.PrivateFilesService],
        exports: [private_files_service_1.PrivateFilesService],
    })
], PrivateFilesModule);
exports.PrivateFilesModule = PrivateFilesModule;
//# sourceMappingURL=private-file.module.js.map