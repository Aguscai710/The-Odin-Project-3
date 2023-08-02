let library = [
	{
		title: "Game of Thrones",
		author: "George R. R. Martin",
		pages: 694,
		read: false,
	},
];

function Book(title, author, pages, red) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.red=red;
	
}


//DOM OBJECTS

const botonAdd = document.querySelector(".new");
const tabla = document.querySelector(".table");
const contenidoTabla = tabla.querySelector("tbody");

const formulario= document.querySelector(".form");
const tituloLibro = formulario.querySelector("#title");
const autorLibro = formulario.querySelector("#author");
const paginasLibro = formulario.querySelector("#pages");
const botonSubmit = formulario.querySelector("#submit");
const botonReturn = formulario.querySelector("#return");


function addBookToLibrary(){
        let title = tituloLibro.value;
		let author = autorLibro.value;
		let pages = paginasLibro.value;
		let read = getReadValue();
		let newBook = new Book(title, author, pages, read);
		library.push(newBook);
}

function getReadValue(){
    if(formulario.querySelector('input[name="read"]:checked').value == 'yes')return true;
    else return false;
}

function populateStorage(){
    localStorage.setItem('lib',JSON.stringify(library))
}

function getStorage(){
    library = JSON.parse(localStorage.getItem('lib'))
}

function toggleHiddenElements(){
    formulario.classList.toggle('hidden')
    tabla.classList.toggle("hidden");
    botonAdd.classList.toggle("hidden");
}

function addError(el) {
	let spanError = document.createElement("span");
	spanError.textContent = `Please enter a ${el.id}`;
	spanError.id = `${el.id}Error`;
	spanError.classList.add("errorText");
	formulario.insertBefore(spanError, el);

	el.classList.add("errorInput");

	el.addEventListener("input", removeError());
};

function removeError(el)  {
	if (el.target.value != "") {
		el.target.removeEventListener("input", removeError());
		el.target.classList.remove("errorInput");
		document.querySelector(`#${el.target.id}Error`).remove();
	}
};

function validateForm()  {
	if (tituloLibro.value == "" && document.querySelector("#titleError") == null)
		addError(tituloLibro);
	if (autorLibro.value == "" && document.querySelector("#authorError") == null)
		addError(autorLibro);
	if (paginasLibro.value == "" && document.querySelector("#pagesError") == null)
		addError(paginasLibro);

	if (tituloLibro.value == "" || paginasLibro.value == "" || autorLibro.value == "") 
    return false;
	else return true;
};

function clearForm(){
	tituloLibro.value = "";
	autorLibro.value = "";
	paginasLibro.value = "";
};

function createReadStatusTd(book){
	let readStatusTd = document.createElement("td");
	let readStatusButton = document.createElement("button");
	readStatusButton.textContent = "Change read status";
	readStatusButton.addEventListener("click", () => {
		book.read = !book.read;
		updateTable();
	});
	readStatusTd.appendChild(readStatusButton);
	return readStatusTd;
};

function removeFromLibrary(index){
	library.splice(index, 1);
	botonSubmit.removeEventListener("click", removeFromLibrary);
	updateTable();
};

function createEditTd(book, index){
	let editTd = document.createElement("td");
	let editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.addEventListener("click", () => {
		tituloLibro.value = book.title;
		autorLibro.value = book.author;
		paginasLibro.value = book.pages;
		book.read
			? (formulario.querySelector("#yes").checked = true)
			: (formulario.querySelector("#no").checked = true);
		toggleHiddenElements();
		botonSubmit.addEventListener("click", removeFromLibrary(index));
	});
	editTd.appendChild(editButton);
	return editTd;
};

function  createDeleteTd(index){
	let deleteTd = document.createElement("td");
	let deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.addEventListener("click", () => {
		library.splice(index, 1);
		updateTable();
	});
	deleteTd.appendChild(deleteButton);
	return deleteTd;
};

function updateTable(){
	contenidoTabla.textContent = "";

	library.forEach((book, index) => {
		let row = document.createElement("tr");
		Object.keys(book).forEach((prop) => {
			let newTd = document.createElement("td");
			newTd.textContent = book[prop];
			if (prop == "read") newTd.textContent = book[prop] ? "Read" : "Not read";
			row.appendChild(newTd);
		});

		row.appendChild(createReadStatusTd(book));
		row.appendChild(createEditTd(book, index));
		row.appendChild(createDeleteTd(index));
		contenidoTabla.appendChild(row);
	});

	populateStorage();
};

document.addEventListener("DOMContentLoaded", () => {
	paginasLibro.addEventListener("input", () => {
		if (!paginasLibro.validity.valid) paginasLibro.value = "";
	});

	botonAdd.addEventListener("click", toggleHiddenElements);

	botonSubmit.addEventListener("click", () => {
		if (validateForm() == false) return;
		addBookToLibrary();
		updateTable();
		toggleHiddenElements();
		clearForm();
	});

	botonReturn.addEventListener("click", () => {
		toggleHiddenElements();
		clearForm();
	});

	if (!localStorage.getItem("library")) {
		populateStorage();
	} else {
		getStorage();
	}

	updateTable();
});