'use client';

import { useEffect, useMemo, useState } from 'react';

type Health = { ok: boolean; name: string; version: string };
type Server = { id: string; name: string; edition: string; software: string; status: string; address: string };

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const navItems = [
  { label: 'Overview', icon: '◫', group: 'WORKSPACE' },
  { label: 'Servers', icon: '▣', group: 'WORKSPACE' },
  { label: 'Create server', icon: '＋', group: 'WORKSPACE' },
  { label: 'Nodes', icon: '⌘', group: 'INFRASTRUCTURE' },
  { label: 'Backups', icon: '◷', group: 'INFRASTRUCTURE' },
  { label: 'Users', icon: '♙', group: 'MANAGEMENT' },
  { label: 'Settings', icon: '⚙', group: 'MANAGEMENT' }
];

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [apiError, setApiError] = useState(false);
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [showNotice, setShowNotice] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    let activeRequest = true;
    async function load() {
      try {
        const [h, s] = await Promise.all([
          fetch(\`\${API}/health\`, { cache: 'no-store' }),
          fetch(\`\${API}/api/servers\`, { cache: 'no-store' })
        ]);
        if (!h.ok || !s.ok) throw new Error('API unavailable');
        const healthData = await h.json();
        const serverData = await s.json();
        if (activeRequest) {
          setHealth(healthData);
          setServers(Array.isArray(serverData.data) ? serverData.data : []);
          setApiError(false);
        }
      } catch {
        if (activeRequest) setApiError(true);
      }
    }
    void load();
    return () => { activeRequest = false; };
  }, []);

  const filteredServers = useMemo(
    () => servers.filter((server) => server.name.toLowerCase().includes(query.toLowerCase())),
    [servers, query]
  );

  function selectNav(label: string) {
    setActive(label);
    setMobileNav(false);
    if (label === 'Create server') setShowNotice(true);
  }

  const isOverview = active === 'Overview';

  return (
    <main className="app-shell">
      <aside className={mobileNav ? 'sidebar sidebar-open' : 'sidebar'}>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); selectNav('Overview'); }}>
          <span className="brand-symbol"><span> b </span></span>
          <span className="brand-copy">bunny<span>hosting</span><small>CONTROL CENTER</small></span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">K</div>
          <div className="workspace-meta"><strong>Khargosh's workspace</strong><span>Personal workspace</span></div>
          <span className="switch-chevron">⌄</span>
        </div>

        {['WORKSPACE', 'INFRASTRUCTURE', 'MANAGEMENT'].map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-heading">{group}</p>
            {navItems.filter((item) => item.group === group).map((item) => (
              <button
                key={item.label}
                className={active === item.label ? 'nav-link nav-active' : 'nav-link'}
                onClick={() => selectNav(item.label)}
              >
                <Icon>{item.icon}</Icon><span>{item.label}</span>
                {item.label === 'Nodes' && <span className="nav-count">0</span>}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-spacer" />
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>Need a hand?</strong>
          <p>Get help setting up your first game server.</p>
          <a href="https://github.com/khargosh-area/bunnyhosting-" target="_blank" rel="noreferrer">View project docs <span>↗</span></a>
        </div>
        <div className="sidebar-footer"><span className="live-dot" /> Preview environment <span className="version">v0.2.0</span></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">☰</button>
            <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className={health?.ok ? 'connection-pill connected' : 'connection-pill'}>
              <span className="connection-dot" />{health?.ok ? 'API connected' : 'API disconnected'}
            </div>
            <button className="icon-button" aria-label="Notifications" onClick={() => setShowNotice(true)}>♧<i /></button>
            <div className="top-avatar">K</div>
          </div>
        </header>

        <div className="page-content">
          {isOverview ? (
            <>
              <div className="page-heading">
                <div><div className="date-label">YOUR GAME SERVER COMMAND CENTER</div><h1>Good to see you<span className="heading-period">.</span></h1><p>Here’s what’s happening with your infrastructure.</p></div>
                <button className="primary-button" onClick={() => setShowNotice(true)}><span>＋</span> Create a server</button>
              </div>

              <section className="hero-banner">
                <div className="hero-glow" />
                <div className="hero-content">
                  <div className="hero-kicker"><span className="sparkle">✳</span> BUILT FOR YOUR NEXT ADVENTURE</div>
                  <h2>Your world.<br /><em>Your rules.</em></h2>
                  <p>One clean place to launch, manage and grow your Minecraft servers.</p>
                  <button className="hero-button" onClick={() => selectNav('Servers')}>Explore servers <span>→</span></button>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                  <div className="cube cube-back" /><div className="cube cube-front"><span> b </span></div>
                  <div className="floating-pixel pixel-one" /><div className="floating-pixel pixel-two" /><div className="floating-pixel pixel-three" />
                </div>
                <div className="hero-index">01 <span>/</span> 03</div>
              </section>

              <div className="section-title-row">
                <div><h2>Overview</h2><p>A quick look at your hosting environment.</p></div>
                <div className="range-label"><span className="range-dot" /> Live snapshot</div>
              </div>

              <section className="stats-grid">
                <article className="metric-card">
                  <div className="metric-top"><span>Total servers</span><span className="metric-icon violet">▣</span></div>
                  <div className="metric-value">{servers.length.toString().padStart(2, '0')}<small> / —</small></div>
                  <div className="metric-foot"><span className="metric-muted">Registered servers</span><span className="metric-tag">PANEL DATA</span></div>
                  <div className="metric-line"><i style={{ width: servers.length ? '18%' : '0%' }} /></div>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Online servers</span><span className="metric-icon green">⌁</span></div>
                  <div className="metric-value">00</div>
                  <div className="metric-foot"><span className="metric-muted">Waiting for node connection</span><span className="metric-tag">LIVE STATUS</span></div>
                  <div className="metric-line green-line"><i style={{ width: '0%' }} /></div>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Nodes connected</span><span className="metric-icon amber">⌘</span></div>
                  <div className="metric-value">00</div>
                  <div className="metric-foot"><span className="metric-muted">No compute nodes yet</span><span className="metric-tag">INFRASTRUCTURE</span></div>
                  <div className="metric-line amber-line"><i style={{ width: '0%' }} /></div>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>API status</span><span className="metric-icon blue">⌘</span></div>
                  <div className={health?.ok ? 'metric-value metric-online' : 'metric-value metric-waiting'}>{health?.ok ? 'Ready' : 'Offline'}</div>
                  <div className="metric-foot"><span className="metric-muted">{health?.ok ? health.version : 'Start the API to connect'}</span><span className="metric-tag">SYSTEM</span></div>
                  <div className="metric-line blue-line"><i style={{ width: health?.ok ? '100%' : '0%' }} /></div>
                </article>
              </section>

              <section className="lower-grid">
                <div className="panel-card servers-card">
                  <div className="card-heading"><div><h3>Your servers</h3><p>Manage your Minecraft instances.</p></div><button className="text-button" onClick={() => selectNav('Servers')}>View all <span>→</span></button></div>
                  {apiError && <div className="inline-alert">API is not reachable. Showing no live server data.</div>}
                  {servers.length > 0 ? (
                    <div className="server-table">
                      <div className="table-head"><span>SERVER</span><span>SOFTWARE</span><span>STATUS</span><span>ADDRESS</span></div>
                      {filteredServers.map((server) => (
                        <div className="server-row" key={server.id}>
                          <div className="server-name-cell"><div className="server-cube">▦</div><div><strong>{server.name}</strong><small>{server.edition} Edition</small></div></div>
                          <span className="software-label">{server.software}</span>
                          <span className="status-label"><i className={server.status === 'online' ? 'status-dot online' : 'status-dot'} />{server.status}</span>
                          <span className="server-address">{server.address}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-illustration"><span className="empty-cube">▦</span><i /><i /><i /></div>
                      <strong>Your first server starts here</strong>
                      <p>Connect a node to start creating Java or Bedrock servers.</p>
                      <button className="secondary-button" onClick={() => selectNav('Nodes')}>Set up a node <span>→</span></button>
                    </div>
                  )}
                </div>

                <div className="panel-card activity-card">
                  <div className="card-heading"><div><h3>Getting started</h3><p>Your launch checklist.</p></div><span className="check-count">0 / 4</span></div>
                  <div className="checklist">
                    <div className="check-item"><span className="check-circle done">✓</span><div><strong>Panel workspace created</strong><small>Your Bunny Hosting dashboard is ready.</small></div></div>
                    <div className="check-item"><span className="check-circle">2</span><div><strong>Connect your first node</strong><small>Prepare a VPS and install the node agent.</small></div></div>
                    <div className="check-item"><span className="check-circle">3</span><div><strong>Configure server limits</strong><small>Set memory, CPU and disk allocations.</small></div></div>
                    <div className="check-item"><span className="check-circle">4</span><div><strong>Launch your first server</strong><small>Choose Java or Bedrock and go live.</small></div></div>
                  </div>
                  <div className="checklist-progress"><span /><span /><span /><span /></div>
                </div>
              </section>

              <section className="bottom-note"><div className="note-mark">✳</div><div><strong>You're viewing the Bunny Hosting preview</strong><p>Server provisioning, billing and node controls will activate after the secure infrastructure is connected.</p></div><span className="preview-label">DEVELOPMENT MODE</span></section>
            </>
          ) : (
            <section className="subpage">
              <div className="date-label">BUNNY HOSTING / WORKSPACE</div>
              <h1>{active}<span className="heading-period">.</span></h1>
              <p className="subpage-description">{active === 'Servers' ? 'Browse and manage your Minecraft server instances.' : active === 'Nodes' ? 'Connect the machines that power your game servers.' : active === 'Backups' ? 'Protect your worlds with scheduled backups.' : active === 'Users' ? 'Manage workspace members and access.' : active === 'Settings' ? 'Configure your Bunny Hosting workspace.' : 'Create and configure a new Minecraft server.'}</p>
              <div className="coming-card"><div className="coming-icon">{active === 'Nodes' ? '⌘' : active === 'Backups' ? '◷' : active === 'Users' ? '♙' : active === 'Settings' ? '⚙' : '▣'}</div><span className="coming-badge">NEXT MILESTONE</span><h2>{active === 'Nodes' ? 'Your infrastructure starts here.' : active === 'Servers' ? 'Your servers will live here.' : active === 'Backups' ? 'Keep every world safe.' : active === 'Users' ? 'Your team, in one place.' : active === 'Settings' ? 'Make this workspace yours.' : 'Ready to build a new world?'}</h2><p>{active === 'Nodes' ? 'The node agent and secure registration flow will be added after the VPS is ready.' : 'This section is part of the panel roadmap. We will connect it to real backend services before enabling actions.'}</p><div className="coming-meta"><span className="live-dot" /> Not connected yet</div></div>
              {active === 'Servers' && servers.length > 0 && <div className="panel-card server-list-sub"><div className="card-heading"><div><h3>Registered servers</h3><p>Data returned by the Bunny API.</p></div><span className="check-count">{servers.length} total</span></div>{servers.map((server) => <div className="server-row" key={server.id}><div className="server-name-cell"><div className="server-cube">▦</div><div><strong>{server.name}</strong><small>{server.edition} Edition</small></div></div><span className="software-label">{server.software}</span><span className="status-label"><i className="status-dot" />{server.status}</span><span className="server-address">{server.address}</span></div>)}</div>}
            </section>
          )}

          <footer className="page-footer"><span>© 2026 Bunny Hosting. Built for your worlds.</span><span><i className="live-dot" /> Independent project <b>·</b> v0.2.0</span></footer>
        </div>
      </section>

      {showNotice && <div className="modal-backdrop" role="presentation" onClick={() => setShowNotice(false)}><div className="notice-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowNotice(false)} aria-label="Close">×</button><div className="modal-symbol">⌘</div><div className="coming-badge">INFRASTRUCTURE REQUIRED</div><h2 id="notice-title">Almost ready to launch.</h2><p>Server creation will be enabled after a VPS is connected and the Bunny node agent has been installed and secured. No server will be created from this preview.</p><button className="primary-button modal-action" onClick={() => { setShowNotice(false); selectNav('Nodes'); }}>View node setup <span>→</span></button></div></div>}
    </main>
  );
}
