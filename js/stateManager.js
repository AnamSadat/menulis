// ===========================
// STATE MANAGER
// Manages application state
// ===========================

class StateManager {
  constructor() {
    this.state = {
      userName: "",
      currentActivity: null,
      soundEnabled: true,
      volume: 70,
      language: "id",
      currentMode: "",
      score: 0,
    };

    this.loadState();
  }

  // Get state value
  get(key) {
    return this.state[key];
  }

  // Set state value
  set(key, value) {
    this.state[key] = value;
    this.saveState();
    this.notifyListeners(key, value);
  }

  // Set multiple state values
  setMultiple(updates) {
    Object.keys(updates).forEach((key) => {
      this.state[key] = updates[key];
    });
    this.saveState();
  }

  // Get all state
  getAll() {
    return { ...this.state };
  }

  // Save state to localStorage
  saveState() {
    try {
      localStorage.setItem("menulisAppState", JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save state to localStorage:", e);
    }
  }

  // Load state from localStorage
  loadState() {
    try {
      const saved = localStorage.getItem("menulisAppState");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.warn("Could not load state from localStorage:", e);
    }
  }

  // Reset state
  reset() {
    this.state = {
      userName: "",
      currentActivity: null,
      soundEnabled: true,
      volume: 70,
      language: "id",
      currentMode: "",
      score: 0,
    };
    this.saveState();
  }

  // Listener system for state changes
  listeners = {};

  on(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  off(key, callback) {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter((cb) => cb !== callback);
    }
  }

  notifyListeners(key, value) {
    if (this.listeners[key]) {
      this.listeners[key].forEach((callback) => callback(value));
    }
  }
}

// Export singleton instance
export default new StateManager();
