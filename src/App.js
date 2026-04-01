import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const notesCollection = collection(db, "notes");

  // Get all notes
  const fetchNotes = async () => {
    setLoading(true);
    const data = await getDocs(notesCollection);
    setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  // Add new note
  const addNote = async () => {
    if (note.trim() === "") {
      alert("🌸 Please write something before saving!");
      return;
    }

    await addDoc(notesCollection, {
      text: note,
      createdAt: new Date().toISOString()
    });

    setNote("");
    fetchNotes();
  };

  // Delete note
  const deleteNote = async (id) => {
    if (window.confirm("💕 Are you sure you want to delete this note?")) {
      const noteDoc = doc(db, "notes", id);
      await deleteDoc(noteDoc);
      fetchNotes();
    }
  };

  // Load notes when page opens
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app">
      {/* Background decorative elements */}
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>
      
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-badge">✨ daily journal ✨</div>
          <h1>🌸 Notes</h1>
          <p>capture your thoughts, one note at a time</p>
        </div>

        {/* Add Note Section */}
        <div className="add-note-card">
          <div className="card-decoration">
            <span>✧</span> <span>✧</span> <span>✧</span>
          </div>
          <div className="card-header">
            <div className="header-emoji">✍️</div>
            <h3>create new note</h3>
          </div>
          <textarea
            className="note-input"
            placeholder="what's inspiring you today? 🌸"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
          />
          <button className="btn-add" onClick={addNote}>
            <span className="btn-sparkle">✨</span> save note <span className="btn-sparkle">✨</span>
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">📔</div>
            <div className="stat-number">{notes.length}</div>
            <div className="stat-label">total notes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💭</div>
            <div className="stat-number">{notes.filter(n => n.text.length > 0).length}</div>
            <div className="stat-label">memories</div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="notes-section">
          <div className="section-header">
            <div className="section-line"></div>
            <h2>your collection</h2>
            <div className="section-line"></div>
          </div>
          
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>loading your sweet notes...</p>
            </div>
          )}
          
          {!loading && notes.length === 0 && (
            <div className="empty-state">
              <div className="empty-illustration">
                <span className="empty-emoji">📔</span>
                <span className="empty-emoji">✨</span>
                <span className="empty-emoji">🌸</span>
              </div>
              <h3>your journal is waiting</h3>
              <p>write your first note above and start your journey 💕</p>
            </div>
          )}

          <div className="notes-grid">
            {notes.map((note, index) => (
              <div className="note-card" key={note.id}>
                <div className="note-card-bg"></div>
                <div className="note-card-content">
                  <div className="note-header">
                    <div className="note-avatar">
                      <span>🌸</span>
                    </div>
                    <button className="btn-delete" onClick={() => deleteNote(note.id)}>
                      ✕
                    </button>
                  </div>
                  <p className="note-text">{note.text}</p>
                  <div className="note-footer">
                    <span className="note-date">📅 {formatDate(note.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>made with <span className="heart">💕</span> • cherish every moment</p>
        </div>
      </footer>
    </div>
  );
}

export default App;