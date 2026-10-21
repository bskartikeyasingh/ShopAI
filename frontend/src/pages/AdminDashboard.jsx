import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/apiClient';

export const AdminDashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [sellersRes, logsRes] = await Promise.all([
        apiFetch('/admin/sellers'),
        apiFetch('/admin/audit-logs')
      ]);
      setSellers(sellersRes || []);
      setLogs(logsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (sellerId, newStatus) => {
    try {
      await apiFetch(`/admin/sellers/${sellerId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      loadAdminData();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Admin Console...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <h1>Platform Administration & Compliance</h1>

      <div style={{ marginTop: '2rem' }}>
        <h2>Vendor Applications & Accounts ({sellers.length})</h2>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '0.8rem', borderBottom: '1px solid #cbd5e1' }}>Store Name</th>
                <th style={{ padding: '0.8rem', borderBottom: '1px solid #cbd5e1' }}>Owner Email</th>
                <th style={{ padding: '0.8rem', borderBottom: '1px solid #cbd5e1' }}>Commission</th>
                <th style={{ padding: '0.8rem', borderBottom: '1px solid #cbd5e1' }}>Current Status</th>
                <th style={{ padding: '0.8rem', borderBottom: '1px solid #cbd5e1' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem' }}><strong>{s.storeName}</strong></td>
                  <td style={{ padding: '0.8rem' }}>{s.userId?.email || 'N/A'}</td>
                  <td style={{ padding: '0.8rem' }}>{(s.commissionRate * 100).toFixed(0)}%</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: 4, background: s.status === 'approved' ? '#dcfce7' : '#fef3c7', color: s.status === 'approved' ? '#166534' : '#854d0e', fontWeight: 600, fontSize: '0.85rem' }}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    {s.status !== 'approved' && (
                      <button onClick={() => handleUpdateStatus(s._id, 'approved')} style={{ padding: '0.3rem 0.6rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Approve
                      </button>
                    )}
                    {s.status !== 'rejected' && s.status !== 'approved' && (
                      <button onClick={() => handleUpdateStatus(s._id, 'rejected')} style={{ padding: '0.3rem 0.6rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Reject
                      </button>
                    )}
                    {s.status === 'approved' && (
                      <button onClick={() => handleUpdateStatus(s._id, 'suspended')} style={{ padding: '0.3rem 0.6rem', background: '#d97706', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Immutable Compliance Audit Trail</h2>
        <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, maxHeight: 300, overflowY: 'auto', padding: '1rem' }}>
          {logs.map((log) => (
            <div key={log._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>[{new Date(log.createdAt).toLocaleTimeString()}]</span>{' '}
              <strong>{log.action}</strong> by {log.actorId?.name || 'System'} (Target: {log.targetType} {log.targetId})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
