import { NotFoundException } from '@nestjs/common';
export declare class PostNotFoundException extends NotFoundException {
    constructor(id: number);
}
