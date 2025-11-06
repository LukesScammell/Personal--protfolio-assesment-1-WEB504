// Comment system: real-time comments stored in Firestore.
import { db, auth } from './firebaseConfig.js';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

function renderCommentItem(parent, id, data, currentUser) {
  const { author, content, timestamp, uid } = data;
  const li = document.createElement('li');
  li.className = 'comment';
  const header = document.createElement('div');
  header.className = 'comment-header';
  const nameSpan = document.createElement('strong');
  nameSpan.textContent = author || 'Anonymous';
  const timeSpan = document.createElement('span');
  timeSpan.className = 'timestamp';
  // Convert Firestore timestamp to readable date if available
  if (timestamp && typeof timestamp.toDate === 'function') {
    timeSpan.textContent = new Date(timestamp.toDate()).toLocaleString();
  }
  header.appendChild(nameSpan);
  header.appendChild(timeSpan);
  li.appendChild(header);

  const contentP = document.createElement('p');
  contentP.textContent = content;
  li.appendChild(contentP);

  // If this user authored the comment, allow editing
  if (currentUser && currentUser.uid === uid) {
    const actions = document.createElement('div');
    actions.className = 'comment-actions';
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);

    // Edit comment
    editBtn.addEventListener('click', () => {
      const newContent = prompt('Edit your comment:', content);
      if (newContent !== null && newContent.trim() !== '') {
        const commentRef = doc(db, 'comments', id);
        updateDoc(commentRef, { content: newContent });
      }
    });
    // Delete comment
    deleteBtn.addEventListener('click', () => {
      if (confirm('Delete this comment?')) {
        const commentRef = doc(db, 'comments', id);
        deleteDoc(commentRef);
      }
    });
  }

  parent.appendChild(li);
}

export function initComments() {
  const commentForm = document.querySelector('#comment-form');
  const commentList = document.querySelector('#comment-list');
  const commentSection = document.querySelector('#comment-section');

  if (!commentSection) {
    return;
  }

  // Handle new comment submissions
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = commentForm.querySelector('textarea[name="content"]').value;
      if (!auth.currentUser) {
        alert('You must be logged in to post comments.');
        return;
      }
      if (content.trim() === '') return;
      try {
        await addDoc(collection(db, 'comments'), {
          uid: auth.currentUser.uid,
          author: auth.currentUser.email,
          content,
          timestamp: serverTimestamp(),
        });
        commentForm.reset();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Listen for auth changes to show or hide comment form
  document.addEventListener('authChanged', (e) => {
    const user = e.detail.user;
    if (commentForm) {
      commentForm.style.display = user ? '' : 'none';
    }
  });

  // Real-time updates for comments
  const q = query(collection(db, 'comments'), orderBy('timestamp', 'asc'));
  onSnapshot(q, (snapshot) => {
    // Clear existing
    if (commentList) {
      commentList.innerHTML = '';
    }
    const currentUser = auth.currentUser;
    snapshot.forEach((docSnap) => {
      renderCommentItem(commentList, docSnap.id, docSnap.data(), currentUser);
    });
  });
}

// Automatically initialise when module is loaded
initComments();