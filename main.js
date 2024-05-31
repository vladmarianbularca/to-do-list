import {
    saveToStorage,
    deleteFromStorage,
    updateToStorage,
    getNotesFromStorage,
  } from './storage-functions.js';
  
  document.addEventListener("DOMContentLoaded", () => {
      const noteContainer = document.getElementById("note-container");
      const noteTemplate = document.getElementById("note-template");
      const addNoteButton = document.getElementById("add-note");
      const themeToggleButton = document.getElementById("theme-toggle");
  
      let notes = [];
      let isDarkMode = JSON.parse(localStorage.getItem("dark-mode")) || false;
      if (isDarkMode) {
          document.body.classList.add("dark-mode");
      }
  
      function fetchNotes() {
          return getNotesFromStorage().then(data => {
              notes = data;
              renderNotes();
          }).catch(error => console.error('Error fetching notes:', error));
      }
  
      function addNote() {
          const newNote = {
              id: `note_${Math.floor(Math.random() * 100000)}`,
              title: "",
              description: "",
              color: getRandomColor()
          };
  
          return saveToStorage(newNote).then(savedNote => {
              notes.unshift(savedNote);
              renderNotes();
          }).catch(error => console.error('Error adding note:', error));
      }
  
      function getRandomColor() {
          const colors = ["green", "blue", "yellow", "purple"];
          return colors[Math.floor(Math.random() * colors.length)];
      }
  
      function updateNoteProperty(noteId, key, value) {
          const note = notes.find(note => note.id === noteId);
          if (note) {
              note[key] = value;
              return updateToStorage(note).catch(error => console.error('Error updating note:', error));
          }
          return Promise.reject('Note not found');
      }
  
      function deleteNoteById(noteId) {
          notes = notes.filter(note => note.id !== noteId);
          return deleteFromStorage(noteId).then(() => {
              renderNotes();
          }).catch(error => console.error('Error deleting note:', error));
      }
  
      function renderNotes() {
          noteContainer.innerHTML = "";
          notes.forEach(note => {
              const noteElement = noteTemplate.content.cloneNode(true);
              const noteDiv = noteElement.querySelector(".note");
  
              const colorPicker = noteElement.querySelector(".color-picker");
              const colorPickerBtn = noteElement.querySelector(".color-picker-btn");
              const deleteButton = noteElement.querySelector(".delete-btn");
              const noteTitle = noteElement.querySelector(".note-title");
              const noteContent = noteElement.querySelector(".note-content");
  
              noteDiv.style.backgroundColor = note.color;
              noteTitle.textContent = note.title;
              noteContent.textContent = note.description;
  
              noteTitle.addEventListener("input", () => {
                  noteTitle.contentEditable = true;
              });
  
              noteContent.addEventListener("input", () => {
                  noteContent.contentEditable = true;
              });
  
              noteTitle.addEventListener("blur", () => {
                  updateNoteProperty(note.id, "title", noteTitle.textContent);
              });
  
              noteContent.addEventListener("blur", () => {
                  updateNoteProperty(note.id, "description", noteContent.textContent);
              });
  
              colorPickerBtn.addEventListener("click", () => {
                  colorPicker.click();
              });
  
              colorPicker.addEventListener("input", () => {
                  updateNoteProperty(note.id, "color", colorPicker.value).then(() => {
                      noteDiv.style.backgroundColor = colorPicker.value;
                  });
              });
  
              deleteButton.addEventListener("click", () => {
                  deleteNoteById(note.id);
              });
  
              if (isDarkMode) {
                  noteDiv.classList.add("dark-mode");
              }
  
              noteContainer.appendChild(noteElement);
          });
      }
  
      addNoteButton.addEventListener("click", addNote);
  
      themeToggleButton.addEventListener("click", () => {
          document.body.classList.toggle("dark-mode");
          isDarkMode = !isDarkMode;
          localStorage.setItem("dark-mode", JSON.stringify(isDarkMode));
          renderNotes();
      });
  
      fetchNotes();
  });
  