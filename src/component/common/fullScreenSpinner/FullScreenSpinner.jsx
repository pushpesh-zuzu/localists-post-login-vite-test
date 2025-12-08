import React from 'react';
import { Spin } from 'antd';

const FullScreenSpinner = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fdff'
    }}>
      <Spin size="large" />
    </div>
  );
};

export default FullScreenSpinner;
