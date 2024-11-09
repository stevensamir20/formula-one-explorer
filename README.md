# Formula One Explorer

## Project Setup and Running Instructions

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/stevensamir20/formula-one-explorer.git
cd formula-one-explorer
```

2. Install dependencies:

```sh
npm install
```

### Running the Project

1. Start the development server:

```sh
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

### Running Tests

1. Run the test suite:

```sh
npm run test
```

2. Run Cypress for end-to-end testing:

```sh
npx cypress open
```

## Technical Approach and Architectural Decisions

### Summary

The Formula One Explorer project is a web application designed to provide users with detailed information about Formula One seasons, races, and drivers. The application is built using React for the frontend, with a focus on providing a responsive and interactive user experience.

### Architectural Decisions

1. **Frontend**:

- **React**: Chosen for its component-based architecture, which allows for reusable UI components and efficient state management.
- **Redux**: Used for state management to handle complex state interactions and ensure a predictable state container.
- **React Router**: Implemented for client-side routing to provide a seamless navigation experience.
- **Material-UI**: Utilized for UI components to ensure a consistent and visually appealing design.
- **ApexCharts**: Used for data visualization to display race statistics and other relevant data.

2. **API Integration**:

- **Ergast API**: Used to fetch data about Formula One seasons, races, and drivers. This includes endpoints like `/api/f1/seasons.json`, `/api/f1/{season}/races.json`, and `/api/f1/{season}/{round}/results.json`.

3. **Features**:

- **Season Listing**: Fetch and display all available seasons with pagination and a toggle switch for List/Card view.
- **Races for a Season**: Fetch races for the selected season, including race name, circuit name, and date. Implement pagination, List/Card view toggle, and pinning favorite races.
- **Race Details**: Display participating drivers with their details and provide performance visualization using charts.

4. **Testing**:

- **Jest**: Utilized for unit and integration testing due to its simplicity and powerful features.
- **Testing Library**: Used alongside Jest for testing React components, providing utilities to test component output.
- **Cypress**: Employed for end-to-end testing to ensure the application works as expected from the user's perspective.

By leveraging these technologies and architectural decisions, the Formula One Explorer project aims to deliver a high-performance, scalable, and maintainable application.
