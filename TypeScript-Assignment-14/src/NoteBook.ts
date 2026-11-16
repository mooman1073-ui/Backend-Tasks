import { Note } from "./Note";
import { User } from "./User";

export class NoteBook {
  private notes: Note[] = [];

  public addNote(
    id: number,
    title: string,
    content: string,
    author: User
  ): void {
    const note = new Note(id, title, content, author);
    this.notes.push(note);
  }

  public removeNote(id: number): boolean {
    const previousCount = this.notes.length;
    this.notes = this.notes.filter((note) => note.id !== id);
    return this.notes.length < previousCount;
  }

}
