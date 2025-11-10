import React from 'react';
const batchOptions = ['Batch A', 'Batch B', 'Batch C'];
function BatchSelectPage({ onSelect }) {
  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Please select a batch</h2>
      {batchOptions.map(b => (
        <button
          key={b}
          style={{ margin: 12, padding: "12px 32px", fontSize: 24 }}
          onClick={() => onSelect(b)}
        >
          {b}
        </button>
      ))}
    </div>
  );
}
export default BatchSelectPage;