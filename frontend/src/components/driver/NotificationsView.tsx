import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService, DriverNotification } from '../../services/driverService';
import { ArrowLeft, Bell, Wrench, FileText, Users, Check } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<DriverNotification[]>(driverService.getNotifications());
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    driverService.markNotificationAsRead(id);
    setNotifications(driverService.getNotifications());
  };

  const handleMarkAll = () => {
    driverService.markAllNotificationsAsRead();
    setNotifications(driverService.getNotifications());
  };

  const getIconInfo = (type: DriverNotification['type']) => {
    switch (type) {
      case 'maintenance':
        return { icon: Bell, bg: 'bg-red-500', text: 'text-white' };
      case 'service':
        return { icon: Wrench, bg: 'bg-[#1b72e8]', text: 'text-white' };
      case 'expense':
        return { icon: FileText, bg: 'bg-emerald-600', text: 'text-white' };
      case 'reminder':
        return { icon: Bell, bg: 'bg-amber-500', text: 'text-white' };
      case 'team':
        return { icon: Users, bg: 'bg-purple-600', text: 'text-white' };
      default:
        return { icon: Bell, bg: 'bg-blue-500', text: 'text-white' };
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-[11px] font-semibold text-[#1b72e8] hover:underline"
            >
              Mark all read
            </button>
          )}
          <div className="relative p-1.5 text-slate-700">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => {
          const { icon: Icon, bg, text } = getIconInfo(item.type);

          return (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id)}
              className={`bg-white rounded-2xl border p-3.5 shadow-2xs flex items-start gap-3 transition cursor-pointer ${
                item.read ? 'border-slate-100 opacity-90' : 'border-blue-100 bg-blue-50/20'
              }`}
            >
              <div className={`w-9 h-9 rounded-full ${bg} ${text} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                <Icon className="w-4 h-4 stroke-[2.2px]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.description}</p>
              </div>

              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-[#1b72e8] shrink-0 self-center" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
