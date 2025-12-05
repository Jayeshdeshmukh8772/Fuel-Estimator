# ⛽ Fuel Estimation & Mileage Tracking Website

A complete fuel estimation and mileage tracking web application built with vanilla HTML, CSS, and JavaScript. No frameworks, no libraries, just pure web technologies.

## Features

### 1. Fuel Estimation Calculator
Calculate comprehensive fuel metrics based on your inputs:
- **Inputs:**
  - Vehicle selection (Royal Enfield models)
  - Fuel price (₹/L)
  - Distance travelled (km)
  - Amount paid (₹) OR Litres filled (L)
  - Optional known mileage (km/L)

- **Outputs:**
  - Litres added
  - Fuel used
  - Remaining fuel before refill
  - Trip-F status (based on reserve fuel level)
  - Estimated full-tank range
  - Cost per km
  - Actual mileage

### 2. Mileage Tracker
- Save all your fuel trips to local storage
- View detailed trip history in a sortable table
- Export data to CSV for external analysis
- Print summary for records
- Clear all logs with confirmation

### 3. Analytics Graphs
Pure Canvas-based charts (no chart libraries):
- **Mileage Over Time:** Track your fuel efficiency trends
- **Cost Per Km:** Monitor your fuel cost patterns
- Features:
  - Light grid lines for readability
  - Data points and smooth line paths
  - Responsive design for all screen sizes
  - "No data" message when empty
  - High-DPI display support

### 4. Trip-F Logic (Royal Enfield Classic 350)
- Trip-F activates when remaining fuel <= reserve litres
- Visual indicators show Trip-F status
- Example: Classic 350 with 3.8L reserve

### 5. Dark Mode Support
- Toggle between light and dark themes
- Theme preference saved to localStorage
- Material 3 design principles in both modes

## File Structure

```
project/
├── index.html          # Main HTML structure
├── styles.css          # Material 3 styling with dark mode
├── data.js             # Vehicle data and localStorage functions
├── utils.js            # Utility functions (formatting, export, etc.)
├── fuelLogic.js        # Fuel calculation logic
├── app.js              # Main application logic
└── README.md           # This file
```

## Installation & Usage

1. **Clone or download** this project
2. **Open `index.html`** in any modern web browser
3. **No build step required** - everything runs client-side

### Supported Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## How to Use

### Calculate Fuel Estimation
1. Select your vehicle from the dropdown
2. Enter fuel price (₹/L)
3. Enter distance travelled (km)
4. Enter either:
   - Amount paid (₹), OR
   - Litres filled (L)
5. Optionally enter known mileage
6. Click **Calculate**
7. View results in the right panel

### Save a Trip
1. After calculating, click **Save Trip**
2. Trip is added to your logs
3. View in Mileage Tracker section below

### Export Data
- Click **Export CSV** to download your trip logs
- Use Excel, Google Sheets, or any CSV reader

### Print Summary
- Click **Print Summary** to print your logs
- Uses browser's native print dialog

### Clear Logs
- Click **Clear All Logs** (with confirmation)
- Permanently removes all trip data

## Technical Details

### Fuel Calculation Logic

```javascript
litresAdded = litresFilled > 0 ? litresFilled : (amountPaid / fuelPrice)
fuelUsed = distance / mileage
remainingBeforeRefill = tankCapacity - litresAdded
tripFActive = remainingBeforeRefill <= reserveLitres
estimatedRangeLeft = tankCapacity * mileage
costPerKm = totalCost / distance
```

### Data Storage

Uses `localStorage` with the following keys:
- `fe_vehicles_v1` - Vehicle database
- `fe_logs_v1` - Trip logs
- `fe_theme` - Theme preference

### Vehicle Example

```javascript
{
  id: "classic-350-2025",
  model: "Royal Enfield Classic 350 (2025) - Gun Grey",
  tankCapacity: 13,
  reserveLitres: 3.8,
  avgMileage: 32
}
```

## Design

### Material 3 Principles
- Clean, modern interface
- Elevated cards with subtle shadows
- 16px border radius
- 20px spacing between sections
- 12px spacing between form elements
- Responsive typography
- Accessible color contrast

### Responsive Design
- Desktop: Calculator and results side-by-side
- Mobile: Stacked layout
- Full-width tables with horizontal scroll
- Touch-friendly button sizes

## Browser Support

Requires modern browser with support for:
- ES6+ JavaScript
- CSS Grid & Flexbox
- Canvas API
- localStorage API

## License

This project is open source and available for personal and educational use.

## Credits

Built with ❤️ using vanilla web technologies
© 2025 Fuel Tracker
