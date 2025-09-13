// ========================================
// JOB APPLICATION MANAGER
// ========================================

// Job Application Data Structure
let jobApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
let currentJobId = null;
let isEditMode = false;

// Initialize job applications on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeJobCircles();
  loadJobApplications();
});

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
    notes: document.getElementById('notes').value,
    resumeFile: document.getElementById('resumeStatus').textContent.replace('Resume: ', '') || null,
    lastUpdated: new Date().toISOString()
  };
  
  // Validate required fields
  if (!jobData.company || !jobData.position) {
    alert('Please fill in at least Company Name and Job Position');
    return;
  }
  
  // Update or add job application
  const existingIndex = jobApplications.findIndex(job => job.id === currentJobId);
  if (existingIndex >= 0) {
    jobApplications[existingIndex] = jobData;
  } else {
    jobApplications.push(jobData);
  }
  
  // Save to localStorage
  localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  
  // Update circle display
  updateCircleDisplay(currentJobId, jobData);
  
  // Exit edit mode
  isEditMode = false;
  updateEditModeUI();
  
  // Show success message
  showNotification('Job application saved successfully!', 'success');
  
  // Sync with spreadsheet if on spreadsheet page
  if (typeof updateSpreadsheetFromJobs === 'function') {
    updateSpreadsheetFromJobs();
  }
}

// Apply to job
function applyToJob() {
  const jobData = jobApplications.find(job => job.id === currentJobId);
  if (!jobData) return;
  
  // Update status to Applied
  jobData.status = 'Applied';
  jobData.lastUpdated = new Date().toISOString();
  
  // Save changes
  localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  
  // Update form
  document.getElementById('jobStatus').value = 'Applied';
  
  // Show success message
  showNotification(`Application submitted for ${jobData.position} at ${jobData.company}!`, 'success');
  
  // Sync with spreadsheet
  if (typeof updateSpreadsheetFromJobs === 'function') {
    updateSpreadsheetFromJobs();
  }
}

// Delete job application
function deleteJobApplication() {
  if (!confirm('Are you sure you want to delete this job application?')) return;
  
  // Remove from array
  jobApplications = jobApplications.filter(job => job.id !== currentJobId);
  
  // Save to localStorage
  localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  
  // Update circle display
  updateCircleDisplay(currentJobId, null);
  
  // Close modal
  closeJobModal();
  
  // Show success message
  showNotification('Job application deleted successfully!', 'success');
  
  // Sync with spreadsheet
  if (typeof updateSpreadsheetFromJobs === 'function') {
    updateSpreadsheetFromJobs();
  }
}

// Update circle display based on job data
function updateCircleDisplay(jobId, jobData) {
  const circle = document.querySelector(`[data-job-id="${jobId}"]`);
  if (!circle) return;
  
  if (jobData) {
    // Show company initial or job status
    const displayText = jobData.company ? jobData.company.charAt(0).toUpperCase() : '+';
    circle.textContent = displayText;
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
  jobApplications.forEach(job => {
    updateCircleDisplay(job.id, job);
  });
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
