import { writable } from 'svelte/store';

// Get the user data from local storage
const storedData = localStorage.getItem('user');

// Initialize the user store with the stored data or null
export const user = writable(storedData !== undefined ? JSON.parse(storedData) : null);

// Subscribe to the changes in the user store
user.subscribe(value => {
  // Update the local storage with the new value of the user store
  localStorage.setItem('user', JSON.stringify(value));
});

