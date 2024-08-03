import { ADD_NOTE, UPDATE_NOTE, DELETE_NOTE, PIN_NOTE } from './actionTypes';

const initialState = {
    notes: []
};

const notesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NOTE:
            return { ...state, notes: [action.payload, ...state.notes] };
        case UPDATE_NOTE:
            const updatedNotes = state.notes.map((note) =>
                note.id === action.payload.id ? action.payload.note : note
            );
            return { ...state, notes: updatedNotes };
        case DELETE_NOTE:
            return { ...state, notes: state.notes.filter((note) => note.id !== action.payload) };
        case PIN_NOTE:
            const pinnedNotes = state.notes.map((note) =>
                note.id === action.payload ? { ...note, pinned: !note.pinned, updatedDate: new Date().toISOString() } : note
            );
            return { ...state, notes: pinnedNotes };
        default:
            return state;
    }
};

export default notesReducer;
