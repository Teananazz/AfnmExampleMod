
import React, { useState } from 'react';

export const T_Button: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '10px', background: '#222', color: '#fff', borderRadius: '4px' }}>
      <p>Custom Mod React Component</p>
      <button onClick={() => setCount(c => c + 1)}>Clicked {count} times</button>
    </div>
  );
};