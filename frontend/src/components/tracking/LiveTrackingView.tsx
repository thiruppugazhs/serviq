import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Vehicle } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Truck,
  Navigation,
  Compass,
  Gauge,
  User,
  Search,
  Maximize2,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Phone,
  Fuel,
  ArrowRight,
  Activity,
  Layers,
  ChevronRight,
  Radio,
  Eye,
  Crosshair,
  SlidersHorizontal,
} from 'lucide-react';

// Route Corridor definition for realistic live motion
interface RouteWaypoint {
  lat: number;
  lng: number;
}

interface SimulatedVehicleTracking {
  id: string;
  vehicleNumber: string;
  model: string;
  vehicleType: string;
  status: 'on_trip' | 'available' | 'in_shop' | 'out_of_service';
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  speed: number; // km/h
  heading: number; // degrees
  batteryOrFuel: number; // %
  odometer: number;
  progress: number; // 0..1
  currentLat: number;
  currentLng: number;
  routePath: RouteWaypoint[];
  isMoving: boolean;
  eta: string;
}

// Major logistics transit corridors for real tracking visualization
const PRESET_CORRIDORS = [
  {
    origin: 'Chennai Port Hub',
    destination: 'Bengaluru Logistics Park',
    eta: '2 hrs 40 mins',
    waypoints: [
      { lat: 13.0827, lng: 80.2707 },
      { lat: 12.9815, lng: 79.9724 },
      { lat: 12.9165, lng: 79.1325 },
      { lat: 12.8342, lng: 78.7124 },
      { lat: 12.7825, lng: 78.3341 },
      { lat: 12.9716, lng: 77.5946 },
    ],
  },
  {
    origin: 'Mumbai Nhava Sheva',
    destination: 'Pune Chakan Industrial Hub',
    eta: '1 hr 15 mins',
    waypoints: [
      { lat: 18.9515, lng: 72.9514 },
      { lat: 19.033, lng: 73.0297 },
      { lat: 18.7546, lng: 73.3421 },
      { lat: 18.6812, lng: 73.7231 },
      { lat: 18.5204, lng: 73.8567 },
    ],
  },
  {
    origin: 'Hyderabad Ring Road',
    destination: 'Vijayawada Highway',
    eta: '3 hrs 20 mins',
    waypoints: [
      { lat: 17.385, lng: 78.4867 },
      { lat: 17.214, lng: 78.723 },
      { lat: 17.062, lng: 79.281 },
      { lat: 16.892, lng: 80.012 },
      { lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    origin: 'Coimbatore Airport Road',
    destination: 'Salem Bypass',
    eta: '1 hr 45 mins',
    waypoints: [
      { lat: 11.0168, lng: 76.9558 },
      { lat: 11.1085, lng: 77.3411 },
      { lat: 11.341, lng: 77.7172 },
      { lat: 11.6643, lng: 78.146 },
    ],
  },
  {
    origin: 'Delhi Okhla Terminal',
    destination: 'Jaipur Transport Nagar',
    eta: '4 hrs 10 mins',
    waypoints: [
      { lat: 28.5355, lng: 77.2644 },
      { lat: 28.4595, lng: 77.0266 },
      { lat: 28.1812, lng: 76.8123 },
      { lat: 27.553, lng: 76.124 },
      { lat: 26.9124, lng: 75.7873 },
    ],
  },
];

// Helper to interpolate position and angle along polyline based on progress
function interpolateRoute(waypoints: RouteWaypoint[], progress: number): { lat: number; lng: number; heading: number } {
  if (!waypoints || waypoints.length === 0) {
    return { lat: 13.0827, lng: 80.2707, heading: 0 };
  }
  if (waypoints.length === 1) {
    return { lat: waypoints[0].lat, lng: waypoints[0].lng, heading: 0 };
  }

  // Calculate cumulative segment distances
  const distances: number[] = [0];
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dLat = waypoints[i + 1].lat - waypoints[i].lat;
    const dLng = waypoints[i + 1].lng - waypoints[i].lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    totalDistance += dist;
    distances.push(totalDistance);
  }

  const targetDist = progress * totalDistance;

  // Find current segment
  let segIdx = 0;
  for (let i = 0; i < distances.length - 1; i++) {
    if (targetDist >= distances[i] && targetDist <= distances[i + 1]) {
      segIdx = i;
      break;
    }
  }

  const p1 = waypoints[segIdx];
  const p2 = waypoints[segIdx + 1] || waypoints[segIdx];
  const segLength = distances[segIdx + 1] - distances[segIdx];
  const segProgress = segLength > 0 ? (targetDist - distances[segIdx]) / segLength : 0;

  const lat = p1.lat + (p2.lat - p1.lat) * segProgress;
  const lng = p1.lng + (p2.lng - p1.lng) * segProgress;

  // Calculate heading angle
  const dLat = p2.lat - p1.lat;
  const dLng = p2.lng - p1.lng;
  let angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
  if (angle < 0) angle += 360;

  return { lat, lng, heading: angle };
}

export const LiveTrackingView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trackedVehicles, setTrackedVehicles] = useState<SimulatedVehicleTracking[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filterMovingOnly, setFilterMovingOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [autoFollow, setAutoFollow] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'streets' | 'carto'>('streets');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineLayerRef = useRef<L.Polyline | null>(null);
  const routeDecorationsRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // 1. Fetch real vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vehicles');
        if (res.data?.success && Array.isArray(res.data.vehicles)) {
          setVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Failed to load fleet for tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // 2. Initialize tracking data combining real vehicles + realistic routes
  useEffect(() => {
    // If we have database vehicles, map them; otherwise create robust demo fleet
    const sourceVehicles: Partial<Vehicle>[] =
      vehicles.length > 0
        ? vehicles
        : [
            {
              _id: 'v-101',
              vehicleNumber: 'TN-09-CB-4820',
              model: 'BharatBenz 2823R',
              vehicleType: 'Truck',
              status: 'on_trip',
              odometer: 48320,
            },
            {
              _id: 'v-102',
              vehicleNumber: 'KA-01-MJ-6612',
              model: 'Tata Signa 4825.TK',
              vehicleType: 'Hauler',
              status: 'on_trip',
              odometer: 62410,
            },
            {
              _id: 'v-103',
              vehicleNumber: 'MH-04-AZ-9901',
              model: 'Ashok Leyland Ecomet',
              vehicleType: 'Truck',
              status: 'on_trip',
              odometer: 31200,
            },
            {
              _id: 'v-104',
              vehicleNumber: 'AP-16-TX-3389',
              model: 'Mahindra Blazo X 28',
              vehicleType: 'Truck',
              status: 'on_trip',
              odometer: 54190,
            },
            {
              _id: 'v-105',
              vehicleNumber: 'DL-01-HQ-1144',
              model: 'Eicher Pro 3015',
              vehicleType: 'Van',
              status: 'available',
              odometer: 19800,
            },
          ];

    const initialTracked: SimulatedVehicleTracking[] = sourceVehicles.map((veh, idx) => {
      const corridor = PRESET_CORRIDORS[idx % PRESET_CORRIDORS.length];
      const isTrip = veh.status === 'on_trip' || idx < 4; // ensure moving vehicles exist
      const initialProgress = isTrip ? (0.2 + (idx * 0.18)) % 0.85 : 0;
      const { lat, lng, heading } = interpolateRoute(corridor.waypoints, initialProgress);

      const driver = veh.assignedDriver as any;
      const driverName = driver?.user?.name || driver?.name || `Captain ${['Arun Kumar', 'Murugan K.', 'Suresh Babu', 'Venkatesh P.', 'Rajesh M.'][idx % 5]}`;
      const driverPhone = driver?.user?.phone || driver?.phone || '+91 98401 23456';

      return {
        id: veh._id || `v-${idx}`,
        vehicleNumber: veh.vehicleNumber || `TN-09-AB-${1000 + idx}`,
        model: veh.model ? `${veh.manufacturer ? veh.manufacturer + ' ' : ''}${veh.model}` : 'Commercial Heavy Truck',
        vehicleType: veh.vehicleType || 'Truck',
        status: isTrip ? 'on_trip' : (veh.status as any) || 'available',
        driverName,
        driverPhone,
        origin: corridor.origin,
        destination: corridor.destination,
        speed: isTrip ? Math.floor(48 + Math.random() * 20) : 0,
        heading,
        batteryOrFuel: Math.floor(65 + Math.random() * 30),
        odometer: veh.odometer || 42000,
        progress: initialProgress,
        currentLat: lat,
        currentLng: lng,
        routePath: corridor.waypoints,
        isMoving: isTrip,
        eta: corridor.eta,
      };
    });

    setTrackedVehicles(initialTracked);

    // Auto-select first moving vehicle
    const firstMoving = initialTracked.find((v) => v.isMoving);
    if (firstMoving && !selectedVehicleId) {
      setSelectedVehicleId(firstMoving.id);
    }
  }, [vehicles]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center over southern India initially
    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2707],
      zoom: 7,
      zoomControl: false,
    });

    // Clean Tile Layer (OpenStreetMap / Carto)
    const tileUrl =
      mapType === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    routeDecorationsRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if map type changed
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl =
      mapType === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTiles;
  }, [mapType]);

  // 4. Real-time Movement Simulation loop (updates positions every 1.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackedVehicles((prev) =>
        prev.map((veh) => {
          if (!veh.isMoving) return veh;

          // Increment progress slightly
          const stepDelta = 0.0018 + Math.random() * 0.0006;
          let newProgress = veh.progress + stepDelta;
          if (newProgress >= 0.98) newProgress = 0.02; // loop back seamlessly

          const { lat, lng, heading } = interpolateRoute(veh.routePath, newProgress);
          const speedVariation = Math.min(78, Math.max(38, veh.speed + (Math.random() * 4 - 2)));

          return {
            ...veh,
            progress: newProgress,
            currentLat: lat,
            currentLng: lng,
            heading,
            speed: Math.round(speedVariation),
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 5. Update Map Markers and Route Trails
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Filter which vehicles to display
    const visibleVehicles = trackedVehicles.filter((v) => {
      if (filterMovingOnly && !v.isMoving) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          v.vehicleNumber.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.driverName.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Remove markers that are no longer visible
    Object.keys(markersRef.current).forEach((id) => {
      if (!visibleVehicles.some((v) => v.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    visibleVehicles.forEach((veh) => {
      const isSelected = veh.id === selectedVehicleId;

      // Custom HTML Marker with SVG Vehicle & Rotating Heading
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer select-none group" style="width: 44px; height: 44px;">
          ${
            veh.isMoving
              ? `<div class="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></div>`
              : ''
          }
          ${
            isSelected
              ? `<div class="absolute -inset-2.5 rounded-full border-2 border-[#2335f2] bg-blue-500/20 animate-pulse pointer-events-none shadow-lg shadow-blue-500/30"></div>`
              : ''
          }
          
          <!-- Outer Badge Shield -->
          <div class="relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 ${
            isSelected
              ? 'bg-[#2335f2] text-white ring-4 ring-blue-300/60 scale-110 z-30'
              : veh.isMoving
              ? 'bg-[#1e293b] text-white hover:scale-105 z-20 border border-slate-700'
              : 'bg-slate-400 text-white z-10'
          }">
            <div style="transform: rotate(${veh.heading}deg); transition: transform 0.5s ease-out;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            
            ${
              veh.isMoving
                ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>`
                : ''
            }
          </div>

          <!-- Plate Label Pill -->
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold tracking-tight shadow-md border border-white/20 pointer-events-none ${
            isSelected ? 'bg-[#2335f2] border-blue-400' : ''
          }">
            ${veh.vehicleNumber} • ${veh.speed} km/h
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-vehicle-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      if (markersRef.current[veh.id]) {
        // Smoothly slide marker position
        markersRef.current[veh.id].setLatLng([veh.currentLat, veh.currentLng]);
        markersRef.current[veh.id].setIcon(customIcon);
      } else {
        const marker = L.marker([veh.currentLat, veh.currentLng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedVehicleId(veh.id);
        });

        markersRef.current[veh.id] = marker;
      }
    });

    // Draw Route Polyline for Selected Vehicle
    if (routeDecorationsRef.current) {
      routeDecorationsRef.current.clearLayers();
    }

    const selectedVehicle = trackedVehicles.find((v) => v.id === selectedVehicleId);
    if (selectedVehicle && selectedVehicle.routePath.length > 0) {
      const latLngs = selectedVehicle.routePath.map((p) => [p.lat, p.lng] as [number, number]);

      // Outer glow line
      const glowLine = L.polyline(latLngs, {
        color: '#3b82f6',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
      });

      // Core route line
      const activeLine = L.polyline(latLngs, {
        color: '#2335f2',
        weight: 4,
        opacity: 0.9,
        dashArray: '6, 8',
      });

      // Origin Pin (Green)
      const originCoord = latLngs[0];
      const originMarker = L.circleMarker(originCoord, {
        radius: 6,
        fillColor: '#10b981',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).bindTooltip(`Origin: ${selectedVehicle.origin}`, { permanent: false, direction: 'top' });

      // Destination Pin (Red)
      const destCoord = latLngs[latLngs.length - 1];
      const destMarker = L.circleMarker(destCoord, {
        radius: 6,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).bindTooltip(`Destination: ${selectedVehicle.destination}`, { permanent: false, direction: 'top' });

      if (routeDecorationsRef.current) {
        routeDecorationsRef.current.addLayer(glowLine);
        routeDecorationsRef.current.addLayer(activeLine);
        routeDecorationsRef.current.addLayer(originMarker);
        routeDecorationsRef.current.addLayer(destMarker);
      }

      // Auto-follow if enabled or first selected
      if (autoFollow) {
        map.panTo([selectedVehicle.currentLat, selectedVehicle.currentLng], { animate: true });
      }
    }
  }, [trackedVehicles, selectedVehicleId, filterMovingOnly, searchQuery, autoFollow]);

  // Center on Selected Vehicle
  const handleSelectVehicle = (vehId: string) => {
    setSelectedVehicleId(vehId);
    const target = trackedVehicles.find((v) => v.id === vehId);
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.currentLat, target.currentLng], 14, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Fit all moving vehicles in view
  const handleFitAllMoving = () => {
    const moving = trackedVehicles.filter((v) => v.isMoving);
    if (moving.length === 0 || !mapInstanceRef.current) return;

    const bounds = L.latLngBounds(moving.map((v) => [v.currentLat, v.currentLng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  };

  const selectedVehicle = useMemo(
    () => trackedVehicles.find((v) => v.id === selectedVehicleId) || null,
    [trackedVehicles, selectedVehicleId]
  );

  const movingCount = trackedVehicles.filter((v) => v.isMoving).length;
  const idleCount = trackedVehicles.filter((v) => !v.isMoving).length;

  const filteredVehiclesList = trackedVehicles.filter((v) => {
    if (filterMovingOnly && !v.isMoving) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.vehicleNumber.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="relative flex flex-col h-[calc(100vh-5rem)] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* =========================================================================
          TOP COMMAND BAR
      ========================================================================= */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2335f2] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Live Fleet GPS Tracking
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sat-Link Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time transit telemetry across active logistics corridors
            </p>
          </div>
        </div>

        {/* Global Controls & View Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterMovingOnly(!filterMovingOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              filterMovingOnly
                ? 'bg-[#2335f2] text-white border-blue-500 shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Moving Vehicles ({movingCount})
          </button>

          <button
            onClick={handleFitAllMoving}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Fit all active moving vehicles in map screen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            Fit All Moving
          </button>

          <button
            onClick={() => setAutoFollow(!autoFollow)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              autoFollow
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Keep map centered on selected vehicle as it moves"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            Auto-Follow
          </button>

          <button
            onClick={() => setMapType(mapType === 'streets' ? 'carto' : 'streets')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Toggle Map Tile Style"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            {mapType === 'streets' ? 'Clean Carto' : 'OpenStreet'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN MAP + OVERLAY FLEET SELECTOR SIDEBAR
      ========================================================================= */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-bleed Leaflet Map */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Left Vehicle Selection Panel */}
        <div className="absolute top-4 left-4 bottom-4 w-80 sm:w-88 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-20 pointer-events-auto overflow-hidden">
          {/* Panel Header & Search */}
          <div className="p-3.5 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Fleet Roster ({filteredVehiclesList.length})
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {movingCount} moving • {idleCount} parked
              </span>
            </div>

            {/* Quick Filter Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search plate, model, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 space-y-1">
            {filteredVehiclesList.map((veh) => {
              const isSelected = veh.id === selectedVehicleId;

              return (
                <div
                  key={veh.id}
                  onClick={() => handleSelectVehicle(veh.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#2335f2]/20 border border-blue-500/50 shadow-md shadow-blue-500/10'
                      : 'hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                          {veh.vehicleNumber}
                        </span>
                        {veh.isMoving ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {veh.speed} km/h
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400">Parked</span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-300 mt-1 truncate max-w-[190px]">
                        {veh.model}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                        <Fuel className="w-3 h-3 text-amber-400" />
                        {veh.batteryOrFuel}%
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                        {(veh.odometer + Math.round(veh.progress * 250)).toLocaleString()} km
                      </span>
                    </div>
                  </div>

                  {/* Route & Driver Details */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      {veh.driverName}
                    </span>
                    <span className="truncate max-w-[110px] text-slate-400">
                      ➔ {veh.destination.split(' ')[0]}
                    </span>
                  </div>

                  {/* Transit progress bar */}
                  {veh.isMoving && (
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(veh.progress * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredVehiclesList.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No vehicles matching current filter or search.
              </div>
            )}
          </div>
        </div>

        {/* Selected Vehicle Telemetry Card (Bottom Floating Inspector) */}
        {selectedVehicle && (
          <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-[460px] bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-2xl z-20 pointer-events-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2335f2] text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25 shrink-0">
                  <Truck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-mono text-white">
                      {selectedVehicle.vehicleNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        selectedVehicle.isMoving
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {selectedVehicle.isMoving ? 'ACTIVE TRANSIT' : 'IDLE / PARKED'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    {selectedVehicle.model} • {selectedVehicle.vehicleType}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black font-mono text-white flex items-center justify-end gap-1">
                  <Gauge className="w-4 h-4 text-blue-400" />
                  {selectedVehicle.speed} <span className="text-xs text-slate-400">km/h</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Heading {Math.round(selectedVehicle.heading)}°
                </div>
              </div>
            </div>

            {/* Corridor Origin & Destination */}
            <div className="py-2.5 grid grid-cols-2 gap-2 text-xs border-b border-slate-800/80">
              <div className="bg-slate-800/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Dispatched From</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">
                  {selectedVehicle.origin}
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Destination Hub</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">
                  {selectedVehicle.destination}
                </span>
              </div>
            </div>

            {/* Driver & Telemetry Details */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                  {selectedVehicle.driverName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{selectedVehicle.driverName}</div>
                  <a
                    href={`tel:${selectedVehicle.driverPhone}`}
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    {selectedVehicle.driverPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectVehicle(selectedVehicle.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                  Focus
                </button>
                <Link
                  to="/admin/vehicles"
                  className="px-3 py-1.5 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1"
                >
                  Vehicle Profile
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
