import React from 'react';
import { Link } from 'react-router-dom';

const PreviousAssessments = () => {
  return (
    <div>
      <h2>Previous Assessments</h2>
      {/* Add your logic to display previous assessments here */}
      <Link to="/previous-page">Go to Previous Assessments Page</Link>
    </div>
  );
}

export default PreviousAssessments;