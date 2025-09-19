import React from 'react';

const ManufacturerLogo = ({ manufacturer, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const logoStyle = {
    width: size === 'small' ? '24px' : size === 'medium' ? '32px' : '48px',
    height: size === 'small' ? '24px' : size === 'medium' ? '32px' : '48px',
    display: 'inline-block',
    verticalAlign: 'middle'
  };

  const renderLogo = () => {
    switch (manufacturer?.toLowerCase()) {
      case 'chargepoint':
        return (
          <svg viewBox="0 0 100 40" style={logoStyle}>
            <rect x="5" y="5" width="90" height="30" rx="4" fill="#00A651" />
            <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              ChargePoint
            </text>
          </svg>
        );

      case 'abb':
        return (
          <svg viewBox="0 0 60 40" style={logoStyle}>
            <rect x="5" y="5" width="50" height="30" rx="3" fill="#FF0000" />
            <text x="30" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              ABB
            </text>
          </svg>
        );

      case 'tesla':
        return (
          <svg viewBox="0 0 60 40" style={logoStyle}>
            <rect x="5" y="5" width="50" height="30" rx="3" fill="#E31937" />
            <text x="30" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              TESLA
            </text>
          </svg>
        );

      case 'btc power':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#1B5E20" />
            <text x="40" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              BTC
            </text>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              POWER
            </text>
          </svg>
        );

      case 'cummins':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#FFD700" />
            <text x="40" y="25" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">
              CUMMINS
            </text>
          </svg>
        );

      case 'heliox':
        return (
          <svg viewBox="0 0 70 40" style={logoStyle}>
            <rect x="5" y="5" width="60" height="30" rx="3" fill="#0066CC" />
            <text x="35" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              heliox
            </text>
          </svg>
        );

      case 'freewire':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#32CD32" />
            <text x="40" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
              FreeWire
            </text>
          </svg>
        );

      case 'schneider electric':
        return (
          <svg viewBox="0 0 90 40" style={logoStyle}>
            <rect x="5" y="5" width="80" height="30" rx="3" fill="#3DCD58" />
            <text x="45" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              Schneider
            </text>
            <text x="45" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              Electric
            </text>
          </svg>
        );

      case 'siemens':
        return (
          <svg viewBox="0 0 70 40" style={logoStyle}>
            <rect x="5" y="5" width="60" height="30" rx="3" fill="#00A0C6" />
            <text x="35" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              SIEMENS
            </text>
          </svg>
        );

      case 'tritium':
        return (
          <svg viewBox="0 0 70 40" style={logoStyle}>
            <rect x="5" y="5" width="60" height="30" rx="3" fill="#8E44AD" />
            <text x="35" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              Tritium
            </text>
          </svg>
        );

      case 'wallbox':
        return (
          <svg viewBox="0 0 70 40" style={logoStyle}>
            <rect x="5" y="5" width="60" height="30" rx="3" fill="#F39C12" />
            <text x="35" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              Wallbox
            </text>
          </svg>
        );

      case 'webasto':
        return (
          <svg viewBox="0 0 70 40" style={logoStyle}>
            <rect x="5" y="5" width="60" height="30" rx="3" fill="#1E88E5" />
            <text x="35" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
              Webasto
            </text>
          </svg>
        );

      case 'kempower':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#9C27B0" />
            <text x="40" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
              Kempower
            </text>
          </svg>
        );

      case 'evbox':
        return (
          <svg viewBox="0 0 60 40" style={logoStyle}>
            <rect x="5" y="5" width="50" height="30" rx="3" fill="#4CAF50" />
            <text x="30" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              EVBox
            </text>
          </svg>
        );

      case 'evgo':
        return (
          <svg viewBox="0 0 60 40" style={logoStyle}>
            <rect x="5" y="5" width="50" height="30" rx="3" fill="#673AB7" />
            <text x="30" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              EVgo
            </text>
          </svg>
        );

      case 'electrify america':
        return (
          <svg viewBox="0 0 90 40" style={logoStyle}>
            <rect x="5" y="5" width="80" height="30" rx="3" fill="#2196F3" />
            <text x="45" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              Electrify
            </text>
            <text x="45" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              America
            </text>
          </svg>
        );

      case 'delta electronics':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#795548" />
            <text x="40" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              Delta
            </text>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              Electronics
            </text>
          </svg>
        );

      case 'blink charging':
        return (
          <svg viewBox="0 0 80 40" style={logoStyle}>
            <rect x="5" y="5" width="70" height="30" rx="3" fill="#00BCD4" />
            <text x="40" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              Blink
            </text>
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              Charging
            </text>
          </svg>
        );

      case 'hmi':
        return (
          <svg viewBox="0 0 50 40" style={logoStyle}>
            <rect x="5" y="5" width="40" height="30" rx="3" fill="#FF5722" />
            <text x="25" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              HMI
            </text>
          </svg>
        );

      default:
        // Generic logo for unknown manufacturers
        return (
          <svg viewBox="0 0 40 40" style={logoStyle}>
            <circle cx="20" cy="20" r="15" fill="#9E9E9E" />
            <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              {manufacturer?.charAt(0) || '?'}
            </text>
          </svg>
        );
    }
  };

  return (
    <span className="manufacturer-logo" title={manufacturer}>
      {renderLogo()}
    </span>
  );
};

export default ManufacturerLogo;