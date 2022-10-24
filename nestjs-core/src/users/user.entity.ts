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
import Comment from '../comments/comment.entity';
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

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

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

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  public comments: Comment[];

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;
}
export default User;
