export class CreateBookDto {
  title: string;
  author: string;
  publishedDate: string;
  isbn: string;
  userId: number; // Added userId for association
}
