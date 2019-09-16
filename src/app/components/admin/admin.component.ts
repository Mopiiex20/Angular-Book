import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import BookService from 'src/app/services/books.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UserService } from 'src/app/services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from 'src/app/models/books-model';
import { UserModel } from 'src/app/models/login-model';


@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, DoCheck {

  public displayedColumns: string[] = ['select', 'ID', 'Title', 'Description', 'Price', 'Edit'];
  public displayedColumnsUsers: string[] = ['ID', 'E-mail', 'Users name', 'Age', 'Permissions'];

  private booksData: any;
  private usersData: any;

  public booksDataSource: any;
  public usersDataSource: any;

  private selection = new SelectionModel<Book>(true, []);
  toggleDeleteSelected: boolean = false;
 private editing: number = null;
 private currentlyEditing: boolean = false


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  DialogRef: MatDialogRef<Dialog>;

  constructor(
    private booksService: BookService,
    private usersService: UserService,
    public dialog: MatDialog
  ) { }

  private EditForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl('')
  });

  startEditing(bookId: any) {
    let curBook = this.booksDataSource._data._value.find(
      (book: Book) => book._id === bookId
    )
    this.EditForm.patchValue({
      title: curBook.title,
      description: curBook.description,
      price: curBook.price
    })
    this.editing = bookId;
    this.currentlyEditing = true
  }

  stopEditing(bookId: number) {
    this.booksService.updateBook(`books/${bookId}`, this.EditForm.value).subscribe(
     
    )
    this.booksData.forEach((book: Book) => {
      if (book._id === bookId) {
        book.title = this.EditForm.value.title;
        book.description = this.EditForm.value.description;
        book.price = this.EditForm.value.price;
      }
    })
    this.editing = undefined;
    this.currentlyEditing = false;
    this.EditForm.reset();

  }

  isAllSelected() {
    if (this.booksDataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.booksDataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.booksDataSource) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.booksDataSource.data.forEach(row => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Book): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id + 1}`;
  }

  ngOnInit() {
    this.booksService.get('books').subscribe((data: any) => {
      data.forEach(book => {
        book.edit = 'edit'
      });
      this.booksData = data;
      this.booksDataSource = new MatTableDataSource<Book>(data);
      this.booksDataSource.sort = this.sort;
    });
    this.usersService.get('users').subscribe((data: any) => {

      this.usersData = data.users;
      this.usersDataSource = new MatTableDataSource<UserModel>(data.users);
      this.usersDataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteSelected() {
    let delArr = [];
    this.selection.selected.forEach(element => {
      delArr.push(element._id)
    });
    const check = confirm('Delete Selected Books?')
    if (check) {
      delArr.forEach(element => {
        this.booksData = this.booksData.filter((book: any) => book._id !== element)

        this.booksService.deleteBook(`${element}`).subscribe(

        )
      });
      this.booksDataSource = new MatTableDataSource<Book>(this.booksData);
      this.selection.clear();
    }
  }
  ngDoCheck() {
    if (this.selection.selected.length !== 0) {
      this.toggleDeleteSelected = true
    } else this.toggleDeleteSelected = false
  }

  openDialog() {
    const dialogRef = this.dialog.open(Dialog);
    dialogRef.afterClosed().subscribe(newBook => {
      this.booksService.get('books').subscribe((data: any) => {
        data.forEach(book => {
          book.edit = 'edit'
        });
        this.booksData = data;
        this.booksDataSource = new MatTableDataSource<Book>(data);
        this.booksDataSource.sort = this.sort;
      });

    });
  }

}

@Component({
  selector: 'asdasdsad',
  templateUrl: './dialog.html',
  styleUrls: ['./admin.component.scss']
})
export class Dialog implements OnInit {

  constructor(private snackBar: MatSnackBar, private bookServise: BookService, public dialogRef: MatDialogRef<Dialog>) { }
  DialogRef: MatDialogRef<Dialog>;


  title = new FormControl('', [
    Validators.required
  ]);
  description = new FormControl('', [
    Validators.required
  ]);
  price = new FormControl('', [
    Validators.required
  ]);

  addBook() {
    if (!this.title.hasError('required')) {
      if (!this.description.hasError('required')) {
        if (!this.price.hasError('required')) {
          const data = {
            title: this.title.value,
            description: this.description.value,
            price: this.price.value
          }
          this.bookServise.create(data).subscribe(
            data1 => {
              this.dialogRef.close(data);
              this.snackBar.open(`${data1.message}`)
            })
        }
      }
    }
  }
  ngOnInit() {
  }
}
