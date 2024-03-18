const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("incompleteBookshelfList");
  const finishedBook = document.getElementById("completeBookshelfList");

  unfinishedBook.innerHTML = "";
  finishedBook.innerHTML = "";

  books.forEach(bookItem => {
    const bookElement = makeBookElement(bookItem);
    if (bookItem.isComplete) {
      finishedBook.appendChild(bookElement);
    } else {
      unfinishedBook.appendChild(bookElement);
    }
  });
});

document.addEventListener(SAVED_EVENT, showAlert("Berhasil Disimpan!"));
document.addEventListener(MOVED_EVENT, showAlert("Berhasil Dipindahkan!"));
document.addEventListener(DELETED_EVENT, showAlert("Berhasil Dihapus!"));

function showAlert(message) {
  return function() {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = message;

    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
  };
}

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  data.forEach(item => {
    books.push(item);
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = saveData;
const deleteData = saveData;

const addBook = () => {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const newBook = {
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: parseInt(bookYear),
    isComplete: bookIsComplete
  };

  console.log(newBook); // Menampilkan newBook ke konsol

  books.push(newBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Buku berhasil ditambahkan!");
};

const deleteBook = (bookId) => {
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmDelete) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      deleteData();
      document.dispatchEvent(new Event(RENDER_EVENT));
      alert("Buku berhasil dihapus!");
    }
  } else {
    alert("Penghapusan buku dibatalkan.");
  }
};

const makeBookElement = (bookObject) => {
  const container = document.createElement("div");
  container.classList.add("book-item");
  container.dataset.id = bookObject.id;

  const titleElement = document.createElement("h3");
  titleElement.textContent = bookObject.title;

  const authorElement = document.createElement("p");
  authorElement.textContent = `Penulis: ${bookObject.author}`;

  const yearElement = document.createElement("p");
  yearElement.textContent = `Tahun: ${bookObject.year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action-buttons");

  const moveButton = document.createElement("button");
  moveButton.innerHTML = "<i class='bx bx-transfer-alt'></i>";
  moveButton.title = "Pindahkan";
  moveButton.classList.add("move-button");
  moveButton.addEventListener("click", () => moveBook(bookObject.id));

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='bx bx-trash'></i>";
  deleteButton.title = "Hapus";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => deleteBook(bookObject.id));

  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='bx bx-edit'></i>";
  editButton.title = "Edit";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    const newTitle = prompt("Masukkan judul baru:", bookObject.title);
    const newAuthor = prompt("Masukkan penulis baru:", bookObject.author);
    const newYear = prompt("Masukkan tahun baru:", bookObject.year);
    editBook(bookObject.id, newTitle, newAuthor, newYear);
  });

  actionContainer.append(moveButton, deleteButton, editButton);

  container.append(titleElement, authorElement, yearElement, actionContainer);

  return container;
};

const moveBook = (bookId) => {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    moveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

const editBook = (bookId, newTitle, newAuthor, newYear) => {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].title = newTitle;
    books[bookIndex].author = newAuthor;
    books[bookIndex].year = parseInt(newYear);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert("Buku berhasil diedit!");
  }
};

document.getElementById("bookSubmit").addEventListener("click", (event) => {
  event.preventDefault();
  addBook();
});

document.getElementById("searchSubmit").addEventListener("click", (event) => {
  event.preventDefault();
  searchBook();
});

const searchBook = () => {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookItems = document.querySelectorAll(".book-item");

  let found = false;
  bookItems.forEach(bookItem => {
    const title = bookItem.querySelector("h3").textContent.toLowerCase();
    if (title.includes(searchInput)) {
      bookItem.style.display = "block";
      found = true;
    } else {
      bookItem.style.display = "none";
    }
  });

  if (!found) {
    alert("Buku tidak ditemukan.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
