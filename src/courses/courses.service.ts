import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { userIds, ...courseData } = createCourseDto;

    const course = this.courseRepository.create(courseData);

    if (userIds) {
      const users = await this.userRepository.findByIds(userIds);
      course.users = users;
    }

    return await this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({ relations: ['users'] });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const { userIds, ...updateData } = updateCourseDto;

    const course = await this.courseRepository.preload({
      id,
      ...updateData,
    });

    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }

    if (userIds) {
      const users = await this.userRepository.findByIds(userIds);
      course.users = users;
    }

    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Course with id ${id} not found`);
    }
  }
}
