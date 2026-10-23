import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AnimatePresence, domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const adminUserId = import.meta.env.VITE_ADMIN_USER_ID?.trim();
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
const tableName = 'goal_chart_players';

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1));
}

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9.3" />
      <path d="m9.5 8.4 2.5-1.8 2.5 1.8-.9 3h-3.2l-.9-3Zm-4.8 3.1 4.1-.1m6.4 0 4.1.1m-12 5.9 1.4-5.9m6.6 0 1.4 5.9M9 18.4l3 2 3-2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 16V3m0 0L7 8m5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M9 4h14v6c0 5-3 8-7 8s-7-3-7-8V4Z" fill="currentColor" />
      <path d="M9 7H5v3c0 4 2 6 6 6m12-9h4v3c0 4-2 6-6 6M16 18v6m-6 4h12l-1-4H11l-1 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function BallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <path d="m9.2 8.7 2.8-1 2.8 2.1-1 3.3h-3.6l-1-3.3Zm-3.9 1.2 3.9-1.2m6.4 0 3.3 1.6m-12.4 6 2.2-4.2m8.8 4.2-2.5-4.2m-5.6 5.4 2.3 1.6 2.5-1.6" />
    </svg>
  );
}

function AssistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 15.5c2.5.1 4.1-1.1 5.5-3.3l2.3-3.7 2.1 2.1 2.1-1.2 3.5 3.8v4.1H8.2L4 15.5Z" />
      <path d="m12 8.5 2-3 2.1 1.3-2.2 3.8M8 19.5v1m9-1v1" />
    </svg>
  );
}

const revealItem = {
  hidden: { opacity: 0, y: -14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 460, damping: 22, mass: 0.65 },
  },
};

function ScorerIntro({ player, onContinue, reducedMotion }) {
  return (
    <AnimatePresence>
      {player && (
        <m.div className="scorer-intro" role="dialog" aria-modal="true" aria-labelledby="introTitle"
          initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }}>
          <div className="intro-light intro-light-left" />
          <div className="intro-light intro-light-right" />
          <button className="intro-close" type="button" onClick={onContinue} aria-label="Cancel intro and view chart"><CloseIcon /></button>
          <m.div className="intro-content" initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 20 }}>
            <span className="intro-kicker"><span /> PLAYER OF THE MONTH <span /></span>
            <m.div className="intro-trophy" initial={reducedMotion ? false : { y: -36, rotate: -10, scale: 0.65 }} animate={{ y: 0, rotate: 0, scale: 1 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 12, delay: 0.12 }}>
              <TrophyIcon />
            </m.div>
            <p className="intro-label">Leading scorer</p>
            <h2 id="introTitle">{player.name}</h2>
            <div className="intro-score"><strong>{player.goals}</strong><span>GOALS</span></div>
            <p className="intro-assists"><AssistIcon /> {player.assists} assists this month</p>
            <button className="button intro-continue" type="button" onClick={onContinue}>Continue to chart <span aria-hidden="true">→</span></button>
            <span className="intro-skip-hint">or cancel to view the full chart</span>
          </m.div>
          <div className="intro-field-lines" aria-hidden="true" />
        </m.div>
      )}
    </AnimatePresence>
  );
}

function MilestoneCelebration({ celebration, onClose, reducedMotion }) {
  const particles = useMemo(() => Array.from({ length: 24 }, (_, index) => {
    const angle = (index / 24) * Math.PI * 2;
    const distance = 70 + ((index * 19) % 85);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: index * 53,
      hue: index % 3,
    };
  }), []);

  useEffect(() => {
    if (!celebration) return undefined;
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [celebration, onClose]);

  return (
    <AnimatePresence>
      {celebration && (
        <m.div className="celebration-overlay" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }} onClick={onClose}>
          <m.div className="celebration-card" role="status" aria-live="polite" initial={reducedMotion ? false : { y: 20, scale: 0.92 }} animate={{ y: 0, scale: 1 }} exit={reducedMotion ? undefined : { y: 10, scale: 0.96 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }} onClick={(event) => event.stopPropagation()}>
            {!reducedMotion && <div className="particle-burst" aria-hidden="true">{particles.map((particle, index) => (
              <m.span className={`particle particle-${particle.hue}`} key={index} initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }} animate={{ opacity: [1, 1, 0], x: particle.x, y: particle.y, rotate: particle.rotate, scale: [0.3, 1, 0.2] }} transition={{ duration: 1.05, ease: 'easeOut' }} />
            ))}</div>}
            <button className="icon-close celebration-close" type="button" onClick={onClose} aria-label="Close celebration"><CloseIcon /></button>
            <m.span className="celebration-trophy" animate={reducedMotion ? undefined : { rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }} transition={{ duration: 0.7 }}><TrophyIcon /></m.span>
            <span className="celebration-kicker">MILESTONE UNLOCKED</span>
            <h2>{celebration.playerName}</h2>
            <p><strong>{celebration.milestone}</strong> goals <span>and counting</span></p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey);
  const [players, setPlayers] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState('Connecting');
  const [connectionState, setConnectionState] = useState('');
  const [toast, setToast] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [newPlayer, setNewPlayer] = useState({ name: '', goals: '0', assists: '0' });
  const [introPlayer, setIntroPlayer] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [scanDistance, setScanDistance] = useState(0);
  const loginDialog = useRef(null);
  const shareDialog = useRef(null);
  const tableWrap = useRef(null);
  const toastTimer = useRef(null);
  const introShownMonths = useRef(new Set());
  const reducedMotion = useReducedMotion();
  const monthLabel = useMemo(() => formatMonth(monthKey), [monthKey]);
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name)),
    [players],
  );
  const goalTotal = players.reduce((total, player) => total + player.goals, 0);
  const assistTotal = players.reduce((total, player) => total + player.assists, 0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentMonth = getCurrentMonthKey();
      setMonthKey((previousMonth) => previousMonth === currentMonth ? previousMonth : currentMonth);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setConnection('Setup required');
      setConnectionState('');
      setLoading(false);
      return undefined;
    }

    let active = true;
    setConnection('Syncing');
    setConnectionState('');
    setLoading(true);
    supabase
      .from(tableName)
      .select('id,name,goals,assists')
      .eq('month_key', monthKey)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setConnection('Connection issue');
          setConnectionState('error');
          setToast(`Could not load chart: ${error.message}`);
          setLoading(false);
          return;
        }
        setPlayers((data || []).map((player) => ({
          ...player,
          goals: Number(player.goals) || 0,
          assists: Number(player.assists) || 0,
        })));
        if (!introShownMonths.current.has(monthKey)) {
          introShownMonths.current.add(monthKey);
          const leadingPlayer = [...(data || [])].sort((a, b) => Number(b.goals) - Number(a.goals) || Number(b.assists) - Number(a.assists))[0];
          if (leadingPlayer) {
            setIntroPlayer({
              ...leadingPlayer,
              goals: Number(leadingPlayer.goals) || 0,
              assists: Number(leadingPlayer.assists) || 0,
            });
          }
        }
        setConnection('Live chart');
        setConnectionState('connected');
        setLoading(false);
      });

    return () => { active = false; };
  }, [monthKey, reloadKey]);

  useEffect(() => {
    const node = tableWrap.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => setScanDistance(entry.contentRect.height));
    observer.observe(node);
    return () => observer.disconnect();
  }, [sortedPlayers.length, isAdmin, loading]);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    const applySession = (session) => {
      const user = session?.user;
      setIsAdmin(Boolean(user && adminUserId && user.id === adminUserId));
    };
    supabase.auth.getSession().then(({ data }) => {
      if (active) applySession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) applySession(session);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }

  function refreshPlayers() {
    setReloadKey((key) => key + 1);
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!supabase) {
      setLoginError('Add the Supabase project settings before signing in.');
      return;
    }
    setLoginError('');
    setLoginBusy(true);
    const formData = new FormData(form);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email')).trim(),
      password: String(formData.get('password')),
    });
    setLoginBusy(false);
    if (error) {
      setLoginError('Sign-in failed. Check the account details and try again.');
      return;
    }
    if (!adminUserId || data.user.id !== adminUserId) {
      await supabase.auth.signOut();
      setLoginError('This account is not authorized to manage the chart.');
      return;
    }
    loginDialog.current?.close();
    form.reset();
    showToast('Admin access enabled');
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
    setIsAdmin(false);
    showToast('Signed out');
  }

  async function handleAddPlayer(event) {
    event.preventDefault();
    const name = newPlayer.name.trim();
    const goals = Number(newPlayer.goals);
    const assists = Number(newPlayer.assists);
    if (!name || !Number.isInteger(goals) || goals < 0 || !Number.isInteger(assists) || assists < 0) return;
    if (players.some((player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showToast('That player is already on this month’s chart.');
      return;
    }
    const { error } = await supabase.from(tableName).insert({ name, goals, assists, month_key: monthKey });
    if (error) {
      showToast(`Could not add player: ${error.message}`);
      return;
    }
    setNewPlayer({ name: '', goals: '0', assists: '0' });
    showToast(`${name} added to the chart`);
    if (goals >= 5 && goals % 5 === 0) {
      setCelebration({ playerName: name, milestone: goals, id: Date.now() });
    }
    refreshPlayers();
  }

  async function handleSavePlayer(player) {
    const draft = drafts[player.id] || player;
    const goals = Number(draft.goals);
    const assists = Number(draft.assists);
    if (!Number.isInteger(goals) || goals < 0 || !Number.isInteger(assists) || assists < 0) {
      showToast('Goals and assists must be whole numbers of zero or more.');
      return;
    }
    const { error } = await supabase.from(tableName).update({ goals, assists }).eq('id', player.id).eq('month_key', monthKey);
    if (error) {
      showToast(`Could not save record: ${error.message}`);
      return;
    }
    setDrafts((current) => {
      const next = { ...current };
      delete next[player.id];
      return next;
    });
    showToast('Player record updated');
    const previousMilestone = Math.floor(player.goals / 5);
    const nextMilestone = Math.floor(goals / 5);
    if (nextMilestone > previousMilestone && nextMilestone > 0) {
      setCelebration({ playerName: player.name, milestone: nextMilestone * 5, id: Date.now() });
    }
    refreshPlayers();
  }

  async function handleDeletePlayer(player) {
    if (!window.confirm(`Remove ${player.name} from ${monthLabel}’s chart?`)) return;
    const { error } = await supabase.from(tableName).delete().eq('id', player.id).eq('month_key', monthKey);
    if (error) {
      showToast(`Could not remove player: ${error.message}`);
      return;
    }
    showToast('Player removed');
    refreshPlayers();
  }

  function updateDraft(player, field, value) {
    setDrafts((current) => ({
      ...current,
      [player.id]: { ...player, ...current[player.id], [field]: value },
    }));
  }

  async function handleCapture(mode) {
    shareDialog.current?.close();
    const target = document.getElementById(mode === 'page' ? 'capturePage' : 'chartCapture');
    if (!target) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: '#f4f7f4',
        useCORS: true,
        logging: false,
        scrollY: -window.scrollY,
      });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not create image');
      const file = new File([blob], `goal-chart-${monthKey}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ title: `Goal Chart · ${monthLabel}`, files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Chart image downloaded');
      }
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Could not create the chart image.');
    }
  }

  const leaders = sortedPlayers.slice(0, 3);
  const maxGoals = Math.max(1, ...sortedPlayers.map((player) => player.goals));
  const scanDuration = Math.max(6, sortedPlayers.length * 0.55);

  return (
    <LazyMotion features={domAnimation}>
    <>
    <main className="page-shell" id="capturePage">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><BrandIcon /></span>Goal Chart</div>
        <div className="top-actions">
          <span className={`connection ${connectionState}`}>{connection}</span>
          <button className="button" type="button" onClick={() => shareDialog.current?.showModal()}>
            <ShareIcon /><span>Share</span>
          </button>
          {isAdmin ? (
            <button className="button primary" type="button" onClick={handleSignOut}>Sign out</button>
          ) : (
            <button className="button primary" type="button" onClick={() => {
              setLoginError('');
              loginDialog.current?.showModal();
            }}>Admin login</button>
          )}
        </div>
      </header>

      <section className="hero" aria-labelledby="pageTitle">
        <div>
          <div className="eyebrow"><span />The monthly scoreboard</div>
          <h1 id="pageTitle">Every goal counts.</h1>
          <p className="hero-copy">The season’s moments, kept on the board. Follow the goals, assists, and players making this month theirs.</p>
        </div>
        <div className="month-stamp"><small>Current month</small><strong>{monthLabel}</strong></div>
      </section>

      <m.section className="stats" aria-label="Monthly totals" initial={reducedMotion ? false : 'hidden'} animate={reducedMotion ? undefined : 'show'} variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }}>
        <m.div className="stat" variants={revealItem}><span>Players</span><strong>{loading ? '—' : players.length}</strong></m.div>
        <m.div className="stat" variants={revealItem}><span>Goals scored</span><strong className="accent">{loading ? '—' : goalTotal}</strong></m.div>
        <m.div className="stat" variants={revealItem}><span>Assists made</span><strong>{loading ? '—' : assistTotal}</strong></m.div>
      </m.section>

      <div id="chartCapture">
        <section aria-labelledby="leadersTitle">
          <div className="section-heading"><div><h2 id="leadersTitle">Top three</h2><p>Leading the chart this month</p></div></div>
          <m.div className="podium" initial={reducedMotion ? false : 'hidden'} animate={reducedMotion ? undefined : 'show'} variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.24 } } }}>
            {leaders.length ? leaders.map((player, index) => (
              <m.article className={`podium-card podium-${index + 1}`} key={player.id} variants={reducedMotion ? undefined : revealItem} whileHover={reducedMotion ? undefined : { y: -5, transition: { type: 'spring', stiffness: 360, damping: 18 } }}>
                <div className="podium-rank"><span>{['Top scorer', 'Runner-up', 'Third place'][index]}</span><span className={`medal medal-${index + 1}`}><TrophyIcon /></span></div>
                <div className="podium-name" title={player.name}>{player.name}</div>
                <div className="podium-stats"><span><b>{player.goals}</b> goals</span><span><b>{player.assists}</b> assists</span></div>
              </m.article>
            )) : (
              <div className="empty-state podium-empty">
                <strong>{loading ? 'Loading this month’s chart' : 'No players on the board yet'}</strong>
                {loading ? 'The latest records will appear here.' : 'The monthly chart is ready for its first entry.'}
              </div>
            )}
          </m.div>
        </section>

        <section aria-labelledby="chartTitle">
          <div className="section-heading">
            <div><h2 id="chartTitle">Player chart</h2><p>{isAdmin ? 'Edit goals and assists, then save each record.' : 'Ranked by goals, then assists'}</p></div>
          </div>
          <div className={`table-wrap ${isAdmin ? 'admin-mode' : ''}`} ref={tableWrap}>
            {!reducedMotion && sortedPlayers.length > 0 && (
              <m.div className="telemetry-scan" aria-hidden="true" initial={{ y: -3 }} animate={{ y: scanDistance }} transition={{ duration: scanDuration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }} />
            )}
            <div className="table-head"><span>Rank</span><span>Player</span><span>Goals</span><span>Assists</span>{isAdmin && <span>Update record</span>}</div>
            {sortedPlayers.length ? (
              <m.div className="player-list" initial={reducedMotion ? false : 'hidden'} animate={reducedMotion ? undefined : 'show'} variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.32 } } }}>
              {sortedPlayers.map((player, index) => {
              const draft = drafts[player.id] || player;
              return (
                <m.div className="player-row" key={player.id} variants={reducedMotion ? undefined : revealItem} whileHover={reducedMotion ? undefined : { x: 3 }} style={{ '--scan-delay': `${index * scanDuration / Math.max(1, sortedPlayers.length)}s`, '--scan-duration': `${scanDuration}s` }}>
                  <span className={`rank ${index < 3 ? 'top' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="player-name" title={player.name}>{player.name}</span>
                  <m.div className="goal-cell telemetry-point" whileHover={reducedMotion ? undefined : { scale: 1.045 }} whileTap={reducedMotion ? undefined : { scale: 0.96 }}>
                    <span className="goal-value">{player.goals}</span>
                    <span className="goal-track"><m.span className="goal-fill" initial={reducedMotion ? false : { scaleX: 0 }} animate={{ scaleX: player.goals / maxGoals }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 18, delay: index * 0.055 }} /></span>
                  </m.div>
                  <span className="number-cell">{player.assists}</span>
                  {isAdmin && (
                    <div className="admin-fields">
                      <input type="number" min="0" max="9999" value={draft.goals} aria-label={`${player.name} goals`} onChange={(event) => updateDraft(player, 'goals', event.target.value)} />
                      <input type="number" min="0" max="9999" value={draft.assists} aria-label={`${player.name} assists`} onChange={(event) => updateDraft(player, 'assists', event.target.value)} />
                      <button className="save-row" type="button" title="Save record" aria-label={`Save ${player.name}`} onClick={() => handleSavePlayer(player)}><SaveIcon /></button>
                      <button className="delete-row" type="button" title="Remove player" aria-label={`Remove ${player.name}`} onClick={() => handleDeletePlayer(player)}><DeleteIcon /></button>
                    </div>
                  )}
                </m.div>
              );
              })}
              </m.div>
            ) : (
              <div className="empty-state table-empty">
                <strong>{loading ? 'Syncing records' : 'No records for this month'}</strong>
                {loading ? 'The chart will be ready in a moment.' : 'Check back when the admin adds the first player.'}
              </div>
            )}
          </div>
        </section>
      </div>

      {isAdmin && (
        <section className="admin-panel" aria-labelledby="adminPanelTitle">
          <div className="admin-panel-head"><div><h3 id="adminPanelTitle">Update this month’s chart</h3><p>Records are kept separately for each month.</p></div></div>
          <form className="add-form" onSubmit={handleAddPlayer}>
            <input type="text" maxLength="70" autoComplete="off" placeholder="Player name" aria-label="Player name" required value={newPlayer.name} onChange={(event) => setNewPlayer({ ...newPlayer, name: event.target.value })} />
            <input type="number" min="0" max="9999" aria-label="Goals" value={newPlayer.goals} onChange={(event) => setNewPlayer({ ...newPlayer, goals: event.target.value })} />
            <input type="number" min="0" max="9999" aria-label="Assists" value={newPlayer.assists} onChange={(event) => setNewPlayer({ ...newPlayer, assists: event.target.value })} />
            <button className="button green" type="submit">Add player</button>
          </form>
        </section>
      )}

      {!supabase && (
        <p className="setup-notice">Supabase is not configured yet. Add the project values from <code>.env.example</code> to a local <code>.env</code> file.</p>
      )}

      <footer className="footer"><span>Updated by the chart admin</span><span>Monthly chart · {monthLabel}</span></footer>

      <dialog className="dialog" ref={loginDialog} aria-labelledby="loginTitle">
        <div className="dialog-content">
          <div className="dialog-top"><div><h2 id="loginTitle">Admin login</h2><p>Sign in with the chart administrator account.</p></div><button className="icon-close" type="button" onClick={() => loginDialog.current?.close()} aria-label="Close"><CloseIcon /></button></div>
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="adminEmail">Email</label><input id="adminEmail" name="email" type="email" autoComplete="username" required />
            <label htmlFor="adminPassword">Password</label><input id="adminPassword" name="password" type="password" autoComplete="current-password" required />
            <p className="form-error" role="alert">{loginError}</p>
            <button className="button primary" type="submit" disabled={loginBusy}>{loginBusy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </div>
      </dialog>

      <dialog className="dialog" ref={shareDialog} aria-labelledby="shareTitle">
        <div className="dialog-content">
          <div className="dialog-top"><div><h2 id="shareTitle">Share this month’s chart</h2><p>A quick look at the three players leading the board.</p></div><button className="icon-close" type="button" onClick={() => shareDialog.current?.close()} aria-label="Close"><CloseIcon /></button></div>
          <div className="top-preview">
            {leaders.length ? leaders.map((player, index) => (
              <div className="preview-item" key={player.id}><span><b>{index + 1}.</b> {player.name} <small>· {player.goals} goals</small></span><small>{player.assists} assists</small></div>
            )) : <div className="empty-state preview-empty"><strong>The chart is waiting for its first player</strong></div>}
          </div>
          <div className="share-actions"><button className="button primary" type="button" onClick={() => handleCapture('chart')}>Share chart image</button><button className="button" type="button" onClick={() => handleCapture('page')}>Share full page</button></div>
          <p className="share-note">Your device’s share sheet opens when supported. Otherwise, the image downloads to your device.</p>
        </div>
      </dialog>

      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </main>
    <ScorerIntro player={introPlayer} onContinue={() => setIntroPlayer(null)} reducedMotion={reducedMotion} />
    <MilestoneCelebration celebration={celebration} onClose={() => setCelebration(null)} reducedMotion={reducedMotion} />
    </>
    </LazyMotion>
  );
}