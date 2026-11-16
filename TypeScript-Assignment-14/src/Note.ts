import { User } from "./User";

export class Note {
  public id: number;
  public title: string;
  public content: string;
  public author: User;

  constructor(noteId: number, noteTitle: string, noteContent: string, noteAuthor: User) {
    this.id = noteId;
    this.title = noteTitle;
    this.content = noteContent;
    this.author = noteAuthor;
  }

  public preview(): string {
    return this.content.slice(0, 5);
  }

  // The assignment calls the author reference "userId" (its type is User).
  public get userId(): User {
    return this.author;
  }
}
