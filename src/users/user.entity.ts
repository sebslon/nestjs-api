import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

import Address from './address.entity';
import Post from '../posts/post.entity';
import PublicFile from '../files/public-file.entity';
import PrivateFile from '../files-private/private-file.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  @JoinColumn()
  public avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];
}
export default User;
