# Tech Summit Event Website

A modern, responsive single-page website for a 1-day technical conference. This application displays a dynamic schedule of talks, includes automatic time calculation, and provides real-time search filtering.

## Features

*   **Dynamic Schedule Generation:** Automatically calculates talk timings based on a 10:00 AM start, with 1-hour slots and 10-minute transitions.
*   **Smart Lunch Break:** Automatically inserts a 1-hour lunch break after the second talk.
*   **Search & Filter:** Instantly filter sessions by title, speaker name, or category keywords (e.g., "AI", "React").
*   **Modern UI:** Dark mode design with a clean timeline layout and responsive cards.
*   **JSON Data Source:** Schedule data is decoupled from the frontend, stored in a simple JSON file for easy updates.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript
*   **Data:** JSON (`data/talks.json`)

## Project Structure

```
event-website/
├── data/
│   └── talks.json       # Configuration file for talk details
├── public/
│   ├── index.html       # Main HTML structure
│   ├── style.css        # Styling and Dark Theme variables
│   └── script.js        # Frontend logic (Time calcs, Rendering, Search)
├── server.js            # Node.js Express server
└── package.json         # Project metadata and scripts
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/chinarenkai/gemini-event-talks-app.git
    cd gemini-event-talks-app/event-website
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the local server:
    ```bash
    npm start
    ```

2.  Open your browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

## Customization

*   **Edit Schedule:** Modify `data/talks.json` to add, remove, or change talks.
*   **Change Timings:** Open `public/script.js` and adjust the configuration constants (Start Time, Transition Duration, Lunch Logic).
