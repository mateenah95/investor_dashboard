# Live Links
- App (Frontend): http://investment-dashboard-app.s3.us-east-2.amazonaws.com/index.html
- API (Backend): http://3.129.251.86/api/v1

# Public Github Repo
- https://github.com/mateenah95/investor_dashboard/

# How to use the app (public)
- To use the app, simply use the App (frotend) link listed in the "Live Links" section above

# How to check API liveness
- To confirm backend API is live and healthy, simply use the publicly accessible health endpoint: /health -> http://3.129.251.86/api/v1/health

# Stack Used

- Backend 
-- Javascript (language)
-- Node js (JS Runtime)
-- Express js (API Server)
-- Sequelize (ORM)
-- Sqlite (Local File Based Database)

- Frontend
-- Javascript (language)
-- React (frontend framework)
-- HTML, CSS, JS

- Infrastructure/Tools
-- aws ec2 (backend api deployment)
-- aws s3 (frontend hosting and report files hosting)
-- git, github
-- PM2

# Objectives:

- View portfolio performance
- Track recent changes
- Download quarterly reports

# Frontend Breakdown
- The frontend app was built in React (HTML, CSS, JS) as per requirements. 

- For routing, react router dom libraty due to strong integration with react and ease of use. Similar for state management, react's built in context API was used due to small nature of the product, did not justify the overhead to use redux. 

- Bootstrap was mainly used for styling, layout, containers and other ready to use frontend components.

- Lucide React was used for icons library - good integration with React, Vue and other frameworks.

- React Google charts was used for charting library - easy to read docs and usage interface.

- React Toastify was used for notification library - to show success and error message toasts to the user. 

- The frontend was compiled down from JSX to regular HTML, CSS and JS using `npm run build` and the output was deployed on public AWS S3 bucket.

- The app has 4 total pages:
-- The login page
-- The portfolio page: /portfolio
-- The transactions page: /transactions
-- The reports page: /reports

- The login page simply allows a user to login if he/she has a valid account on the platform.

- The portfolio page simply shows a summary of the user's investment portfolio. 

- The transactions page - shows the users investment instrument purchase or sale transactions.

- The reports page - shows the user's quarterly reports. (Mock reports)

# Backend Breakdown

- The backend API was built in Javascript

- Node js was used as the Javascript runtime environment

- Express js was used to build the backend API framework

- Data was stored in a local SQLite file

- Sequelize was used as an ORM for handling migraitons and querying

- The backend API is used to serve the data for the frontend app. It provides an interface to the data via a RESTful API. The endpoints available on the API are:

-- /health (GET Endpoint / Non Protected) -> This unprotected endpoint serves as a liveness and readiness check for the API server
-- /auth (POST Endpoint / Non Protected) -> This unprotected endpoint allows registered users to authenticate. If successfully authenticated, they are issued with a JWT token to be used to authenticate subsequent protected API endpoint.
-- /portfolio (GET Endpoint / Protected) --> This protected endpoint is used to return the data for the user's investmet portfolio. Some data is mocked.
-- /transactions (GET Endpoint / Protected) --> This protected endpoint is used to return the data for the user's transaction history.
-- /reports (GET Endpoint / Protected) --> This protected endpoint is used to return a user's quarterly reports data and links.

