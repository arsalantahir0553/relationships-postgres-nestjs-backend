import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProfilesService } from './profile.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post(':userId')
  createProfile(
    @Param('userId') userId: string, // use string and convert to number inside service
    @Body() body: { bio: string; avatarUrl: string },
  ) {
    return this.profilesService.createProfile(
      +userId,
      body.bio,
      body.avatarUrl,
    );
  }

  @Get(':userId')
  getProfile(@Param('userId') userId: string) {
    return this.profilesService.getProfile(+userId);
  }

  @Patch(':userId')
  updateProfile(
    @Param('userId') userId: string,
    @Body() body: { bio: string; avatarUrl: string },
  ) {
    return this.profilesService.updateProfile(
      +userId,
      body.bio,
      body.avatarUrl,
    );
  }

  @Delete(':userId')
  deleteProfile(@Param('userId') userId: string) {
    return this.profilesService.deleteProfile(+userId);
  }
}
