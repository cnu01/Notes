import { ADD_NOTE, UPDATE_NOTE, DELETE_NOTE, PIN_NOTE } from './actionTypes';

export const addNote = (note) => ({
    type: ADD_NOTE,
    payload: note
});

export const updateNote = (id, note) => ({
    type: UPDATE_NOTE,
    payload: { id, note }
});

export const deleteNote = (id) => ({
    type: DELETE_NOTE,
    payload: id
});

export const pinNote = (id) => ({
    type: PIN_NOTE,
    payload: id
});
