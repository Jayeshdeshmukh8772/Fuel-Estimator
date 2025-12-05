let vehicles = [];
let logs = [];
let currentCalculation = null;

function init() {
  vehicles = loadVehicles();
  logs = loadLogs();

  applyTheme();
  populateVehicleSelect();
  renderLogs();
  renderCharts();
  attachEventListeners();
}

function applyTheme() {
  const theme = getTheme();
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    $id("theme-toggle").textContent = "☀️";
  } else {
    document.documentElement.classList.remove("dark");
    $id("theme-toggle").textContent = "🌙";
  }
}

function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  saveTheme(newTheme);
  applyTheme();
}

function populateVehicleSelect() {
  const select = $id("vehicle-select");
  select.innerHTML = '<option value="">Select a vehicle</option>';

  vehicles.forEach(vehicle => {
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = vehicle.model;
    select.appendChild(option);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const vehicleId = $id("vehicle-select").value;
  const vehicle = vehicles.find(v => v.id === vehicleId);

  if (!vehicle) {
    alert("Please select a vehicle");
    return;
  }

  const fuelPrice = parseFloat($id("fuel-price").value);
  const distance = parseFloat($id("distance").value);
  const amountPaid = parseFloat($id("amount-paid").value) || 0;
  const litresFilled = parseFloat($id("litres-filled").value) || 0;
  const knownMileage = parseFloat($id("known-mileage").value) || 0;

  if (!fuelPrice || !distance) {
    alert("Please fill in all required fields");
    return;
  }

  if (!amountPaid && !litresFilled) {
    alert("Please provide either Amount Paid or Litres Filled");
    return;
  }

  const inputs = {
    vehicle,
    fuelPrice,
    distance,
    amountPaid,
    litresFilled,
    knownMileage
  };

  const results = calculateFuelEstimation(inputs);
  currentCalculation = { inputs, results };

  displayResults(results, vehicle);
  $id("save-trip-btn").disabled = false;
}

function displayResults(results, vehicle) {
  const resultsContent = $id("results-content");

  const html = `
    <div class="result-item">
      <span class="result-label">Litres Added</span>
      <span class="result-value">${formatNumber(results.litresAdded)} L</span>
    </div>
    <div class="result-item">
      <span class="result-label">Fuel Used</span>
      <span class="result-value">${formatNumber(results.fuelUsed)} L</span>
    </div>
    <div class="result-item ${results.tripFActive ? 'trip-f-active' : ''}">
      <span class="result-label">Remaining Before Refill</span>
      <span class="result-value">${formatNumber(results.remainingBeforeRefill)} L</span>
    </div>
    <div class="result-item ${results.tripFActive ? 'trip-f-active' : ''}">
      <span class="result-label">Trip-F Status</span>
      <span class="trip-f-badge ${results.tripFActive ? 'active' : 'inactive'}">
        ${results.tripFActive ? '⚠️ ACTIVE' : '✓ INACTIVE'}
      </span>
    </div>
    <div class="result-item">
      <span class="result-label">Estimated Full-Tank Range</span>
      <span class="result-value">${formatNumber(results.estimatedRange)} km</span>
    </div>
    <div class="result-item">
      <span class="result-label">Mileage</span>
      <span class="result-value">${formatNumber(results.mileage)} km/L</span>
    </div>
    <div class="result-item">
      <span class="result-label">Cost Per Km</span>
      <span class="result-value">${formatCurrency(results.costPerKm)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Total Cost</span>
      <span class="result-value">${formatCurrency(results.totalCost)}</span>
    </div>
  `;

  resultsContent.innerHTML = html;
}

function handleSaveTrip() {
  if (!currentCalculation) {
    alert("Please calculate first");
    return;
  }

  const tripLog = createTripLog(
    currentCalculation.inputs,
    currentCalculation.results
  );

  logs.unshift(tripLog);
  saveLogs(logs);

  renderLogs();
  renderCharts();

  alert("Trip saved successfully!");
  $id("save-trip-btn").disabled = true;
}

function renderLogs() {
  const tbody = $id("logs-tbody");

  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">No trips logged yet</td></tr>';
    return;
  }

  tbody.innerHTML = logs.map(log => `
    <tr>
      <td>${formatDate(log.timestamp)}</td>
      <td>${log.vehicleModel}</td>
      <td>${formatNumber(log.distance)}</td>
      <td>${formatNumber(log.litresAdded)}</td>
      <td>${formatCurrency(log.amountPaid)}</td>
      <td>${formatNumber(log.mileage)}</td>
      <td>${formatCurrency(log.costPerKm)}</td>
      <td>
        <span class="trip-f-badge ${log.tripFActive ? 'active' : 'inactive'}">
          ${log.tripFActive ? 'Yes' : 'No'}
        </span>
      </td>
    </tr>
  `).join('');
}

function handleExportCSV() {
  exportCSV(logs);
}

function handlePrintSummary() {
  printSummary();
}

function handleClearLogs() {
  if (logs.length === 0) {
    alert("No logs to clear");
    return;
  }

  if (confirm("Are you sure you want to clear all logs? This cannot be undone.")) {
    logs = [];
    saveLogs(logs);
    renderLogs();
    renderCharts();
    alert("All logs cleared");
  }
}

function renderCharts() {
  renderMileageChart();
  renderCostChart();
}

function renderMileageChart() {
  const canvas = $id("mileage-chart");
  const rect = canvas.getBoundingClientRect();
  const ctx = getCanvasContext(canvas);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  if (logs.length === 0) {
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-secondary');
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No data available", width / 2, height / 2);
    return;
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const recentLogs = logs.slice(0, 10).reverse();
  const mileageValues = recentLogs.map(log => log.mileage);
  const maxMileage = Math.max(...mileageValues);
  const minMileage = Math.min(...mileageValues);
  const mileageRange = maxMileage - minMileage || 10;

  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--border').trim();
  const lineColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary').trim();
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary').trim();

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  recentLogs.forEach((log, index) => {
    const x = padding + (chartWidth / (recentLogs.length - 1 || 1)) * index;
    const normalizedValue = (log.mileage - minMileage) / mileageRange;
    const y = padding + chartHeight - (normalizedValue * chartHeight);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.fillStyle = lineColor;
  recentLogs.forEach((log, index) => {
    const x = padding + (chartWidth / (recentLogs.length - 1 || 1)) * index;
    const normalizedValue = (log.mileage - minMileage) / mileageRange;
    const y = padding + chartHeight - (normalizedValue * chartHeight);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = textColor;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 5; i++) {
    const value = maxMileage - (mileageRange / 5) * i;
    const y = padding + (chartHeight / 5) * i;
    ctx.fillText(formatNumber(value, 1), padding - 10, y);
  }
}

function renderCostChart() {
  const canvas = $id("cost-chart");
  const rect = canvas.getBoundingClientRect();
  const ctx = getCanvasContext(canvas);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  if (logs.length === 0) {
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-secondary');
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No data available", width / 2, height / 2);
    return;
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const recentLogs = logs.slice(0, 10).reverse();
  const costValues = recentLogs.map(log => log.costPerKm);
  const maxCost = Math.max(...costValues);
  const minCost = Math.min(...costValues);
  const costRange = maxCost - minCost || 1;

  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--border').trim();
  const lineColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--danger').trim();
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary').trim();

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  recentLogs.forEach((log, index) => {
    const x = padding + (chartWidth / (recentLogs.length - 1 || 1)) * index;
    const normalizedValue = (log.costPerKm - minCost) / costRange;
    const y = padding + chartHeight - (normalizedValue * chartHeight);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.fillStyle = lineColor;
  recentLogs.forEach((log, index) => {
    const x = padding + (chartWidth / (recentLogs.length - 1 || 1)) * index;
    const normalizedValue = (log.costPerKm - minCost) / costRange;
    const y = padding + chartHeight - (normalizedValue * chartHeight);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = textColor;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 5; i++) {
    const value = maxCost - (costRange / 5) * i;
    const y = padding + (chartHeight / 5) * i;
    ctx.fillText(formatCurrency(value), padding - 10, y);
  }
}

function attachEventListeners() {
  $id("fuel-form").addEventListener("submit", handleFormSubmit);
  $id("save-trip-btn").addEventListener("click", handleSaveTrip);
  $id("export-csv-btn").addEventListener("click", handleExportCSV);
  $id("print-summary-btn").addEventListener("click", handlePrintSummary);
  $id("clear-logs-btn").addEventListener("click", handleClearLogs);
  $id("theme-toggle").addEventListener("click", toggleTheme);
}

document.addEventListener("DOMContentLoaded", init);
