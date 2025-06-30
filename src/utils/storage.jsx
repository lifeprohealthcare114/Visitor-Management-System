// src/utils/storage.js
export function getVisitors() {
  try {
    const storedData = localStorage.getItem('visitorRegistrations');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error parsing visitor data:', error);
    localStorage.setItem('visitorRegistrations', JSON.stringify([]));
    return [];
  }
}

export function saveVisitors(visitors) {
  localStorage.setItem('visitorRegistrations', JSON.stringify(visitors));
}