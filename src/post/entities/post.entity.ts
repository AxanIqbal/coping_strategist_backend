import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Merchant } from '../../user/entities/merchant.entity';

@Entity()
export class Post extends BaseEntity {
  @ManyToOne(() => Merchant, (object) => object.posts, { onDelete: 'CASCADE' })
  merchant: Merchant;

  @Column()
  markdown: string;
}
