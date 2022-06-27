import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Merchant } from '../../user/entities/merchant.entity';
import { IsEnum, IsString } from 'class-validator';

export enum PostType {
  Coupon = 'Coupon',
  Item = 'Item',
}

@Entity()
export class Post extends BaseEntity {
  @ManyToOne(() => Merchant, (object) => object.posts, { onDelete: 'CASCADE' })
  merchant: Merchant;

  @Column({ type: 'enum', enum: PostType })
  @IsEnum(PostType)
  type: PostType;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  markdown: string;
}
