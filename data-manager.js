// ========================================
// CENTRALIZED DATA MANAGEMENT SYSTEM
// ========================================

class DataManager {
  constructor() {
    this.initializeData();
  }

  // Initialize all data structures
  initializeData() {
    this.initializeUserStats();
    this.initializeInventory();
    this.initializeJobApplications();
  }

  // User Stats Management
  initializeUserStats() {
    if (!localStorage.getItem('userStats')) {
      const defaultStats = {
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        username: 'Steve Jobs'
      };
      localStorage.setItem('userStats', JSON.stringify(defaultStats));
    }
  }

  getUserStats() {
    const stats = JSON.parse(localStorage.getItem('userStats')) || {};
    // Add stars from unified star system
    stats.stars = getStars();
    return stats;
  }

  updateUserStats(updates) {
    const stats = this.getUserStats();
    const newStats = { ...stats, ...updates };
    
    localStorage.setItem('userStats', JSON.stringify(newStats));
    this.updateStatsUI();
    return this.getUserStats();
  }

  addXP(amount) {
    const stats = this.getUserStats();
    const newXP = stats.xp + amount;
    let newLevel = stats.level;
    let nextLevelXp = stats.nextLevelXp;

    // Check for level up
    if (newXP >= stats.nextLevelXp) {
      newLevel++;
      nextLevelXp = newLevel * 100; // Each level requires 100 more XP
      this.showLevelUpNotification(newLevel);
    }

    this.updateUserStats({
      xp: newXP,
      level: newLevel,
      nextLevelXp: nextLevelXp
    });
  }

  addStars(amount) {
    addStars(amount);
    this.updateStatsUI();
  }

  spendStars(amount) {
    return spendStars(amount);
  }

  updateStatsUI() {
    const stats = this.getUserStats();
    
    // Update all stat displays across pages
    const levelElements = document.querySelectorAll('#level, #currentLevel');
    const xpElements = document.querySelectorAll('#xp, #currentXp, #nextLevelXp');
    const usernameElements = document.querySelectorAll('#username');

    // Stars are handled by star-system.js
    syncStars();
    
    levelElements.forEach(el => el.textContent = stats.level);
    xpElements.forEach(el => {
      if (el.id === 'nextLevelXp') {
        el.textContent = stats.nextLevelXp;
      } else {
        el.textContent = stats.xp;
      }
    });
    usernameElements.forEach(el => el.textContent = stats.username);
  }

  showLevelUpNotification(level) {
    showNotification(`Level Up! You're now level ${level}!`, 'success');
  }

  // Inventory Management
  initializeInventory() {
    if (!localStorage.getItem('inventory')) {
      localStorage.setItem('inventory', JSON.stringify({}));
    }
  }

  getInventory() {
    return JSON.parse(localStorage.getItem('inventory')) || {};
  }

  addToInventory(itemName, quantity = 1) {
    const inventory = this.getInventory();
    inventory[itemName] = (inventory[itemName] || 0) + quantity;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    this.updateInventoryUI();
  }

  removeFromInventory(itemName, quantity = 1) {
    const inventory = this.getInventory();
    if (inventory[itemName] && inventory[itemName] >= quantity) {
      inventory[itemName] -= quantity;
      if (inventory[itemName] <= 0) {
        delete inventory[itemName];
      }
      localStorage.setItem('inventory', JSON.stringify(inventory));
      this.updateInventoryUI();
      return true;
    }
    return false;
  }

  getItemQuantity(itemName) {
    const inventory = this.getInventory();
    return inventory[itemName] || 0;
  }

  updateInventoryUI() {
    // This will be called by the inventory system
    if (typeof updateInventoryDisplay === 'function') {
      updateInventoryDisplay();
    }
  }

  // Job Applications Management
  initializeJobApplications() {
    if (!localStorage.getItem('jobApplications')) {
      localStorage.setItem('jobApplications', JSON.stringify([]));
    }
  }

  getJobApplications() {
    return JSON.parse(localStorage.getItem('jobApplications')) || [];
  }

  saveJobApplication(jobData) {
    const applications = this.getJobApplications();
    const existingIndex = applications.findIndex(job => job.id === jobData.id);
    
    if (existingIndex >= 0) {
      applications[existingIndex] = { ...applications[existingIndex], ...jobData };
    } else {
      applications.push(jobData);
    }
    
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    this.syncJobData();
    return jobData;
  }

  deleteJobApplication(jobId) {
    const applications = this.getJobApplications();
    const filtered = applications.filter(job => job.id !== jobId);
    localStorage.setItem('jobApplications', JSON.stringify(filtered));
    this.syncJobData();
  }

  syncJobData() {
    // Sync with spreadsheet
    if (typeof updateSpreadsheetFromJobs === 'function') {
      updateSpreadsheetFromJobs();
    }
    
    // Sync with egg page circles
    if (typeof updateCircleDisplay === 'function') {
      const applications = this.getJobApplications();
      applications.forEach(job => {
        updateCircleDisplay(job.id, job);
      });
    }
  }

  // Enhanced Job Application with new fields
  createJobApplication(data) {
    const jobId = data.id || `job-${Date.now()}`;
    const jobData = {
      id: jobId,
      company: data.company || '',
      position: data.position || '',
      salary: data.salary || '',
      status: data.status || 'Applied',
      jobDescription: data.jobDescription || '',
      coverLetter: data.coverLetter || '',
      notes: data.notes || '',
      resumeFile: data.resumeFile || null,
      returnOffer: data.returnOffer || false,
      location: data.location || '',
      connections: data.connections || '',
      dateApplied: data.dateApplied || new Date().toISOString().split('T')[0],
      emailsContacts: data.emailsContacts || '',
      lastUpdated: new Date().toISOString()
    };
    
    return this.saveJobApplication(jobData);
  }
}

// Global data manager instance
window.dataManager = new DataManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  dataManager.updateStatsUI();
});
