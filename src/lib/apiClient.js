export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function statusToVariant(status) {
  const normalized = status?.toLowerCase();
  if (normalized === 'available' || normalized === 'valid') return 'success';
  if (normalized === 'expiring soon' || normalized === 'renew soon' || normalized === 'review') {
    return 'warning';
  }
  if (normalized === 'expired' || normalized === 'pending') return 'danger';
  return 'info';
}
