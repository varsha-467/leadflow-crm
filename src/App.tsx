
import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  Search,
  Plus,
  Bell,
  Settings,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  Menu,
} from 'lucide-react';
import './App.css';

type Status = 'New' | 'Contacted' | 'Converted';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  status: Status;
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // FETCH LEADS FROM SUPABASE
  useEffect(() => {
    let ignore = false;

    async function fetchLeads() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (ignore) return;

      if (error) {
        setError(error.message);
      } else {
        setLeads((data ?? []) as Lead[]);
      }

      setLoading(false);
    }

    fetchLeads();

    return () => {
      ignore = true;
    };
  }, []);

  // SEARCH AND FILTER
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' || lead.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  // DASHBOARD STATISTICS
  const newCount = leads.filter((lead) => lead.status === 'New').length;

  const convertedCount = leads.filter(
    (lead) => lead.status === 'Converted'
  ).length;

  // ADD OR EDIT LEAD
  async function saveLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const leadDetails = {
      name: String(form.get('name')).trim(),
      email: String(form.get('email')).trim(),
      phone: String(form.get('phone')).trim(),
      business: String(form.get('business')).trim(),
      status: String(form.get('status')) as Status,
    };

    setSaving(true);
    setError('');

    if (editingLead) {
      const { data, error } = await supabase
        .from('leads')
        .update(leadDetails)
        .eq('id', editingLead.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === editingLead.id ? (data as Lead) : lead
        )
      );
    } else {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadDetails])
        .select()
        .single();

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setLeads((previous) => [data as Lead, ...previous]);
    }

    setSaving(false);
    closeForm();
  }

  // CLOSE FORM
  function closeForm() {
    setShowForm(false);
    setEditingLead(null);
    setError('');
  }

  // DELETE LEAD
  async function deleteLead(id: string) {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    setError('');

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    setLeads((previous) =>
      previous.filter((lead) => lead.id !== id)
    );
  }

  // UPDATE LEAD STATUS
  async function updateStatus(id: string, status: Status) {
    setUpdatingLeadId(id);
    setError('');

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === id ? { ...lead, status } : lead
        )
      );
    }

    setUpdatingLeadId(null);
  }

  // OPEN EDIT FORM
  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setShowForm(true);
    setError('');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">L</div>
          <span>
            LeadFlow<span className="brand-dot">.</span>
          </span>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav>
          <a className="nav-link active" href="#dashboard">
            <LayoutDashboard size={19} /> Dashboard
          </a>

          <a className="nav-link" href="#leads">
            <Users size={19} /> Leads
            <span className="nav-count">{leads.length}</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings">
            <Settings size={19} /> Settings
          </a>

          <div className="profile">
            <div className="avatar">VT</div>
            <div>
              <strong>Varshini T G</strong>
              <span>Administrator</span>
            </div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            Workspace / <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">VT</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Dashboard</h1>
              <p className="subtitle">
                Welcome back! Here's what's happening with your leads.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setEditingLead(null);
                setError('');
                setShowForm(true);
              }}
            >
              <Plus size={18} /> Add new lead
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Leads</span>
                <div className="stat-icon blue">
                  <Users size={20} />
                </div>
              </div>
              <h2>{leads.length}</h2>
              <p><TrendingUp size={14} /> All enquiries</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>New Leads</span>
                <div className="stat-icon orange">
                  <UserPlus size={20} />
                </div>
              </div>
              <h2>{newCount}</h2>
              <p>Awaiting follow-up</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Converted Leads</span>
                <div className="stat-icon green">
                  <UserCheck size={20} />
                </div>
              </div>
              <h2>{convertedCount}</h2>
              <p>Successfully converted</p>
            </div>
          </div>

          <section className="leads-section" id="leads">
            <div className="section-heading">
              <div>
                <h2>All Leads</h2>
                <p>Manage and track your customer enquiries.</p>
              </div>

              <span className="total-badge">
                {filteredLeads.length} leads
              </span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>

            {error && (
              <p className="error-message" role="alert">
                Error: {error}
              </p>
            )}

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>CONTACT</th>
                    <th>BUSINESS</th>
                    <th>PHONE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="contact-cell">
                          <div className="contact-avatar">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{lead.name}</strong>
                            <span>{lead.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>{lead.business}</td>
                      <td>{lead.phone}</td>

                      <td>
                        <select
                          className={`status-select ${lead.status.toLowerCase()}`}
                          value={lead.status}
                          disabled={updatingLeadId === lead.id}
                          onChange={(e) =>
                            updateStatus(
                              lead.id,
                              e.target.value as Status
                            )
                          }
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                        </select>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            aria-label="Edit lead"
                            onClick={() => openEdit(lead)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            aria-label="Delete lead"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <div className="empty-state">
                  <p>Loading leads...</p>
                </div>
              )}

              {!loading && filteredLeads.length === 0 && (
                <div className="empty-state">
                  <Users size={35} />
                  <h3>No leads found</h3>
                  <p>Try changing your search or add a new lead.</p>
                </div>
              )}
            </div>
          </section>

          <footer>© 2026 LeadFlow CRM. Built with care.</footer>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>{editingLead ? 'Edit lead' : 'Add new lead'}</h2>
                <p>Enter the contact information below.</p>
              </div>

              <button onClick={closeForm} aria-label="Close form">
                <X />
              </button>
            </div>

            <form onSubmit={saveLead}>
              <label>Full name</label>
              <input
                name="name"
                defaultValue={editingLead?.name}
                placeholder="Enter full name"
                required
              />

              <label>Email address</label>
              <input
                name="email"
                type="email"
                defaultValue={editingLead?.email}
                placeholder="name@example.com"
                required
              />

              <label>Phone number</label>
              <input
                name="phone"
                type="tel"
                defaultValue={editingLead?.phone}
                placeholder="Enter phone number"
                required
              />

              <label>Business name</label>
              <input
                name="business"
                defaultValue={editingLead?.business}
                placeholder="Enter business name"
                required
              />

              <label>Lead status</label>
              <select
                name="status"
                defaultValue={editingLead?.status ?? 'New'}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingLead
                      ? 'Save changes'
                      : 'Add lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
