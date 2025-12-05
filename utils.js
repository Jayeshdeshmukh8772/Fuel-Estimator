function $id(id) {
  return document.getElementById(id);
}

function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Number(num).toFixed(decimals);
}

function formatCurrency(amount) {
  return `₹${formatNumber(amount, 2)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function exportCSV(logs) {
  if (!logs || logs.length === 0) {
    alert("No logs to export");
    return;
  }

  const headers = [
    "Date",
    "Vehicle",
    "Distance (km)",
    "Fuel Price (₹/L)",
    "Litres Added (L)",
    "Amount Paid (₹)",
    "Mileage (km/L)",
    "Fuel Used (L)",
    "Remaining Before Refill (L)",
    "Trip-F Active",
    "Estimated Range (km)",
    "Cost Per Km (₹)"
  ];

  const rows = logs.map(log => [
    formatDate(log.timestamp),
    log.vehicleModel,
    log.distance,
    log.fuelPrice,
    log.litresAdded,
    log.amountPaid,
    log.mileage,
    log.fuelUsed,
    log.remainingBeforeRefill,
    log.tripFActive ? "Yes" : "No",
    log.estimatedRange,
    log.costPerKm
  ]);

  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `fuel-logs-${Date.now()}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printSummary() {
  window.print();
}

function getCanvasContext(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  return ctx;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
