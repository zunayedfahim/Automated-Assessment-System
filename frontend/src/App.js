// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAssessment from './CreateAssessment';
import PreviousAssessments from './PreviousAssessments';
import PreviousAssessmentsPage from './PreviousAssessmentsPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/create">Create New Assessment</Link>
            </li>
            <li>
              <Link to="/previous">See Previous Assessments</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/create" element={<CreateAssessment />} />
          <Route path="/previous" element={<PreviousAssessments />} />
          <Route path="/previous-page" element={<PreviousAssessmentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
