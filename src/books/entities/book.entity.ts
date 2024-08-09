import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'date' })
  publishedDate: string;

  @Column()
  isbn: string;

  @ManyToOne(() => User, (user) => user.books)
  user: User;
}
