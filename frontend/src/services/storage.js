const STORAGE_KEY = 'testers_notes_data';

export const storageService = {
  // Get all notes
  getNotes: () => {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  },

  // Get single note by ID
  getNoteById: (id) => {
    const notes = storageService.getNotes();
    return notes.find(note => note._id === id);
  },

  // Create new note
  createNote: (noteData) => {
    const notes = storageService.getNotes();
    const newNote = {
      ...noteData,
      _id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.unshift(newNote); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return newNote;
  },

  // Update existing note
  updateNote: (id, updateData) => {
    const notes = storageService.getNotes();
    const index = notes.findIndex(note => note._id === id);
    
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return notes[index];
    }
    return null;
  },

  // Delete note
  deleteNote: (id) => {
    const notes = storageService.getNotes();
    const filteredNotes = notes.filter(note => note._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    return true;
  }
};
