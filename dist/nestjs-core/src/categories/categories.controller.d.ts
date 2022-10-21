import { FindOneParams } from 'src/utils/validators/param/find-one-params';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    getAllCategories(): Promise<Entity[]>;
    getCategoryById({ id }: FindOneParams): unknown;
    updateCategory(id: string, category: UpdateCategoryDto): any;
}
