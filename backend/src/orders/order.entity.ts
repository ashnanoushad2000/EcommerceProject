// order.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderProduct } from './order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { eager: true }) // ✅ eager fetch user
  user: User;

  @OneToMany(() => OrderProduct, (op) => op.order, { cascade: true })
  orderProducts: OrderProduct[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ default: 'Pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
