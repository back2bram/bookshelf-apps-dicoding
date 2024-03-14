document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const inputBookTitle = document.getElementById("inputBookTitle");
  const inputBookAuthor = document.getElementById("inputBookAuthor");
  const inputBookYear = document.getElementById("inputBookYear");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  const STORAGE_KEY = "BOOKSHELF_APPS";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      renderBookshelf();
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      books = data;
    }

    renderBookshelf();
  }

  let books = [];

  function createBook(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function addBookToShelf(title, author, year, isComplete) {
    const book = createBook(+new Date(), title, author, year, isComplete);
    books.push(book);
    saveData();
  }

  function renderBook(book) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${book.year}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const moveButton = document.createElement("button");
    moveButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    moveButton.addEventListener("click", function () {
      moveBook(book);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus";
    deleteButton.addEventListener("click", function () {
      deleteBook(book);
    });

    actionContainer.appendChild(moveButton);
    actionContainer.appendChild(deleteButton);

    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookAuthor);
    bookElement.appendChild(bookYear);
    bookElement.appendChild(actionContainer);

    return bookElement;
  }

  function renderBookshelf() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of books) {
      const bookElement = renderBook(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
      } else {
        incompleteBookshelfList.appendChild(bookElement);
      }
    }
  }

  function moveBook(book) {
    const index = books.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveData();
    }
  }

  function deleteBook(book) {
    const index = books.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      books.splice(index, 1);
      saveData();
    }
  }

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = inputBookYear.value;
    const isComplete = inputBookIsComplete.checked;

    addBookToShelf(title, author, year, isComplete);

    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookYear.value = "";
    inputBookIsComplete.checked = false;
  });

  loadDataFromStorage();
});
