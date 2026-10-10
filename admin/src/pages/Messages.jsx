import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Globe, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { getContactMessages, deleteContactMessage, markContactMessageRead } from '@shared/firebase/queries';
import { formatDateTime } from '@shared/utilities/formatters';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { addToast } = useToast();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await markContactMessageRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContactMessage(deleteTarget.id);
      addToast('Message deleted permanently.', 'success');
      if (selectedMessage?.id === deleteTarget.id) {
        setSelectedMessage(null);
      }
      setDeleteTarget(null);
      await loadMessages();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete message', 'error');
    }
  };

  return (
    <AdminLayout title="Contact Inquiries & Messages">
      <div className={`messages-layout ${selectedMessage ? 'has-selected' : ''}`}>
        {/* Messages List Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Inquiries Inbox</div>
              <div className="panel-subtitle">
                Total {messages.length} messages received ({messages.filter((m) => !m.read).length} unread)
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                      Loading messages...
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                      No contact messages received yet.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedMessage?.id === msg.id ? 'rgba(59, 130, 246, 0.08)' : 'transparent'
                      }}
                    >
                      <td>
                        {msg.read ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Read</span>
                        ) : (
                          <span
                            className="badge"
                            style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                          >
                            New
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: msg.read ? 500 : 700 }}>{msg.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{msg.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: msg.read ? 400 : 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.subject || '(No subject)'}
                        </div>
                        <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                          via {msg.source || 'portfolio'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatDateTime(msg.createdAt)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-icon danger"
                          onClick={() => setDeleteTarget(msg)}
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail View */}
        {selectedMessage && (
          <div className="panel-card" style={{ height: 'fit-content' }}>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--text-main)'
                }}>
                  {selectedMessage.name ? selectedMessage.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedMessage.name}</div>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry')}`}
                    style={{ fontSize: '0.825rem', color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-icon danger"
                  onClick={() => setDeleteTarget(selectedMessage)}
                  title="Delete message"
                >
                  <Trash2 size={15} />
                </button>
                <button className="btn-icon" onClick={() => setSelectedMessage(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subject
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  {selectedMessage.subject || '(No subject specified)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Received: {formatDateTime(selectedMessage.createdAt)} via {selectedMessage.source || 'portfolio'}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Message Content
                </div>
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontSize: '0.925rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  color: '#e2e8f0',
                  border: '1px solid var(--border-color)'
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Mail size={16} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
