// Firebase config (replace with your own project keys)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const pollSection = document.getElementById("pollSection");
const voteForm = document.getElementById("voteForm");
const voteList = document.getElementById("voteList");

let currentUser = null;

// Login
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

// Logout
logoutBtn.onclick = () => auth.signOut();

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    pollSection.style.display = "block";
    loadVotes();
  } else {
    currentUser = null;
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    pollSection.style.display = "none";
  }
});

// Submit vote
voteForm.onsubmit = async (e) => {
  e.preventDefault();
  const slot = document.getElementById("slot").value;
  const locality = document.getElementById("locality").value;
  const plusOne = parseInt(document.getElementById("plusOne").value);
  const cork = document.getElementById("cork").value;

  await db.collection("votes").doc(currentUser.uid).set({
    user: currentUser.email,
    slot,
    locality,
    plusOne,
    cork,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  loadVotes();
};

// Load votes
async function loadVotes() {
  const snapshot = await db.collection("votes").get();
  voteList.innerHTML = "";
  snapshot.forEach(doc => {
    const v = doc.data();
    voteList.innerHTML += `<li>${v.user}: ${v.slot} @ ${v.locality}, +${v.plusOne}, Cork: ${v.cork}</li>`;
  });
}
