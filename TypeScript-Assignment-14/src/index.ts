import { User } from "./User";
import { Admin } from "./Admin";
import { Note } from "./Note";
import { NoteBook } from "./NoteBook";
import { Storage } from "./Storage";

const user = new User(1, "Ali", "ali@example.com", "demo-password", "0612345678", 30);
const admin = new Admin(2, "Omar", "omar@example.com", "demo-password", "0611111111", 35);
user.displayInfo();

const note = new Note(1, "Study", "Review TypeScript today", user);
console.log(note.preview());

const notebook = new NoteBook();
notebook.addNote(1, "Study", "Review TypeScript today", user);
user.addNotebook(notebook);
user.addNotebook(new NoteBook());
console.log(admin.manageNotes(notebook, 1));

const storage = new Storage<User>();
storage.addItem(user);
storage.removeItem(user);
console.log(storage.getAllItems());
