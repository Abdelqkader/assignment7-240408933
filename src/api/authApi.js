// Fake login: there is no real server yet, so the "request" is a timer.
const DEMO_USERNAME = '240408933@st.biruni.edu.tr';
const DEMO_PASSWORD = 'demo123456';

export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD) {
        resolve({ username: DEMO_USERNAME });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}
