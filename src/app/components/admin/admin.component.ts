import { Component, OnInit, OnChanges, DoCheck, ViewChild, Inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import BookService from 'src/app/services/books.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface Book {
  _id: number;
  title: string;
  description: string;
  price: number;
}
export interface DialogData {
  title: string;
  description: string;
  price: number;
}

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, DoCheck {

  displayedColumns: string[] = ['select', 'ID', 'Title', 'Description', 'Price', 'Edit'];
  displayedColumnsUsers: string[] = ['ID', 'E-mail', 'Users name', 'Age', 'Permissions'];

  data: any;
  data1: any;

  dataSource: any;
  dataSource1: any;

  selection = new SelectionModel<Book>(true, []);
  toggleDeleteSelected: boolean = false;
  editing: number = null;
  currentlyEditing: boolean = false


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  DialogRef: MatDialogRef<Dialog>;

  constructor(
    private booksService: BookService,
    private usersService: UserService,
    public dialog: MatDialog
  ) { }

  EditForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl('')
  });

  startEditing(bookId: any) {
    let curBook = this.dataSource._data._value.find(
      (book: any) => book._id === bookId
    )
    this.EditForm.patchValue({
      title: curBook.title,
      description: curBook.description,
      price: curBook.price
    })
    this.editing = bookId;
    this.currentlyEditing = true
  }

  stopEditing(bookId: any) {
    this.booksService.updateBook(`books/${bookId}`, this.EditForm.value).subscribe(
     
    )
    this.data.forEach((book: any) => {
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
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.dataSource) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
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
      this.data = data;
      this.dataSource = new MatTableDataSource<Book>(data);
      this.dataSource.sort = this.sort;
    });
    this.usersService.get('users').subscribe((data: any) => {

      this.data1 = data.users;
      this.dataSource1 = new MatTableDataSource<any>(data.users);
      this.dataSource1.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  deleteSelected() {
    let delArr = [];
    this.selection.selected.forEach(element => {
      delArr.push(element._id)
    });
    const check = confirm('Delete Selected Books?')
    if (check) {
      delArr.forEach(element => {
        this.data = this.data.filter((book: any) => book._id !== element)

        this.booksService.deleteBook(`${element}`).subscribe(

        )
      });
      this.dataSource = new MatTableDataSource<Book>(this.data);
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
        this.data = data;
        this.dataSource = new MatTableDataSource<Book>(data);
        this.dataSource.sort = this.sort;
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
