'use client';

import { useEffect, useState } from 'react';

type Health = { ok: boolean; name: string; version: string };
type Server = { id: string; name: string; edition: string; software: string; status: string; address: string };
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [h, s] = await Promise.all([
          fetch(`${API}/health`, { cache: 'no-store' }),
          fetch(`${API}/api/servers`, { cache: 'no-store' })
        ]);
        if (!h.ok || !s.ok) throw new Error('API request failed');
        const healthData = await h.json();
        const serverData = await s.json();
        if (active) { setHealth(healthData); setServers(serverData.data); setError(''); }
      } catch {
        if (active) setError('Could not connect to the Bunny API. Start the API on port 4000.');
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">B</span><span>BUNNY <b>HOSTING</b></span></div>
        <p className="nav-label">WORKSPACE</p>
        <a className="nav active" href="/">▦ &nbsp; Overview</a>
        <a className="nav" href="#servers">▣ &nbsp; My Servers</a>
        <a className="nav" href="#servers">＋ &nbsp; Create Server</a>
        <div className="sidebar-bottom">CONTROL PANEL <span>v0.1.0</span></div>
      </aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">CONTROL PANEL</p><h1>Overview</h1></div><div className="profile"><span className="avatar">G</span>Guest account</div></header>
        <section className="welcome"><div><p className="eyebrow">WELCOME TO BUNNY HOSTING</p><h2>Your servers, <em>under control.</em></h2><p className="muted">A new home for managing your Minecraft infrastructure.</p></div><div className="welcome-icon">B</div></section>
        <div className="stats">
          <article className="stat"><span className="muted">TOTAL SERVERS</span><strong>{servers.length}</strong><small>Registered in panel</small></article>
          <article className="stat"><span className="muted">ONLINE SERVERS</span><strong>0</strong><small>Live status integration coming next</small></article>
          <article className="stat"><span className="muted">API STATUS</span><strong className={health?.ok ? 'good' : 'waiting'}>{health?.ok ? 'Online' : '—'}</strong><small>{health?.name ?? 'Waiting for API'}</small></article>
        </div>
        <section id="servers" className="server-section">
          <div className="section-heading"><div><p className="eyebrow">INFRASTRUCTURE</p><h2>Your servers</h2></div><button disabled title="Provisioning will be added in a later milestone">＋ Create server</button></div>
          {error && <div className="notice">{error}</div>}
          <div className="server-list">{servers.map(server => <article className="server" key={server.id}><div className="server-icon">▦</div><div className="server-info"><strong>{server.name}</strong><span>{server.edition} · {server.software} · {server.address}</span></div><span className="status"><i />{server.status}</span></article>)}</div>
        </section>
        <footer>© 2026 Bunny Hosting · Independent project</footer>
      </section>
    </main>
  );
}
