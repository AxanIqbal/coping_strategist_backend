import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Merchant extends BaseEntity {
  @OneToOne(() => User, (object) => object.merchant, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Post, (object) => object.merchant)
  posts: Post[];
}
