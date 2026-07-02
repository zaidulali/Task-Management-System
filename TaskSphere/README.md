# TaskSphere

TaskSphere is a full-stack task management application designed for team collaboration and workflow tracking. This project follows a decoupled architecture, with a Django REST Framework backend API and a React frontend.

## Technology Stack

- **Backend:** Django REST Framework (Python 3.12, SQLite database)
- **Frontend:** React (Vite, TypeScript)

## Folder Structure

```text
TaskSphere/
├── backend/                  # Django REST Framework backend
│   ├── config/               # Project configuration and settings
│   ├── manage.py             # Django CLI
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React frontend
│   ├── src/                  # React source code and assets
│   ├── index.html            # Main entry template
│   ├── package.json          # Node dependencies and scripts
│   └── vite.config.ts        # Vite configuration
│
├── docs/                     # Project documentation
│   └── README.md
│
├── .gitignore                # Root gitignore rules
└── README.md                 # Main README (this file)
```

## Setup and Installation

### Prerequisites
- Python 3.12+
- Node.js v22+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd TaskSphere/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run at http://127.0.0.1:8000/.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd TaskSphere/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The React frontend will run at http://localhost:5173/.
