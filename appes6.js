class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

class UI{
    addBookToList(book){
        const list=document.querySelector('#book-list');

    // create tr element
    const row=document.createElement('tr');

    // Insert columns

    row.innerHTML =`
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `

    list.appendChild(row);
    }

    showAlert(message,className){
        const div=document.createElement('div');

    div.className=`alert ${className}`;

    div.appendChild(document.createTextNode(message));

    // Get parent
    const container=document.querySelector('.container');

    const form=document.querySelector('#book-form');

    container.insertBefore(div,form);


    // Timeout after 3 sec

    setTimeout(function(){
        document.querySelector('.alert').remove();},3000
    );
    }

    deleteBook(target){
        if(target.className==='delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    
    }
}
// Local Storage

class Store{

    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
     
    static displayBooks(){
        const books=Store.getBooks();

        books.forEach(function(book){
            const ui=new UI();


            ui.addBookToList(book);
        })

    }

    static addBook(book){
        const books=Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books=Store.getBooks();

        books.forEach(function(book,index){
            if(book.isbn===isbn)
            books.splice(index,1);
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

document.querySelector('#book-form').addEventListener('submit',function(e){

    // Get form values
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    // Instantiate Book 
    const book=new Book(title,author,isbn);

    // Instantiate UI
    const ui=new UI();

    // Validate
    if(title===''||author===''||isbn=='')
    {
        // Error Alert
        ui.showAlert('Please Fill in all fields','error');
    }
    else{
         // Add book to list
        ui.addBookToList(book);

        // add to loval storage

        Store.addBook(book);

        // Show success
        ui.showAlert('Book Added','success');


        // Clear fields
        ui.clearFields();
    }

   

    e.preventDefault();
});



// Event Listener delete

document.querySelector('#book-list').addEventListener('click',function(e){

    const ui=new UI();

    ui.deleteBook(e.target);

    // Remove from Local Storage

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    ui.showAlert('Book Removed','success');

    e.preventDefault();
});