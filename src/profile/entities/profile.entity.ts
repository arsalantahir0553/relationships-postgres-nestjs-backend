import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @Column()
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
