'use client';

import { useState, useEffect } from 'react';

export default function InfoPanel({ planet, onBack }) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!planet || !planet.facts) return null;

  const isSun = planet.name === 'Sun';
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 900;

  // Responsive panel container styles
  const panelStyle = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        transform: 'none',
        width: '100%',
        maxHeight: '65vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: '0',
        padding: '20px',
        fontFamily: 'inherit',
        color: '#e8e8e8',
        zIndex: 100,
        boxSizing: 'border-box',
      }
    : isTablet
    ? {
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        maxHeight: '85vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '0',
        padding: '24px',
        fontFamily: 'inherit',
        color: '#e8e8e8',
        zIndex: 100,
        boxSizing: 'border-box',
      }
    : {
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '340px',
        maxHeight: '85vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '0',
        padding: '24px',
        fontFamily: 'inherit',
        color: '#e8e8e8',
        zIndex: 100,
        boxSizing: 'border-box',
      };

  return (
    <div style={panelStyle} className="custom-scrollbar">
      {/* a. Header Label */}
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}
      >
        SELECTED OBJECT
      </div>

      {/* b. Name */}
      <h2
        style={{
          fontSize: isMobile ? '24px' : '28px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
          marginTop: 0,
          color: '#ffffff',
        }}
      >
        {planet.name}
      </h2>

      {/* c. Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginBottom: '16px',
        }}
      />

      {/* d. Stat Rows */}
      {isSun ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              STAR TYPE
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.starType}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              SURFACE TEMP
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.surfaceTemp}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              MASS
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.mass}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              GRAVITY
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.gravity}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              DAY LENGTH
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.dayLength}
            </span>
          </div>

          {/* Full-width COMPOSITION row */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              COMPOSITION
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
              {planet.facts.composition}
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              DIAMETER
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.diameter}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              DISTANCE FROM SUN
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.distanceFromSun}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ORBITAL PERIOD
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.orbitalPeriod}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              MOONS
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.moons}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              MASS
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.mass}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              GRAVITY
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff' }}>
              {planet.facts.gravity}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              AVG TEMPERATURE
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.avgTemp}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              DAY LENGTH
            </span>
            <span style={{ fontSize: '12px', color: '#ffffff', textAlign: 'right', maxWidth: '60%' }}>
              {planet.facts.dayLength}
            </span>
          </div>

          {/* Full-width ATMOSPHERE row */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              ATMOSPHERE
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
              {planet.facts.atmosphere}
            </div>
          </div>
        </>
      )}

      {/* e. Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginTop: '8px',
          marginBottom: '16px',
        }}
      />

      {/* f. Observation Log Label */}
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        OBSERVATION LOG
      </div>

      {/* g. Bulleted Fun Facts List */}
      {planet.facts.funFacts && planet.facts.funFacts.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            paddingLeft: 0,
            margin: 0,
            marginBottom: '24px',
          }}
        >
          {planet.facts.funFacts.map((fact, index) => (
            <li
              key={index}
              style={{
                position: 'relative',
                paddingLeft: '16px',
                marginBottom: '10px',
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'rgba(255, 220, 130, 0.75)',
                  fontSize: '11px',
                }}
              >
                ▸
              </span>
              {fact}
            </li>
          ))}
        </ul>
      )}

      {/* h. Back Button */}
      <button
        onClick={onBack}
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={{
          width: '100%',
          padding: '12px',
          background: isBtnHovered ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          fontFamily: 'inherit',
          fontSize: '11px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          display: 'block',
          boxSizing: 'border-box',
        }}
      >
        ← BACK TO SOLAR SYSTEM
      </button>
    </div>
  );
}
