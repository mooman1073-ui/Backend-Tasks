import { User } from "./User";
import type { NoteBook } from "./NoteBook";

export class Admin extends User {
  public manageNotes(notebook: NoteBook, noteId: number): boolean {
    return notebook.removeNote(noteId);
  }
}
