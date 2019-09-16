export class BooksModel {
    title: string;
    description: string;
    price: number;
}

export interface Book {
    _id : number;
    title: string;
    description: string;
    price: number;
    quantity: number;

}