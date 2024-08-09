import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { userId, ...bookData } = createBookDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newBook = this.bookRepository.create({ ...bookData, user });
    return await this.bookRepository.save(newBook);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Book> {
    return await this.bookRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const { userId, ...updateData } = updateBookDto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      // Load the existing book entity to update it
      const book = await this.bookRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!book) {
        throw new Error('Book not found');
      }
      // Update the book properties
      Object.assign(book, updateData);
      book.user = user;
      return await this.bookRepository.save(book);
    } else {
      await this.bookRepository.update(id, updateData);
      return this.findOne(id); // Return the updated book
    }
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
