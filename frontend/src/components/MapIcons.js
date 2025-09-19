import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapIcons.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Infrastructure icon types from the mockup
const iconTypes = [
  { id: 'solar', name: 'Solar PV', icon: '☀️', color: '#FFD700' },
  { id: 'battery', name: 'Battery Storage', icon: '🔋', color: '#32CD32' },
  { id: 'ev-demand', name: 'EV Demand', icon: '🚗', color: '#FF6B6B' },
  { id: 'diesel-gen', name: 'Diesel Generator', icon: '⛽', color: '#FF4500' },
  { id: 'gas-gen', name: 'Gas Generator', icon: '🏭', color: '#32CD32' },
  { id: 'linear-gen', name: 'Linear Generator', icon: '📦', color: '#9370DB' },
  { id: 'boiler', name: 'Boiler', icon: '🔥', color: '#DC143C' },
  { id: 'elec-chiller', name: 'Elec. Chiller', icon: '❄️', color: '#4169E1' },
  { id: 'cable', name: 'Cable', icon: '🔌', color: '#696969', isConnection: true },
];

// Map movement component
function MapController({ center }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  
  return null;
}

// Draggable icon component
function DraggableIcon({ iconType, disabled, onCableMode }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'icon',
    item: () => {
      console.log('Started dragging:', iconType.name);
      return { iconType };
    },
    canDrag: !disabled,
    end: (item, monitor) => {
      console.log('Ended dragging:', iconType.name, 'dropped:', monitor.didDrop());
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable-icon ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      style={{
        backgroundColor: iconType.color,
        opacity: isDragging ? 0.5 : disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'grab',
      }}
      title={disabled ? 'Place other icons first before using cables' : `Drag ${iconType.name} to map`}
      onClick={() => {
        if (!disabled) {
          console.log('Icon clicked:', iconType.name);
          if (iconType.isConnection) {
            console.log('Cable icon clicked - entering cable mode');
            onCableMode && onCableMode();
          } else {
            // Fallback: place at map center for testing
            window.testIconDrop && window.testIconDrop(iconType);
          }
        }
      }}
    >
      <div className="icon-symbol">{iconType.icon}</div>
      <div className="icon-label">{iconType.name}</div>
    </div>
  );
}

// Map drop zone component
function MapDropZone({ children, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'icon',
    drop: (item, monitor) => {
      console.log('Drop detected:', item);
      const clientOffset = monitor.getClientOffset();
      console.log('Client offset:', clientOffset);
      if (clientOffset && onDrop) {
        onDrop(item.iconType, clientOffset);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`map-drop-zone ${isOver ? 'drop-active' : ''}`}>
      {children}
    </div>
  );
}

// Main MapIcons component
function MapIcons() {
  const [searchInput, setSearchInput] = useState('');
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA
  const [placedIcons, setPlacedIcons] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLayer, setMapLayer] = useState('satellite'); // Default to satellite
  const [cableMode, setCableMode] = useState(null); // { fromIcon: iconId, mousePosition: [lat, lng] }
  const [mapName, setMapName] = useState('');
  const [savedMaps, setSavedMaps] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const mapRef = useRef(null);

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&countrycodes=us&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('Location not found. Please try a different city or zip code.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dropping icons on the map
  const handleIconDrop = (iconType, clientOffset) => {
    console.log('handleIconDrop called with:', iconType, clientOffset);
    if (!mapRef.current) {
      console.log('mapRef.current is null');
      return;
    }

    // Handle cable connections differently
    if (iconType.isConnection) {
      console.log('Handling cable connection');
      handleCableStart(clientOffset);
      return;
    }

    const map = mapRef.current;
    const mapContainer = map.getContainer();
    const mapRect = mapContainer.getBoundingClientRect();
    
    // Convert screen coordinates to map coordinates
    const x = clientOffset.x - mapRect.left;
    const y = clientOffset.y - mapRect.top;
    const latLng = map.containerPointToLatLng([x, y]);

    console.log('Placing icon at:', latLng);

    // Add the icon to placed icons
    const newIcon = {
      id: Date.now(),
      iconType,
      position: [latLng.lat, latLng.lng],
      name: `${iconType.name} ${placedIcons.filter(p => p.iconType.id === iconType.id).length + 1}`, // Auto-increment name
    };
    
    setPlacedIcons(prev => {
      const newIcons = [...prev, newIcon];
      console.log('Updated placed icons:', newIcons);
      return newIcons;
    });
  };

  // Handle cable connection start
  const handleCableStart = (clientOffset) => {
    console.log('Cable start called');
    alert('Cable Mode: Click on the first icon you want to connect, then click on the second icon to create a cable connection.');
    setCableMode({ step: 'selectFirst', fromIcon: null });
  };

  // Handle icon click for cable connections
  const handleIconClick = (iconId) => {
    if (!cableMode) return;

    if (cableMode.step === 'selectFirst') {
      console.log('Selected first icon for cable:', iconId);
      setCableMode({ step: 'selectSecond', fromIcon: iconId });
    } else if (cableMode.step === 'selectSecond' && iconId !== cableMode.fromIcon) {
      console.log('Creating cable connection from', cableMode.fromIcon, 'to', iconId);
      
      const fromIcon = placedIcons.find(icon => icon.id === cableMode.fromIcon);
      const toIcon = placedIcons.find(icon => icon.id === iconId);
      
      if (fromIcon && toIcon) {
        const newConnection = {
          id: Date.now(),
          from: cableMode.fromIcon,
          to: iconId,
          fromPos: fromIcon.position,
          toPos: toIcon.position,
          fromName: fromIcon.name,
          toName: toIcon.name
        };
        setConnections(prev => [...prev, newConnection]);
        console.log('Created connection:', newConnection);
      }
      
      setCableMode(null); // Exit cable mode
    }
  };

  // Update icon name
  const updateIconName = (iconId, newName) => {
    setPlacedIcons(prev => prev.map(icon => 
      icon.id === iconId ? { ...icon, name: newName } : icon
    ));
    
    // Update connections that reference this icon
    setConnections(prev => prev.map(conn => ({
      ...conn,
      fromName: conn.from === iconId ? newName : conn.fromName,
      toName: conn.to === iconId ? newName : conn.toName
    })));
  };

  // Save map to database
  const saveMap = async () => {
    if (!mapName.trim() || placedIcons.length === 0) return;
    
    setSaveLoading(true);
    try {
      const mapData = {
        name: mapName.trim(),
        center: mapCenter,
        layer: mapLayer,
        icons: placedIcons,
        connections: connections
      };

      const response = await fetch('/api/maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapData),
      });

      if (response.ok) {
        alert('Map saved successfully!');
        loadSavedMaps(); // Refresh the list
      } else {
        throw new Error('Failed to save map');
      }
    } catch (error) {
      console.error('Error saving map:', error);
      alert('Error saving map. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Load saved maps list
  const loadSavedMaps = async () => {
    try {
      const response = await fetch('/api/maps');
      if (response.ok) {
        const maps = await response.json();
        setSavedMaps(maps);
      }
    } catch (error) {
      console.error('Error loading maps:', error);
    }
  };

  // Load a specific map
  const loadMap = async (mapId) => {
    try {
      const response = await fetch(`/api/maps/${mapId}`);
      if (response.ok) {
        const mapData = await response.json();
        setMapName(mapData.name);
        setMapCenter(mapData.center);
        setMapLayer(mapData.layer);
        setPlacedIcons(mapData.icons);
        setConnections(mapData.connections);
        setSavedMaps([]); // Close the list
        alert(`Loaded map: ${mapData.name}`);
      }
    } catch (error) {
      console.error('Error loading map:', error);
      alert('Error loading map. Please try again.');
    }
  };

  // Delete a map
  const deleteMap = async (mapId) => {
    if (!window.confirm('Are you sure you want to delete this map?')) return;
    
    try {
      const response = await fetch(`/api/maps/${mapId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Map deleted successfully!');
        loadSavedMaps(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting map:', error);
      alert('Error deleting map. Please try again.');
    }
  };

  // Load saved maps on component mount
  React.useEffect(() => {
    loadSavedMaps();
  }, []);

  // Create custom icons for placed markers
  const createCustomIcon = (iconItem) => {
    const { iconType, name, id } = iconItem;
    const isSelected = cableMode?.fromIcon === id;
    const isSelectable = cableMode?.step === 'selectFirst' || (cableMode?.step === 'selectSecond' && cableMode?.fromIcon !== id);
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${iconType.color}; 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 18px; 
          border: 3px solid ${isSelected ? '#FFD700' : isSelectable ? '#FF6B6B' : 'white'}; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: ${isSelectable ? 'pointer' : 'default'};
          ${isSelected ? 'animation: pulse 1s infinite;' : ''}
        ">
          ${iconType.icon}
        </div>
        <div style="
          position: absolute;
          top: 45px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          border: 1px solid #ccc;
        ">
          ${name}
        </div>
      `,
      className: 'custom-icon-with-label',
      iconSize: [40, 65], // Increased height to accommodate label
      iconAnchor: [20, 32],
    });
  };

  // Test function for fallback clicking
  const testPlaceIcon = (iconType) => {
    console.log('Test placing icon:', iconType.name);
    const newIcon = {
      id: Date.now(),
      iconType,
      position: mapCenter, // Place at current map center
      name: `${iconType.name} ${placedIcons.filter(p => p.iconType.id === iconType.id).length + 1}`, // Auto-increment name
    };
    
    setPlacedIcons(prev => {
      const newIcons = [...prev, newIcon];
      console.log('Updated placed icons:', newIcons);
      return newIcons;
    });
  };

  // Make test function available globally for debugging
  React.useEffect(() => {
    window.testIconDrop = testPlaceIcon;
    return () => {
      delete window.testIconDrop;
    };
  }, [mapCenter]);

  const getTileLayerConfig = () => {
    switch (mapLayer) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      case 'street':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
      case 'hybrid':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="map-icons-container">
        <div className="map-header">
          <h1>Infrastructure Map Planning</h1>
          <form onSubmit={handleSearch} className="location-search">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter ZIP code or city name (USA)"
              className="search-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !searchInput.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Map Name and Save/Load Controls */}
          <div className="map-controls-section">
            <div className="map-name-controls">
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Enter map name to save..."
                className="map-name-input"
                disabled={saveLoading}
              />
              <button 
                onClick={saveMap}
                disabled={!mapName.trim() || placedIcons.length === 0 || saveLoading}
                className="save-btn"
              >
                {saveLoading ? 'Saving...' : '💾 Save Map'}
              </button>
              <button 
                onClick={loadSavedMaps}
                className="load-btn"
              >
                📂 Load Maps
              </button>
            </div>
          </div>

          {/* Map Layer Toggle */}
          <div className="map-controls">
            <div className="layer-selector">
              <label>Map View:</label>
              <select 
                value={mapLayer} 
                onChange={(e) => setMapLayer(e.target.value)}
                className="layer-select"
              >
                <option value="satellite">🛰️ Satellite</option>
                <option value="street">🗺️ Street Map</option>
                <option value="hybrid">🔄 Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        <MapDropZone onDrop={handleIconDrop}>
          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '500px', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                {...getTileLayerConfig()}
              />
              
              {/* Add labels overlay for hybrid view */}
              {mapLayer === 'hybrid' && (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  attribution=""
                />
              )}
              
              <MapController center={mapCenter} />
              
              {/* Render connections as polylines */}
              {connections.map((connection) => (
                <Polyline
                  key={connection.id}
                  positions={[connection.fromPos, connection.toPos]}
                  color="#FF6B6B"
                  weight={4}
                  opacity={0.8}
                  dashArray="10, 10"
                >
                  <Popup>
                    <div>
                      <strong>Cable Connection</strong>
                      <br />
                      From: {connection.fromName || 'Unknown'}
                      <br />
                      To: {connection.toName || 'Unknown'}
                      <br />
                      <button
                        onClick={() => setConnections(prev => prev.filter(c => c.id !== connection.id))}
                        style={{ marginTop: '5px', padding: '2px 8px', fontSize: '12px' }}
                      >
                        Remove Cable
                      </button>
                    </div>
                  </Popup>
                </Polyline>
              ))}

              {/* Remove the old temporary cable rendering since we're using a simpler approach */}
              
              {/* Render placed icons as markers */}
              {placedIcons.map((item) => (
                <Marker
                  key={item.id}
                  position={item.position}
                  icon={createCustomIcon(item)}
                  draggable={true}
                  eventHandlers={{
                    click: (e) => {
                      // Prevent popup from opening on left-click
                      e.target.closePopup();
                      
                      // Only handle clicks when in cable mode
                      if (cableMode) {
                        handleIconClick(item.id);
                      }
                    },
                    contextmenu: (e) => {
                      // Right-click - open the popup
                      e.target.openPopup();
                    },
                    dragend: (e) => {
                      const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
                      setPlacedIcons(prev => prev.map(icon => 
                        icon.id === item.id ? { ...icon, position: newPosition } : icon
                      ));
                      
                      // Update any connections that reference this icon
                      setConnections(prev => prev.map(conn => ({
                        ...conn,
                        fromPos: conn.from === item.id ? newPosition : conn.fromPos,
                        toPos: conn.to === item.id ? newPosition : conn.toPos
                      })));
                    },
                  }}
                >
                  <Popup autoClose={false} closeOnClick={false}>
                    <div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                          Name:
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateIconName(item.id, e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '4px 8px', 
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                        <strong>Type:</strong> {item.iconType.name}
                        <br />
                        <strong>Location:</strong> {item.position[0].toFixed(4)}, {item.position[1].toFixed(4)}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                        <button
                          onClick={() => {
                            setCableMode({ step: 'selectFirst', fromIcon: item.id });
                          }}
                          style={{ 
                            width: '100%',
                            padding: '6px 12px', 
                            fontSize: '12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          🔌 Connect!
                        </button>
                        <button
                          onClick={() => setPlacedIcons(prev => prev.filter(p => p.id !== item.id))}
                          style={{ 
                            width: '100%',
                            padding: '6px 12px', 
                            fontSize: '12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove Icon
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </MapDropZone>

        {/* Cable Mode Instructions - moved here between map and icons */}
        {cableMode && (
          <div className="cable-mode-indicator">
            {cableMode.step === 'selectFirst' && (
              <div>
                <h4>🔌 Cable Mode Active</h4>
                <p><strong>Step 1:</strong> Click on the first icon you want to connect (it will glow gold)</p>
              </div>
            )}
            {cableMode.step === 'selectSecond' && (
              <div>
                <h4>🔌 Cable Mode Active</h4>
                <p><strong>Step 2:</strong> Now click on the second icon to complete the connection</p>
              </div>
            )}
            <button onClick={() => setCableMode(null)} className="cancel-cable-btn">
              Cancel Cable Mode
            </button>
          </div>
        )}

        {/* Saved Maps List */}
        {savedMaps.length > 0 && (
          <div className="saved-maps-list">
            <h3>📂 Saved Maps</h3>
            <div className="maps-grid">
              {savedMaps.map((map) => (
                <div key={map.id} className="saved-map-item">
                  <div className="map-info">
                    <h4>{map.name}</h4>
                    <p>{map.icons?.length || 0} icons • {map.connections?.length || 0} connections</p>
                    <small>Saved: {new Date(map.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="map-actions">
                    <button onClick={() => loadMap(map.id)} className="load-map-btn">
                      Load
                    </button>
                    <button onClick={() => deleteMap(map.id)} className="delete-map-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSavedMaps([])} className="close-list-btn">
              Close List
            </button>
          </div>
        )}

        <div className="icon-palette">
          <h3>Infrastructure Icons</h3>
          <p>Drag and drop icons onto the map to place them, or click to place at map center</p>
          
          {/* Cable Mode Button */}
          {placedIcons.length >= 2 && !cableMode && (
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={() => {
                  setCableMode({ step: 'selectFirst', fromIcon: null });
                }}
                style={{
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔌 Start Cable Mode
              </button>
            </div>
          )}
          
          <div className="icons-grid">
            {iconTypes.map((iconType) => {
              const isCableDisabled = iconType.isConnection && placedIcons.length < 2;
              return (
                <DraggableIcon 
                  key={iconType.id} 
                  iconType={iconType} 
                  disabled={isCableDisabled}
                  onCableMode={() => setCableMode({ step: 'selectFirst', fromIcon: null })}
                />
              );
            })}
          </div>
        </div>

        {(placedIcons.length > 0 || connections.length > 0) && (
          <div className="placed-icons-summary">
            <h3>
              Placed Infrastructure ({placedIcons.length} items)
              {connections.length > 0 && ` • ${connections.length} connections`}
            </h3>
            <div className="summary-buttons">
              <button 
                onClick={() => setPlacedIcons([])}
                className="clear-btn"
              >
                Clear Icons
              </button>
              {connections.length > 0 && (
                <button 
                  onClick={() => setConnections([])}
                  className="clear-btn"
                >
                  Clear Cables
                </button>
              )}
              <button 
                onClick={() => {
                  setPlacedIcons([]);
                  setConnections([]);
                  setCableMode(null);
                }}
                className="clear-all-btn"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default MapIcons;