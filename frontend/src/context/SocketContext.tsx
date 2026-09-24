import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  latestAlert: { title: string; message: string; type: string } | null;
  clearLatestAlert: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  latestAlert: null,
  clearLatestAlert: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestAlert, setLatestAlert] = useState<{ title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const orgId = typeof user.organization === 'object' ? user.organization._id : user.organization;
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected as client', socketInstance.id);
      if (orgId) {
        socketInstance.emit('join_org', orgId);
      }
    });

    socketInstance.on('new_issue_reported', (data: any) => {
      console.log('[Socket] New vehicle issue reported:', data);
      setLatestAlert({
        title: `Breakdown Alert: ${data.repair?.vehicle?.vehicleNumber || 'Vehicle'}`,
        message: `${data.repair?.reportedBy?.name || 'Driver'}: ${data.repair?.description || ''}`,
        type: 'repair',
      });
    });

    socketInstance.on('repair_status_updated', (data: any) => {
      console.log('[Socket] Repair ticket updated:', data);
      setLatestAlert({
        title: `Repair Update: ${data.repair?.vehicle?.vehicleNumber || 'Vehicle'}`,
        message: `Status is now: ${data.repair?.status}`,
        type: 'status',
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const clearLatestAlert = () => setLatestAlert(null);

  return (
    <SocketContext.Provider value={{ socket, latestAlert, clearLatestAlert }}>
      {children}
      {latestAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-slate-900 border border-emerald-500/40 text-slate-100 p-4 rounded-xl shadow-2xl shadow-emerald-950/50 flex items-start justify-between gap-3 animate-bounce">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">⚡ Live Fleet Alert</div>
            <div className="font-semibold text-sm mt-0.5">{latestAlert.title}</div>
            <div className="text-xs text-slate-300 mt-1">{latestAlert.message}</div>
          </div>
          <button
            onClick={clearLatestAlert}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
          >
            ✕
          </button>
        </div>
      )}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
