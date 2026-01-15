import { useEffect, useState } from "react";
import api from "../api/axios";
import axios from "axios";
import AuthNavbar from "../components/AuthNavbar";
import "../styles/Dashboard.css";
import "../utils/leafletIconFix";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const AddMarker = ({ setNewPlace }) => {
  useMapEvents({
    click(e) {
      setNewPlace(e.latlng);
    },
  });
  return null;
};

const FlyToLocation = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 6, {
        duration: 1.2,
      });
    }
  }, [center, map]);

  return null;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([20, 78]);
  const [searchError, setSearchError] = useState("");
  const [editingNotes, setEditingNotes] = useState({});
  const [savedNoteId, setSavedNoteId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        fetchPlaces();
        setLoading(false);
      } catch (error) {
        window.location.href = "/";
      }
    };

    checkAuth();
  }, []);

  /* ---------- FETCH USER PLACES ---------- */
  const fetchPlaces = async () => {
    try {
      const res = await api.get("/places/my");
      setPlaces(res.data);
    } catch (error) {
      console.error("Failed to fetch places");
    }
  };

  /* ---------- ADD NEW PLACE ---------- */
  const addPlace = async () => {
    if (!placeName || !newPlace) return;

    try {
      await api.post("/places/add", {
        name: placeName,
        location: {
          type: "Point",
          coordinates: [newPlace.lng, newPlace.lat],
        },
      });

      setPlaceName("");
      setNewPlace(null);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to add place");
    }
  };

  /* ---------- MARK PLACE AS VISITED ---------- */
  const markVisited = async (id) => {
    try {
      await api.put(`/places/${id}/visited`);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to mark visited");
    }
  };

  const searchPlace = async () => {
    if (!searchQuery) return;
    setSearchError(""); // clear old message

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery,
            format: "json",
          },
        }
      );

      if (!res.data || res.data.length === 0) {
        setSearchError("Place not found. Try a different name.");
        return;
      }

      const lat = parseFloat(res.data[0].lat);
      const lng = parseFloat(res.data[0].lon);

      setMapCenter([lat, lng]);
      setNewPlace({ lat, lng });
      setPlaceName(searchQuery);
    } catch (error) {
      setSearchError("Unable to search right now. Please try again.");
    }
  };

  const updateNotes = async (id) => {
    try {
      await api.put(`/places/${id}/notes`, {
        notes: editingNotes[id] || "",
      });

      setSavedNoteId(id);

      // hide message after 1.5s
      setTimeout(() => {
        setSavedNoteId(null);
      }, 1500);

      fetchPlaces();
    } catch (error) {
      console.error("Failed to update notes");
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <>
      <AuthNavbar />

      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Your Travel Map</h2>
          <p>Pin places you want to visit and mark where you’ve been.</p>
        </div>

        {/* MAP WILL GO HERE */}
        <>
          <div className="map-search">
            <input
              type="text"
              placeholder="Search place (e.g. Switzerland)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchPlace}>Search</button>
            {searchError && (
              <div className="map-search-error">{searchError}</div>
            )}
          </div>
          <MapContainer center={mapCenter} zoom={5} className="dashboard-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <FlyToLocation center={mapCenter} />

            {/* Detect clicks on map */}
            <AddMarker setNewPlace={setNewPlace} />

            {/* EXISTING PLACES */}
            {places.map((place) => (
              <Marker
                key={place._id}
                icon={place.status === "visited" ? greenIcon : redIcon}
                position={[
                  place.location.coordinates[1],
                  place.location.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  Status: {place.status}
                  {/* NOTES TEXTAREA */}
                  <textarea
                    className="popup-textarea"
                    placeholder="Add notes..."
                    value={editingNotes[place._id] ?? place.notes ?? ""}
                    onChange={(e) =>
                      setEditingNotes({
                        ...editingNotes,
                        [place._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="popup-btn"
                    onClick={() => updateNotes(place._id)}
                  >
                    Save Notes
                  </button>
                  {savedNoteId === place._id && (
                    <div className="note-saved-msg">Saved ✓</div>
                  )}
                  {place.status === "wishlist" && (
                    <button
                      className="popup-btn"
                      onClick={() => markVisited(place._id)}
                    >
                      Mark Visited
                    </button>
                  )}
                </Popup>
              </Marker>
            ))}

            {/* NEW PLACE PREVIEW */}
            {newPlace && (
              <Marker position={[newPlace.lat, newPlace.lng]}>
                <Popup>
                  <input
                    className="popup-input"
                    placeholder="Place name"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                  />
                  <button className="popup-btn" onClick={addPlace}>
                    Add Place
                  </button>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </>
      </div>
    </>
  );
};

export default Dashboard;
