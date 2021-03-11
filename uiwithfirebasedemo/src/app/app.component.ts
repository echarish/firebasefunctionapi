import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Book } from './model/book';
import { BookItem } from './model/book-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  allBooks = [];

  async selectAll() {
    try {
      console.log(environment.readAll);
      console.log('calling read all endpoint');

      this.allBooks = [];
      const output = await fetch(environment.readAll);
      const outputJSON = await output.json();
      this.allBooks = outputJSON;
      console.log('Success');
      console.log(outputJSON);
    } catch (error) {
      console.log(error);
    }
  }

  // really this is create but the flow is that
  // click the "create item" button which appends a blank value to the array, then click save to actually create it permanently
  async saveItem(bookItem: BookItem) {
    try {
      console.log(environment.create);
      console.log('calling create item endpoint with: ' + bookItem);

      const requestBody = {
        id: bookItem.id,
        book: bookItem.book
      };

      const createResponse =
        await fetch(environment.create, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      console.log('Success');
      console.log(createResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  async updateItem(bookItem: BookItem) {
    try {
      console.log(environment.update);
      console.log('calling update endpoint with id ' + bookItem.id + ' and value "' + bookItem.book);
      console.log(bookItem.book);

      const requestBody = { book: bookItem.book };

      console.log(JSON.stringify(requestBody))

      const updateResponse =
        await fetch(environment.update + bookItem.id, {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      console.log('Success');
      console.log(updateResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(bookItem: BookItem) {
    try {
      console.log(environment.delete);
      console.log('calling delete endpoint with id ' + bookItem.id);

      const deleteResponse =
        await fetch(environment.delete + bookItem.id, {
          method: 'DELETE'
        });

      console.log('Success');
      console.log(deleteResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  createBook() {
    let book: Book = {
      title: '',
      price: '',
      available_quantity: 0
    }
    this.allBooks.push({
      id: '',
      book: book,
    });
  }

}
