import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import colorIcon from './assets/color-icon.png';
import pinIcon from './assets/push-pin.png';
import uploadIcon from './assets/upload.png';
import deleteIcon from './assets/delete.png';
import { connect } from 'react-redux';
import { addNote, updateNote, deleteNote, pinNote } from './redux/actions';

const App = ({ notes, addNote, updateNote, deleteNote, pinNote }) => {
    const [note, setNote] = useState({
        title: '',
        textDescription: '',
        backgroundColor: '#ffffff',
        image: ''
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showColorPickerIndex, setShowColorPickerIndex] = useState(null);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => {
        const textarea = textareaRef.current;
        if (textarea) {
            setNote({ ...note, textDescription: e.target.value });
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    const handleTitleChange = (e) => {
        setNote({ ...note, title: e.target.value });
    };

    const handleColorChange = (e) => {
        setNote({ ...note, backgroundColor: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setNote({ ...note, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        const newNote = {
            ...note,
            id: Date.now(),
            createdDate: new Date().toISOString(), 
            updatedDate: new Date().toISOString(), 
            pinned: false
        };
        addNote(newNote);
        setNote({
            title: '',
            textDescription: '',
            backgroundColor: '#ffffff',
            image: ''
        });
    };

    const handleDeleteNote = (id) => {
        deleteNote(id);
    };

    const handlePinNote = (id) => {
        pinNote(id);
    };

    const handleDeleteImage = () => {
        setNote({ ...note, image: '' });
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    useEffect(() => {
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    }, [note.textDescription]);

    const sortedNotes = [...notes].sort((a, b) => a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1);

    return (
        <div>
            <div className="main-note-container" style={{ backgroundColor: note.backgroundColor }}>
                <input
                    type="text"
                    className="note-title"
                    placeholder="Title"
                    value={note.title}
                    onChange={handleTitleChange}
                    style={{ backgroundColor: note.backgroundColor }}
                />
                <textarea
                    ref={textareaRef}
                    className="note-text"
                    placeholder="Take a note..."
                    value={note.textDescription}
                    onChange={handleInputChange}
                    style={{ backgroundColor: note.backgroundColor, overflowY: 'hidden' }}
                />
                {note.image && (
                    <div className="image-container">
                        <img src={note.image} alt="Note" className="note-image" />
                        <button className="delete-image-button" onClick={handleDeleteImage}>Delete Image</button>
                    </div>
                )}
                <div className="note-footer">
                    <div className="note-icons">
                        <button className="icon-button" onClick={() => setShowColorPicker(!showColorPicker)}>
                            <img src={colorIcon} alt="Color" style={{ width: 20, height: 20 }} />
                        </button>
                        {showColorPicker && (
                            <input
                                type="color"
                                className="color-picker"
                                value={note.backgroundColor}
                                onChange={handleColorChange}
                                onBlur={() => setShowColorPicker(false)}
                            />
                        )}
                        <input
                            type="file"
                            className="image-input"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageInput"
                        />
                        <label htmlFor="imageInput" className="icon-button">
                            <img src={uploadIcon} alt="Upload" style={{ width: 20, height: 20 }} />
                        </label>
                    </div>
                    <button className="close-button" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>

            <div className="notes-list">
                {sortedNotes.map((note) => (
                    <div
                        key={note.id}
                        className={`note-item ${note.pinned ? 'pinned' : ''}`}
                        style={{ backgroundColor: note.backgroundColor, width: '80%' }}
                    >
                        {note.pinned && <img src={pinIcon} alt="Pinned" className="pinned-icon" />}
                        <input
                            type="text"
                            className="note-title"
                            placeholder="Title"
                            value={note.title}
                            onChange={(e) => updateNote(note.id, { ...note, title: e.target.value, updatedDate: new Date().toISOString() })}
                            style={{ backgroundColor: note.backgroundColor }}
                        />
                        <textarea
                            ref={el => {
                                if (el) {
                                    adjustTextareaHeight(el);
                                }
                            }}
                            className="note-text"
                            placeholder="Take a note..."
                            value={note.textDescription}
                            onChange={(e) => updateNote(note.id, { ...note, textDescription: e.target.value, updatedDate: new Date().toISOString() })}
                            style={{ backgroundColor: note.backgroundColor, overflowY: 'hidden' }}
                        />
                        {note.image && (
                            <div className="image-container">
                                <img src={note.image} alt="Note" className="note-image" />
                            </div>
                        )}
                        <div className="note-footer">
                            <div className="note-icons">
                                <button className="icon-button" onClick={(e) => { e.stopPropagation(); setShowColorPickerIndex(note.id); }}>
                                    <img src={colorIcon} alt="Color" style={{ width: 20, height: 20 }} />
                                </button>
                                {showColorPickerIndex === note.id && (
                                    <input
                                        type="color"
                                        className="color-picker"
                                        value={note.backgroundColor}
                                        onChange={(e) => updateNote(note.id, { ...note, backgroundColor: e.target.value, updatedDate: new Date().toISOString() })}
                                        onBlur={() => setShowColorPickerIndex(null)}
                                    />
                                )}
                                <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                                    <img src={deleteIcon} alt="Delete" style={{ width: 20, height: 20 }} />
                                </button>
                                <button className="icon-button" onClick={(e) => { e.stopPropagation(); handlePinNote(note.id); }}>
                                    <img src={pinIcon} alt="Pin" style={{ width: 20, height: 20 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    notes: state.notes,
});

const mapDispatchToProps = {
    addNote,
    updateNote,
    deleteNote,
    pinNote
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
