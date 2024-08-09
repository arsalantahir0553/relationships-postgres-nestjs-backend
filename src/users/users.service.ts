import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Create the user
    const { profile, ...userData } = createUserDto;
    const newUser = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(newUser);

    // Create the profile if provided
    if (profile) {
      const { bio, avatarUrl } = profile;
      const newProfile = this.profileRepository.create({
        bio,
        avatarUrl,
        user: savedUser,
      });
      await this.profileRepository.save(newProfile);
    }

    // Return the user with profile relation
    return this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['profile'],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['profile'] });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
