import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProfile(
    userId: number,
    bio: string,
    avatarUrl: string,
  ): Promise<Profile> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const profile = this.profileRepository.create({ bio, avatarUrl, user });
    return await this.profileRepository.save(profile);
  }

  async getProfile(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateProfile(
    userId: number,
    bio: string,
    avatarUrl: string,
  ): Promise<Profile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.bio = bio;
    profile.avatarUrl = avatarUrl;
    return await this.profileRepository.save(profile);
  }

  async deleteProfile(userId: number): Promise<void> {
    const profile = await this.getProfile(userId);
    if (profile) {
      await this.profileRepository.remove(profile);
    }
  }
}
