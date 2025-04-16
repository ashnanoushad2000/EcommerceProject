import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderProduct } from '../orders/order-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 4.5 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'int', default: 0 })
  discountPercent: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  updated_at: Date;

  @OneToMany(() => OrderProduct, (op) => op.product)
  orderProducts: OrderProduct[];
}