"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const Joi = require("@hapi/joi");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const posts_module_1 = require("./posts/posts.module");
const database_module_1 = require("./database/database.module");
const authentication_module_1 = require("./authentication/authentication.module");
const exceptions_logger_filter_1 = require("./utils/filters/exceptions-logger.filter");
const categories_module_1 = require("./categories/categories.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            posts_module_1.PostsModule,
            users_module_1.UsersModule,
            authentication_module_1.AuthenticationModule,
            categories_module_1.CategoriesModule,
            config_1.ConfigModule.forRoot({
                validationSchema: Joi.object({
                    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
                    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
                    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
                    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
                    POSTGRES_HOST: Joi.string().required(),
                    POSTGRES_PORT: Joi.number().required(),
                    POSTGRES_USER: Joi.string().required(),
                    POSTGRES_PASSWORD: Joi.string().required(),
                    POSTGRES_DB: Joi.string().required(),
                    AWS_REGION: Joi.string().required(),
                    AWS_ACCESS_KEY_ID: Joi.string().required(),
                    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
                    AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
                    AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
                    PORT: Joi.number(),
                }),
            }),
            database_module_1.DatabaseModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_FILTER, useClass: exceptions_logger_filter_1.ExceptionsLoggerFilter },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map