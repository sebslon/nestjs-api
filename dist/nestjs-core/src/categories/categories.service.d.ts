import { Repository } from 'typeorm';
import Category from './category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    getAllCategories(): Promise<Entity[]>;
    getCategoryById(id: number): unknown;
    updateCategory(id: number, category: UpdateCategoryDto): any;
}
