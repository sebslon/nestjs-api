"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const post_not_found_exception_1 = require("./exceptions/post-not-found.exception");
const post_entity_1 = require("./post.entity");
const post_search_service_1 = require("./post-search.service");
let PostsService = class PostsService {
    constructor(postsRepository, postsSearchService) {
        this.postsRepository = postsRepository;
        this.postsSearchService = postsSearchService;
    }
    async getAllPosts(offset, limit, startId) {
        const where = {};
        let separateCount = 0;
        if (startId) {
            where.id = (0, typeorm_1.MoreThan)(startId);
            separateCount = await this.postsRepository.count();
        }
        const [items, count] = await this.postsRepository.findAndCount({
            relations: ['author'],
            order: { id: 'ASC' },
            skip: offset,
            take: limit,
        });
        return { items, count: startId ? separateCount : count };
    }
    async getPostById(id) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (post)
            return post;
        throw new post_not_found_exception_1.PostNotFoundException(id);
    }
    async updatePost(id, post) {
        await this.postsRepository.update(id, post);
        const updatedPost = await this.postsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (updatedPost) {
            await this.postsSearchService.update(updatedPost);
            return updatedPost;
        }
        throw new post_not_found_exception_1.PostNotFoundException(id);
    }
    async createPost(post, user) {
        const newPost = await this.postsRepository.create(Object.assign(Object.assign({}, post), { author: user }));
        await this.postsRepository.save(newPost);
        this.postsSearchService.indexPost(newPost);
        return newPost;
    }
    async deletePost(id) {
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected)
            throw new post_not_found_exception_1.PostNotFoundException(id);
        this.postsSearchService.remove(id);
    }
    async searchForPosts(text, offset, limit, startId) {
        const { results, count } = await this.postsSearchService.search(text, offset, limit, startId);
        const ids = results.map((result) => result.id);
        if (!ids.length)
            return [];
        const posts = this.postsRepository.find({ where: { id: (0, typeorm_1.In)(ids) } });
        return posts;
    }
    async getPostsWithParagraph(paragraph) {
        return this.postsRepository.query('SELECT * FROM post WHERE $1 = ANY(paragraphs)', [paragraph]);
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(post_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        post_search_service_1.default])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map