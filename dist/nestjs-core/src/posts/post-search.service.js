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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
let PostsSearchService = class PostsSearchService {
    constructor(elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
        this.index = 'posts';
    }
    async indexPost(post) {
        return this.elasticsearchService.index({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id,
            },
        });
    }
    async search(text, offset, limit, startId) {
        let separateCount = 0;
        if (startId) {
            separateCount = await this.count(text, ['title', 'paragraphs']);
        }
        const { hits } = await this.elasticsearchService.search({
            index: this.index,
            from: offset,
            size: limit,
            body: {
                query: {
                    bool: {
                        should: {
                            multi_match: {
                                query: text,
                                fields: ['title', 'paragraphs'],
                            },
                        },
                        filter: {
                            range: {
                                id: {
                                    gt: startId,
                                },
                            },
                        },
                    },
                },
                sort: {
                    id: {
                        order: 'asc',
                    },
                },
            },
        });
        const results = hits.hits.map((item) => item._source);
        const count = hits.total;
        return {
            count: startId ? separateCount : count,
            results,
        };
    }
    async remove(postId) {
        return await this.elasticsearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: postId,
                    },
                },
            },
        });
    }
    async update(post) {
        const newBody = {
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author.id,
        };
        const script = Object.entries(newBody).reduce((result, [key, value]) => {
            return `${result} ctx._source.${key} = '${value}';`;
        }, '');
        return this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: post.id,
                    },
                },
                script: { source: script },
            },
        });
    }
    async count(query, fields) {
        const { count } = await this.elasticsearchService.count({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields,
                    },
                },
            },
        });
        return count;
    }
};
PostsSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService])
], PostsSearchService);
exports.default = PostsSearchService;
//# sourceMappingURL=post-search.service.js.map