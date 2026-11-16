import type { NoteBook } from "./NoteBook";

export class User {
  public id: number;
  public name: string;
  public email: string;
  private password: string;
  private phone: string;
  protected age: number;
  private notebooks: NoteBook[] = [];

  constructor(
    userId: number,
    userName: string,
    userEmail: string,
    userPassword: string,
    userPhone: string,
    userAge: number
  ) {
    if (userAge >= 18 && userAge <= 60) {
      this.age = userAge;
    } else {
      throw new Error("Age must be between 18 and 60.");
    }

    this.id = userId;
    this.name = userName;
    this.email = userEmail;
    this.password = userPassword;
    this.phone = userPhone;
  }

  public displayInfo(): void {
    console.log(this.id);
    console.log(this.name);
    console.log(this.email);
    console.log(this.phone);
    console.log(this.age);
  }

  public addNotebook(notebook: NoteBook): void {
    if (!this.notebooks.includes(notebook)) {
      this.notebooks.push(notebook);
    }
  }

}
