import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BookProperties } from './types/book-properties.interface';
import { CarProperties } from './types/car-properties.interface';

import ProductCategory from '../product-categories/product-category.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  public category: ProductCategory;

  @Column({ type: 'jsonb' })
  public properties: CarProperties | BookProperties;
}
export default Product;
