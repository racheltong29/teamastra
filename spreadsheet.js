let xp = 0;
let stars = parseInt(localStorage.getItem('stars')) || 0;

// Elements
const starsEl = document.getElementById("stars");
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

if(localStorage.getItem('stars') === null){
  localStorage.setItem('stars',0);
}



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
  stars += starAmount;

  localStorage.setItem('stars', stars); // Save updated stars
  starsEl.textContent = stars.toString();
  xpEl.textContent = xp + " XP";
}

// Close modal
closeCatModal.addEventListener("click", () => {
  catModal.classList.remove("show");
});
catModal.addEventListener("click", (e) => {
  if (e.target.id === "catModal") catModal.classList.remove("show");
});

window.addEventListener('DOMContentLoaded', () => {
  starsEl.textContent = stars.toString();
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
    const jobList = {
      role: [],
      company: [],
      status: [],
      salary: [],
      priority: [],
      hide: []
    };
    
    // Convert job applications to spreadsheet format
    jobApplications.forEach(job => {
      jobList.role.push(job.position || '');
      jobList.company.push(job.company || '');
      jobList.status.push(job.status || 'Applied');
      jobList.salary.push(job.salary || '');
      jobList.priority.push('Medium'); // Default priority
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
      <td>
        <select onchange="updateJobList(${i}, 'priority', this.value)">
          <option value="High" ${jobList.priority[i] === 'High' ? 'selected' : ''}>High</option>
          <option value="Medium" ${jobList.priority[i] === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="Low" ${jobList.priority[i] === 'Low' ? 'selected' : ''}>Low</option>
        </select>
      </td>
      <td class="reward-cell">${getRewardText(jobList.status[i])}</td>
      <td><button class="delete-btn" onclick="deleteRow(${i})">Delete</button></td>
    `;
    
    tableBody.appendChild(row);
  }
}

// Initialize table on page load
document.addEventListener('DOMContentLoaded', function() {
  loadTableData();
});

// toggleSidebar function moved to shared-scripts.js


