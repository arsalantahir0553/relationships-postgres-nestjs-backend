import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Book } from 'src/books/entities/book.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @ManyToMany(() => Course, (course) => course.users)
  courses: Course[];
}
