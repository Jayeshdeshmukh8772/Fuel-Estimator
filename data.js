const VEHICLES = [
  {
    id: "classic-350-2025",
    model: "Royal Enfield Classic 350 (2025)",
    tankCapacity: 13,
    reserveLitres: 3.8,
    avgMileage: 32
  },
  {
    id: "himalayan-450-2024",
    model: "Royal Enfield Himalayan 450 (2024)",
    tankCapacity: 17,
    reserveLitres: 4.5,
    avgMileage: 28
  },
  {
    id: "hunter-350-2023",
    model: "Royal Enfield Hunter 350 (2023)",
    tankCapacity: 13,
    reserveLitres: 3.5,
    avgMileage: 35
  },
  {
    id: "bullet-350-2024",
    model: "Royal Enfield Bullet 350 (2024)",
    tankCapacity: 13.5,
    reserveLitres: 4,
    avgMileage: 30
  },
  {
    id: "meteor-350-2023",
    model: "Royal Enfield Meteor 350 (2023)",
    tankCapacity: 15,
    reserveLitres: 4,
    avgMileage: 33
  }
];

const STORAGE_KEYS = {
  VEHICLES: "fe_vehicles_v1",
  LOGS: "fe_logs_v1",
  THEME: "fe_theme"
};

function loadVehicles() {
  const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading vehicles:", e);
    }
  }
  saveVehicles(VEHICLES);
  return VEHICLES;
}

function saveVehicles(vehicles) {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  } catch (e) {
    console.error("Error saving vehicles:", e);
  }
}

function loadLogs() {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading logs:", e);
    }
  }
  return [];
}

function saveLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Error saving logs:", e);
  }
}

function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
