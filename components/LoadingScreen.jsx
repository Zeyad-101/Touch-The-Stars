'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen({ isLoaded }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setHidden(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#030509',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        pointerEvents: isLoaded ? 'none' : 'auto',
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
        fontFamily: 'inherit',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Warp Stars / Speed Lines */}
      <div className="launch-stars" />

      {/* Rocket Vessel & Exhaust Assembly */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: isLoaded ? 'translateY(-180vh) scale(0.9)' : 'translateY(0) scale(1)',
          transition: 'transform 1.1s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        {/* Sleek Space Rocket SVG */}
        <svg
          width="70"
          height="115"
          viewBox="0 0 70 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 160, 40, 0.45))' }}
        >
          {/* Main Fuselage */}
          <path
            d="M35 4C23 19 18 45 18 78H52C52 45 47 19 35 4Z"
            fill="#ECEFF4"
          />
          {/* Aerodynamic Nosecone */}
          <path
            d="M35 4C29 13 26 26 26 34H44C44 26 41 13 35 4Z"
            fill="#D08770"
          />
          {/* Mission Capsule Porthole */}
          <circle cx="35" cy="46" r="6" fill="#2E3440" stroke="#88C0D0" strokeWidth="2" />
          <circle cx="33.5" cy="44.5" r="2" fill="#ECEFF4" />

          {/* Hull Panel Seams & Accents */}
          <line x1="35" y1="58" x2="35" y2="74" stroke="#D8DEE9" strokeWidth="1.5" />
          <rect x="25" y="66" width="20" height="2.5" fill="#BF616A" rx="1" />

          {/* Lateral Stabilizer Fins */}
          <path
            d="M18 56L6 80V90L18 84V56Z"
            fill="#434C5E"
          />
          <path
            d="M52 56L64 80V90L52 84V56Z"
            fill="#434C5E"
          />
          <path
            d="M22 78L14 93H24L26 78H22Z"
            fill="#3B4252"
          />
          <path
            d="M48 78L56 93H46L44 78H48Z"
            fill="#3B4252"
          />

          {/* Main Rocket Engine Nozzle */}
          <path
            d="M27 78H43L40 88H30L27 78Z"
            fill="#4C566A"
          />
        </svg>

        {/* Multi-stage Propulsion Exhaust Flame */}
        <div className="rocket-exhaust">
          <div className="flame-core" />
          <div className="flame-outer" />
          <div className="smoke-puff puff-1" />
          <div className="smoke-puff puff-2" />
          <div className="smoke-puff puff-3" />
        </div>
      </div>

      {/* Mission Control Status Display */}
      <div
        style={{
          marginTop: '44px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          opacity: isLoaded ? 0.3 : 1,
          transform: isLoaded ? 'translateY(15px)' : 'translateY(0)',
          transition: 'all 0.5s ease',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '3px',
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase',
          }}
        >
          MISSION CONTROL // DEEP SPACE EXPLORATION
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#ffffff',
            textTransform: 'uppercase',
            textShadow: '0 0 25px rgba(255, 255, 255, 0.3)',
          }}
        >
          TOUCH THE STARS
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px',
            fontSize: '11px',
            letterSpacing: '2px',
            color: '#EBCB8B',
            textTransform: 'uppercase',
          }}
        >
          <span className="blinking-dot" />
          <span>{isLoaded ? 'ORBITAL INSERTION // SYSTEMS READY' : 'PREPARING TRAJECTORY & TELEMETRY...'}</span>
        </div>
      </div>
    </div>
  );
}
