// ========================================
// JOB APPLICATION MANAGER
// ========================================

// Job Application Data Structure
let currentJobId = null;
let isEditMode = false;

// Initialize job applications on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeJobCircles();
  loadJobApplications();
});

// Handle clicks on empty space in egg container
function handleEggClick(event) {
  // Only handle clicks on the container itself, not on circles
  if (event.target.classList.contains('job-circles-container')) {
    // Create a new job ID
    const jobList = JSON.parse(localStorage.getItem('jobList')) || { role: [], company: [], status: [], salary: [], location: [], dateApplied: [], returnOffer: [], connections: [], emailsContacts: [], priority: [], resume: [], hide: [] };
    const newJobId = `job-${jobList.role.length}`;
    
    // Add empty entry to jobList
    jobList.role.push('');
    jobList.company.push('');
    jobList.status.push('Applied');
    jobList.salary.push('');
    jobList.location.push('');
    jobList.dateApplied.push('');
    jobList.returnOffer.push(false);
    jobList.connections.push('');
    jobList.emailsContacts.push('');
    jobList.priority.push('Medium');
    jobList.resume.push('');
    jobList.hide.push('false');
    
    localStorage.setItem('jobList', JSON.stringify(jobList));
    
    // Create new circle
    createNewCircle(newJobId);
    
    // Open modal for new job
    openJobModal(newJobId);
  }
}

// Create a new circle dynamically
function createNewCircle(jobId) {
  const container = document.querySelector('.job-circles-container');
  const circle = document.createElement('div');
  circle.className = 'circle';
  circle.dataset.jobId = jobId;
  circle.dataset.info = 'Click to add a new job application';
  circle.textContent = '+';
  
  // Add click handler
  circle.addEventListener('click', function(e) {
    e.stopPropagation();
    openJobModal(jobId);
  });
  
  container.appendChild(circle);
}

// Initialize job circles with click handlers
function initializeJobCircles() {
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle, index) => {
    const jobId = circle.dataset.jobId || `job-${index + 1}`;
    circle.dataset.jobId = jobId;
    
    circle.addEventListener('click', function() {
      openJobModal(jobId);
    });
  });
}

// Open job application modal
function openJobModal(jobId) {
  currentJobId = jobId;
  const modal = document.getElementById('jobModal');
  const jobApplications = dataManager.getJobApplications();
  const jobData = jobApplications.find(job => job.id === jobId);
  
  if (jobData) {
    // Load existing job data
    loadJobData(jobData);
    document.getElementById('modalJobTitle').textContent = `${jobData.company} - ${jobData.position}`;
  } else {
    // Create new job application
    clearJobForm();
    document.getElementById('modalJobTitle').textContent = 'New Job Application';
    // Enable edit mode for new applications
    toggleEditMode();
  }
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Close job application modal
function closeJobModal() {
  const modal = document.getElementById('jobModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  isEditMode = false;
  updateEditModeUI();
}

// Load job data into form
function loadJobData(jobData) {
  document.getElementById('companyName').value = jobData.company || '';
  document.getElementById('jobPosition').value = jobData.position || '';
  document.getElementById('salary').value = jobData.salary || '';
  document.getElementById('jobStatus').value = jobData.status || 'Applied';
  document.getElementById('jobDescription').value = jobData.jobDescription || '';
  document.getElementById('coverLetter').value = jobData.coverLetter || '';
  document.getElementById('location').value = jobData.location || '';
  document.getElementById('connections').value = jobData.connections || '';
  document.getElementById('dateApplied').value = jobData.dateApplied || '';
  document.getElementById('emailsContacts').value = jobData.emailsContacts || '';
  document.getElementById('returnOffer').checked = jobData.returnOffer || false;
  document.getElementById('notes').value = jobData.notes || '';
  
  // Handle resume file
  if (jobData.resumeFile) {
    document.getElementById('resumeStatus').textContent = `Resume: ${jobData.resumeFile}`;
  }
}

// Clear job form
function clearJobForm() {
  document.getElementById('companyName').value = '';
  document.getElementById('jobPosition').value = '';
  document.getElementById('salary').value = '';
  document.getElementById('jobStatus').value = 'Applied';
  document.getElementById('jobDescription').value = '';
  document.getElementById('coverLetter').value = '';
  document.getElementById('location').value = '';
  document.getElementById('connections').value = '';
  document.getElementById('dateApplied').value = '';
  document.getElementById('emailsContacts').value = '';
  document.getElementById('returnOffer').checked = false;
  document.getElementById('notes').value = '';
  document.getElementById('resumeStatus').textContent = '';
}

// Toggle edit mode
function toggleEditMode() {
  isEditMode = !isEditMode;
  updateEditModeUI();
}

// Update edit mode UI
function updateEditModeUI() {
  const inputs = document.querySelectorAll('#jobModal input, #jobModal select, #jobModal textarea');
  const buttons = document.querySelectorAll('#saveBtn, #applyBtn, #deleteBtn');
  
  inputs.forEach(input => {
    if (isEditMode) {
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
    } else {
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('disabled', 'disabled');
    }
  });
  
  buttons.forEach(button => {
    button.disabled = !isEditMode;
  });
  
  // Update edit button appearance
  const editBtn = document.getElementById('editBtn');
  if (isEditMode) {
    editBtn.textContent = '💾';
    editBtn.title = 'Save Changes';
  } else {
    editBtn.textContent = '✏️';
    editBtn.title = 'Edit Application';
  }
}

// Save job application
function saveJobApplication() {
  if (!isEditMode) return;
  
  const jobData = {
    id: currentJobId,
    company: document.getElementById('companyName').value,
    position: document.getElementById('jobPosition').value,
    salary: document.getElementById('salary').value,
    status: document.getElementById('jobStatus').value,
    jobDescription: document.getElementById('jobDescription').value,
    coverLetter: document.getElementById('coverLetter').value,
    location: document.getElementById('location').value,
    connections: document.getElementById('connections').value,
    dateApplied: document.getElementById('dateApplied').value,
    emailsContacts: document.getElementById('emailsContacts').value,
    returnOffer: document.getElementById('returnOffer').checked,
    notes: document.getElementById('notes').value,
    resumeFile: document.getElementById('resumeStatus').textContent.replace('Resume: ', '') || null,
    lastUpdated: new Date().toISOString()
  };
  
  // Validate required fields
  if (!jobData.company || !jobData.position) {
    showNotification('Please fill in at least Company Name and Job Position', 'error');
    return;
  }
  
  // Save using data manager
  dataManager.saveJobApplication(jobData);
  
  // Update circle display
  updateCircleDisplay(currentJobId, jobData);
  
  // Exit edit mode
  isEditMode = false;
  updateEditModeUI();
  
  // Show success message
  showNotification('Job saved successfully!', 'success');
}

// Apply to job
function applyToJob() {
  const jobApplications = dataManager.getJobApplications();
  const jobData = jobApplications.find(job => job.id === currentJobId);
  if (!jobData) return;
  
  // Update status to Applied
  jobData.status = 'Applied';
  jobData.lastUpdated = new Date().toISOString();
  
  // Save changes using data manager
  dataManager.saveJobApplication(jobData);
  
  // Update form
  document.getElementById('jobStatus').value = 'Applied';
  
  // Show success message
  showNotification(`Application submitted for ${jobData.position} at ${jobData.company}!`, 'success');
}

// Delete job application
function deleteJobApplication() {
  if (!confirm('Are you sure you want to delete this job application?')) return;
  
  // Delete using data manager
  dataManager.deleteJobApplication(currentJobId);
  
  // Update circle display
  updateCircleDisplay(currentJobId, null);
  
  // Close modal
  closeJobModal();
  
  // Show success message
  showNotification('Job application deleted successfully!', 'success');
}

// Update circle display based on job data
function updateCircleDisplay(jobId, jobData) {
  const circle = document.querySelector(`[data-job-id="${jobId}"]`);
  if (!circle) return;
  
  if (jobData) {
    // Show company name (truncated if too long)
    const companyName = jobData.company || '';
    const displayText = companyName.length > 8 ? companyName.substring(0, 8) + '...' : companyName;
    circle.textContent = displayText || '+';
    circle.dataset.info = `${jobData.company} - ${jobData.position}`;
    
    // Add status-based styling
    circle.classList.remove('status-applied', 'status-interview', 'status-rejected', 'status-accepted');
    circle.classList.add(`status-${jobData.status.toLowerCase()}`);
  } else {
    // Reset to default
    circle.textContent = '+';
    circle.dataset.info = 'Click to add a new job application';
    circle.classList.remove('status-applied', 'status-interview', 'status-rejected', 'status-accepted');
  }
}

// Load all job applications and update circles
function loadJobApplications() {
  // First try to load from jobList (spreadsheet data)
  const jobList = JSON.parse(localStorage.getItem('jobList'));
  if (jobList && jobList.role && jobList.role.length > 0) {
    // Convert jobList to job applications format
    for (let i = 0; i < jobList.role.length; i++) {
      if (jobList.hide[i] === 'true' || jobList.hide[i] === true) continue;
      
      const jobData = {
        id: `job-${i}`,
        company: jobList.company[i] || '',
        position: jobList.role[i] || '',
        salary: jobList.salary[i] || '',
        status: jobList.status[i] || 'Applied',
        location: jobList.location[i] || '',
        dateApplied: jobList.dateApplied[i] || '',
        returnOffer: jobList.returnOffer[i] || false,
        connections: jobList.connections[i] || '',
        emailsContacts: jobList.emailsContacts[i] || '',
        resumeFile: jobList.resume[i] || '',
        lastUpdated: new Date().toISOString()
      };
      
      updateCircleDisplay(jobData.id, jobData);
    }
  } else {
    // Fallback to data manager
    const jobApplications = dataManager.getJobApplications();
    jobApplications.forEach(job => {
      updateCircleDisplay(job.id, job);
    });
  }
}

// Handle resume file upload
document.addEventListener('change', function(e) {
  if (e.target.id === 'resumeUpload') {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('resumeStatus').textContent = `Resume: ${file.name}`;
    }
  }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('jobModal');
  if (e.target === modal) {
    closeJobModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeJobModal();
  }
});

// Export functions for spreadsheet sync
window.jobManager = {
  getJobApplications: () => jobApplications,
  updateJobApplication: (jobId, updates) => {
    const index = jobApplications.findIndex(job => job.id === jobId);
    if (index >= 0) {
      jobApplications[index] = { ...jobApplications[index], ...updates };
      localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
      updateCircleDisplay(jobId, jobApplications[index]);
    }
  },
  deleteJobApplication: (jobId) => {
    jobApplications = jobApplications.filter(job => job.id !== jobId);
    localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
    updateCircleDisplay(jobId, null);
  }
};
