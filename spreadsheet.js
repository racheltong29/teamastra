let xp = 0;

// Elements
const xpEl = document.getElementById("xp");
const tableBody = document.querySelector("#jobTable tbody");
const addRowBtn = document.getElementById("addRowBtn");

// Modal elements
const catModal = document.getElementById("catModal");
const closeCatModal = document.getElementById("closeCatModal");

// Job status options in order
const statusOptions = ["Applying", "Applied", "Interview", "Offer", "Accepted", "Rejected"];

//Object to store users job details
if (localStorage.getItem('jobList') === null) {
  // Item doesn't exist yet — set a default value
  let jobList = {
    role: [""],
    company: [""],
    status: [""],
    salary: [""],
    priority: [""],
    hide: [""]
  };
  localStorage.setItem('jobList', JSON.stringify(jobList));
}

// Stars are now handled by star-system.js



// Rewards for progressing
const rewards = {
  "Applied": { xp: 30, stars: 15 },
  "Interview": { xp: 50, stars: 25 },
  "Offer": { xp: 80, stars: 40 },
  "Accepted": { xp: 100, stars: 50 },
  "Rejected": { xp: 100, stars: 0 }
};

// Add row
addRowBtn.addEventListener("click", () => {
  let jobList = JSON.parse(localStorage.getItem('jobList'));
  const row = document.createElement("tr");
  row.id = 'jobRow' + jobList.role.length.toString();
  const jobNum = jobList.role.length;
  jobList.role.push('');
  jobList.company.push('');
  jobList.status.push('');
  jobList.salary.push('');
  jobList.priority.push('');
  jobList.hide.push(false);
  row.innerHTML = `
    <td><input type="text" id=${"role"+jobNum.toString()} placeholder="e.g. Software Engineer"></td>
    <td><input type="text" id=${"company"+jobNum.toString()} placeholder="Company"></td>
    <td>
      <select id=${"status"+jobNum.toString()}>
        ${statusOptions.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
    </td>
    <td><input type="number"id=${"salary"+jobNum.toString()} placeholder="Salary"></td>
    <td>
      <select id=${"priority"+jobNum.toString()}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </td>
    <td class="reward-cell">—</td>
    <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
  `;

  const roleElement = row.querySelector(`#role${jobNum}`);
    roleElement.addEventListener('input', () => {
    jobList.role[jobNum] = roleElement.value;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });
  const companyElement = row.querySelector(`#company${jobNum}`);
    companyElement.addEventListener('input', () => {
    jobList.company[jobNum] = companyElement.value;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });

  const statusElement = row.querySelector(`#status${jobNum}`);
    statusElement.addEventListener('change', () => {
    jobList.status[jobNum] = statusElement.value;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });

  const salaryElement = row.querySelector(`#salary${jobNum}`);
    salaryElement.addEventListener('input', () => {
    jobList.salary[jobNum] = salaryElement.value;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });

  const priorityElement = row.querySelector(`#priority${jobNum}`);
    priorityElement.addEventListener('change', () => {
    jobList.priority[jobNum] = priorityElement.value;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });


  // Delete button
  row.querySelector(".delete-btn").addEventListener("click", () => {
    row.remove();
    jobList.hide[jobNum] = true;
    localStorage.setItem('jobList', JSON.stringify(jobList));
  });

  // Track status progress
  const statusSelect = row.querySelector("select");
  let lastIndex = 0;

  statusSelect.addEventListener("change", (e) => {
    const newStatus = e.target.value;
    const newIndex = statusOptions.indexOf(newStatus);

    if (newStatus === "Rejected") {
      // Show cat modal
      catModal.classList.add("show");
    }
    if (newIndex > lastIndex && rewards[newStatus]) {
      // Only reward if moved forward
      const { xp: xpAmount, stars: starAmount } = rewards[newStatus];
      addRewards(xpAmount, starAmount);
      row.querySelector(".reward-cell").textContent = `+${starAmount}⭐ +${xpAmount}XP`;
    }

    lastIndex = newIndex;
  });

  tableBody.appendChild(row);
});

// Rewards
function addRewards(xpAmount, starAmount) {
  xp += xpAmount;
  addStars(starAmount); // Use unified star system

  xpEl.textContent = xp + " XP";
}

// Close modal
closeCatModal.addEventListener("click", () => {
  catModal.classList.remove("show");
});

// Comfort popup for rejected applications
function showComfortPopup() {
  const catImages = [
    'cats/cat1.png',
    'cats/cat2.png',
    'cats/cat3.png',
    'cats/cat4.png',
    'cats/cat5.png',
    'cats/cat6.png'
  ];
  
  const randomCat = catImages[Math.floor(Math.random() * catImages.length)];
  
  const comfortModal = document.createElement('div');
  comfortModal.className = 'modal show';
  comfortModal.id = 'comfortModal';
  comfortModal.innerHTML = `
    <div class="modal-content comfort-modal">
      <div class="comfort-content">
        <img src="${randomCat}" alt="Comfort Cat" class="comfort-cat">
        <h2>It's Okay! 💕</h2>
        <p>Rejection is just redirection. This cat believes in you!</p>
        <p>Keep applying - your perfect opportunity is coming! 🌟</p>
        <div class="rejection-rewards">
          <div class="reward-item">
            <i class="fas fa-fire"></i>
            <span>+15 XP for resilience!</span>
          </div>
          <div class="reward-item">
            <i class="fas fa-star"></i>
            <span>+3 Stars for learning!</span>
          </div>
        </div>
        <button class="btn comfort-btn" onclick="closeComfortModal()">Thanks, Cat! 🐱</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(comfortModal);
  
  // Auto close after 8 seconds
  setTimeout(() => {
    closeComfortModal();
  }, 8000);
}

function closeComfortModal() {
  const comfortModal = document.getElementById('comfortModal');
  if (comfortModal) {
    comfortModal.remove();
  }
}
catModal.addEventListener("click", (e) => {
  if (e.target.id === "catModal") catModal.classList.remove("show");
});

window.addEventListener('DOMContentLoaded', () => {
  // Stars are handled by star-system.js
  syncStars();
  const jobList = JSON.parse(localStorage.getItem('jobList'));
  for (let i = 0; i < jobList.role.length; i++) {
    if (jobList.hide[i]) continue; // Skip hidden/deleted rows

    const row = document.createElement("tr");
    row.id = 'jobRow' + i;

    row.innerHTML = `
      <td><input type="text" id=${"role"+i} value="${jobList.role[i]}" placeholder="e.g. Software Engineer"></td>
      <td><input type="text" id=${"company"+i} value="${jobList.company[i]}" placeholder="Company"></td>
      <td>
        <select id=${"status"+i}>
          ${statusOptions.map(s => `<option value="${s}" ${s === jobList.status[i] ? 'selected' : ''}>${s}</option>`).join("")}
        </select>
      </td>
      <td><input type="number" id=${"salary"+i} value="${jobList.salary[i]}" placeholder="Salary"></td>
      <td>
        <select id=${"priority"+i}>
          ${["High", "Medium", "Low"].map(p => `<option ${p === jobList.priority[i] ? 'selected' : ''}>${p}</option>`).join("")}
        </select>
      </td>
      <td class="reward-cell">—</td>
      <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;

    // Attach listeners to update localStorage on change
    const roleElement = row.querySelector(`#role${i}`);
    roleElement.addEventListener('input', () => {
      jobList.role[i] = roleElement.value;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    const companyElement = row.querySelector(`#company${i}`);
    companyElement.addEventListener('input', () => {
      jobList.company[i] = companyElement.value;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    const statusElement = row.querySelector(`#status${i}`);
    statusElement.addEventListener('change', () => {
      jobList.status[i] = statusElement.value;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    const salaryElement = row.querySelector(`#salary${i}`);
    salaryElement.addEventListener('input', () => {
      jobList.salary[i] = salaryElement.value;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    const priorityElement = row.querySelector(`#priority${i}`);
    priorityElement.addEventListener('change', () => {
      jobList.priority[i] = priorityElement.value;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    // Delete button
    row.querySelector(".delete-btn").addEventListener("click", () => {
      row.remove();
      jobList.hide[i] = true;
      localStorage.setItem('jobList', JSON.stringify(jobList));
    });

    // Status progress rewards
    const statusSelect = row.querySelector(`#status${i}`);
    let lastIndex = statusOptions.indexOf(jobList.status[i]) || 0;

    statusSelect.addEventListener("change", (e) => {
      const newStatus = e.target.value;
      const newIndex = statusOptions.indexOf(newStatus);

      if (newStatus === "Rejected") {
        catModal.classList.add("show");
      }
      if (newIndex > lastIndex && rewards[newStatus]) {
        const { xp: xpAmount, stars: starAmount } = rewards[newStatus];
        addRewards(xpAmount, starAmount);
        row.querySelector(".reward-cell").textContent = `+${starAmount}⭐ +${xpAmount}XP`;
      }

      lastIndex = newIndex;
    });

    tableBody.appendChild(row);
  }
});

// Sync with job applications from egg page
function updateSpreadsheetFromJobs() {
  if (typeof jobManager !== 'undefined') {
    const jobApplications = jobManager.getJobApplications();
    
    // Clear existing data
    const   jobList = {
    role: [],
    company: [],
    status: [],
    salary: [],
    location: [],
    dateApplied: [],
    returnOffer: [],
    connections: [],
    emailsContacts: [],
    priority: [],
    resume: [],
    hide: []
  };
    
    // Convert job applications to spreadsheet format
    jobApplications.forEach(job => {
      jobList.role.push(job.position || '');
      jobList.company.push(job.company || '');
      jobList.status.push(job.status || 'Applied');
      jobList.salary.push(job.salary || '');
      jobList.location.push(job.location || '');
      jobList.dateApplied.push(job.dateApplied || '');
      jobList.returnOffer.push(job.returnOffer || false);
      jobList.connections.push(job.connections || '');
      jobList.emailsContacts.push(job.emailsContacts || '');
      jobList.priority.push('Medium'); // Default priority
      jobList.resume.push(job.resumeFile || '');
      jobList.hide.push('false');
    });
    
    // Save to localStorage
    localStorage.setItem('jobList', JSON.stringify(jobList));
    
    // Refresh the table display
    loadTableData();
  }
}

// Load table data from localStorage
function loadTableData() {
  const jobList = JSON.parse(localStorage.getItem('jobList'));
  tableBody.innerHTML = '';
  
  for (let i = 0; i < jobList.role.length; i++) {
    if (jobList.hide[i] === 'true') continue;
    
    const row = document.createElement("tr");
    row.id = 'jobRow' + i.toString();
    
    row.innerHTML = `
      <td><input type="text" value="${jobList.role[i] || ''}" onchange="updateJobList(${i}, 'role', this.value)"></td>
      <td><input type="text" value="${jobList.company[i] || ''}" onchange="updateJobList(${i}, 'company', this.value)"></td>
      <td>
        <select onchange="updateJobList(${i}, 'status', this.value)">
          ${statusOptions.map(status => 
            `<option value="${status}" ${jobList.status[i] === status ? 'selected' : ''}>${status}</option>`
          ).join('')}
        </select>
      </td>
      <td><input type="text" value="${jobList.salary[i] || ''}" onchange="updateJobList(${i}, 'salary', this.value)"></td>
      <td><input type="text" value="${jobList.location[i] || ''}" onchange="updateJobList(${i}, 'location', this.value)"></td>
      <td><input type="date" value="${jobList.dateApplied[i] || ''}" onchange="updateJobList(${i}, 'dateApplied', this.value)"></td>
    `;
    
    tableBody.appendChild(row);
  }
}

// Update jobList when user changes values
function updateJobList(index, field, value) {
  let jobList = JSON.parse(localStorage.getItem('jobList'));
  jobList[field][index] = value;
  localStorage.setItem('jobList', JSON.stringify(jobList));
  
  // Update rewards if status changed
  if (field === 'status' && rewards[value]) {
    const reward = rewards[value];
    xp += reward.xp;
    stars += reward.stars;
    
    // Update display
    starsEl.textContent = stars;
    xpEl.textContent = xp + ' XP';
    
    // Save to localStorage
    localStorage.setItem('stars', stars);
    localStorage.setItem('xp', xp);
    
    // Update the reward cell for this row
    const row = document.getElementById('jobRow' + index);
    if (row) {
      const rewardCell = row.querySelector('.reward-cell');
      if (rewardCell) {
        rewardCell.textContent = `${reward.stars} ⭐ / ${reward.xp} XP`;
      }
    }
  }
  
  // Sync with egg page if data manager is available
  if (typeof dataManager !== 'undefined') {
    syncJobListToDataManager();
  }
}

// Upload resume function
function uploadResume(index, input) {
  const file = input.files[0];
  if (file && file.type === 'application/pdf') {
    // Create a local URL for the file
    const fileURL = URL.createObjectURL(file);
    
    // Update jobList
    let jobList = JSON.parse(localStorage.getItem('jobList'));
    jobList.resume[index] = fileURL;
    localStorage.setItem('jobList', JSON.stringify(jobList));
    
    // Update the button display
    const button = input.nextElementSibling;
    button.innerHTML = `📄 ${file.name}`;
    
    // Sync with data manager
    if (typeof dataManager !== 'undefined') {
      syncJobListToDataManager();
    }
    
    showNotification('Resume uploaded successfully!', 'success');
  } else {
    showNotification('Please select a valid PDF file', 'error');
  }
}

// Sync jobList with data manager
function syncJobListToDataManager() {
  if (typeof dataManager === 'undefined') return;
  
  const jobList = JSON.parse(localStorage.getItem('jobList'));
  const jobApplications = [];
  
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
    
    jobApplications.push(jobData);
  }
  
  // Update data manager
  localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
  
  // Update egg page circles if available
  if (typeof updateCircleDisplay === 'function') {
    jobApplications.forEach(job => {
      updateCircleDisplay(job.id, job);
    });
  }
}

// Initialize table on page load
document.addEventListener('DOMContentLoaded', function() {
  // Ensure jobList has all required fields
  let jobList = JSON.parse(localStorage.getItem('jobList'));
  if (!jobList) {
    jobList = {
      role: [],
      company: [],
      status: [],
      salary: [],
      location: [],
      dateApplied: [],
      returnOffer: [],
      connections: [],
      emailsContacts: [],
      priority: [],
      resume: [],
      hide: []
    };
    localStorage.setItem('jobList', JSON.stringify(jobList));
  }
  
  // Ensure all fields exist
  if (!jobList.location) jobList.location = [];
  if (!jobList.dateApplied) jobList.dateApplied = [];
  if (!jobList.returnOffer) jobList.returnOffer = [];
  if (!jobList.connections) jobList.connections = [];
  if (!jobList.emailsContacts) jobList.emailsContacts = [];
  if (!jobList.resume) jobList.resume = [];
  
  localStorage.setItem('jobList', JSON.stringify(jobList));
  
  // Add sample data if no data exists
  if (jobList.role.length === 0) {
    addSampleData();
  }
  
  loadTableData();
});

// Add sample data for demonstration
function addSampleData() {
  let jobList = JSON.parse(localStorage.getItem('jobList'));
  
  // Add sample job
  jobList.role.push('Software Engineer');
  jobList.company.push('Tech Corp');
  jobList.status.push('Applied');
  jobList.salary.push('$80,000');
  jobList.location.push('San Francisco, CA');
  jobList.dateApplied.push('2024-01-15');
  jobList.returnOffer.push(false);
  jobList.connections.push('John Smith - LinkedIn');
  jobList.emailsContacts.push('hr@techcorp.com');
  jobList.priority.push('High');
  jobList.resume.push('');
  jobList.hide.push('false');
  
  // Add another sample job
  jobList.role.push('Product Manager');
  jobList.company.push('StartupXYZ');
  jobList.status.push('Interview');
  jobList.salary.push('$95,000');
  jobList.location.push('New York, NY');
  jobList.dateApplied.push('2024-01-20');
  jobList.returnOffer.push(false);
  jobList.connections.push('Sarah Johnson - Referral');
  jobList.emailsContacts.push('careers@startupxyz.com');
  jobList.priority.push('Medium');
  jobList.resume.push('');
  jobList.hide.push('false');
  
  localStorage.setItem('jobList', JSON.stringify(jobList));
}

// toggleSidebar function moved to shared-scripts.js

