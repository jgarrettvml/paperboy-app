# Paperboy 3D

A modern 3D remake of the classic Paperboy game using Three.js and Vite.

## Features

- 3D graphics with Three.js
- Physics-based gameplay
- Multiple house styles and environments
- Realistic newspaper throwing mechanics
- Progressive difficulty

## Game Controls

- **Arrow keys** or **WASD**: Move the player
- **Space bar**: Throw newspaper
- Hills can be jumped for bonus points
- Deliver newspapers to mailboxes (20 pts) or porches (10 pts)
- Avoid obstacles (-5 pts)

## Development

This project uses Vite as the build tool.

### Prerequisites

- Node.js (v14 or newer)
- npm (v7 or newer)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/paperboy-3d.git
   cd paperboy-3d
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Project Structure

- `src/`: Source code
  - `index.html`: Main HTML file
  - `js/`: JavaScript modules
    - `main.js`: Entry point
    - `game.js`: Game logic
    - `player.js`: Player character
    - `world/`: World generation
      - `blocks.js`: Base block generation
      - `houses.js`: House generation
      - `parks.js`: Park generation
      - `obstacles.js`: Game obstacles
      - `streets.js`: Street generation
  - `styles/`: CSS styles
- `public/`: Static assets
  - `assets/`: Images, models, sounds, etc.

## License

MIT
