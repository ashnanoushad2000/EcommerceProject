import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';
import { CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 'customer' })
  role: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ type: 'varchar', nullable: true }) // ✅ Fix this
  emailToken: string | null;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
