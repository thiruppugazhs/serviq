/**
 * Formatting and utility helpers for SERVIQ Driver Mobile App
 */

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    if (options.short) {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return 'N/A';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  } catch (e) {
    return 'N/A';
  }
};

export const formatKm = (km) => {
  if (km === null || km === undefined || isNaN(km)) return '0 km';
  return `${Number(km).toLocaleString('en-IN')} km`;
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getStatusColor = (status) => {
  const norm = (status || '').toLowerCase().replace(/[\s_-]+/g, '');
  switch (norm) {
    case 'active':
    case 'available':
    case 'good':
    case 'normal':
    case 'valid':
    case 'completed':
    case 'up_to_date':
    case 'uptodate':
      return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };

    case 'inshop':
    case 'in_shop':
    case 'inprogress':
    case 'in_progress':
    case 'reviewed':
    case 'approved':
    case 'due_soon':
    case 'duesoon':
    case 'expiring_soon':
    case 'expiringsoon':
    case 'attention':
    case 'warning':
    case 'medium':
      return { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' };

    case 'outofservice':
    case 'out_of_service':
    case 'overdue':
    case 'expired':
    case 'critical':
    case 'high':
    case 'rejected':
    case 'inactive':
      return { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' };

    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
  }
};
