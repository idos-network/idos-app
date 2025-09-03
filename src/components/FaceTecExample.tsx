import React, { useEffect } from 'react';
import '../styles/facetec-custom.css';
import { myApp } from '../utils/facetec';

// Make myApp available globally for FaceTec callbacks
(window as any).myApp = myApp;

export const FaceTecExample: React.FC = () => {
  useEffect(() => {
    // Initialize FaceTec when component mounts
    myApp.init();
  }, []);

  const handleLivenessCheck = () => {
    myApp.onLivenessCheckClick();
  };

  return (
    <div className="facetec-container">
      {/* Custom styling for centered container */}
      <style>{`
        .facetec-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .facetec-button {
          background: #ffffff;
          color: #333333;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          margin-bottom: 2rem;
        }

        .facetec-button:hover {
          background: #f8f9fa;
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .facetec-info {
          text-align: center;
          color: white;
          max-width: 400px;
          margin-bottom: 2rem;
        }

        .facetec-info h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .facetec-info p {
          font-size: 16px;
          opacity: 0.9;
          line-height: 1.6;
        }
      `}</style>

      <div className="facetec-info">
        <h2>FaceTec Liveness Check</h2>
        <p>
          Click the button below to start the liveness verification process. The
          camera frame will appear in a centered, compact layout.
        </p>
      </div>

      <button className="facetec-button" onClick={handleLivenessCheck}>
        Start Liveness Check
      </button>

      {/* This div will contain the FaceTec SDK when active */}
      <div
        id="facetec-sdk-container"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* FaceTec SDK will inject its interface here */}
      </div>
    </div>
  );
};
