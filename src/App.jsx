import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import developerImage from './edited-image.jpg';
import courseData from '../couse.json';
import { 
  Calendar, 
  Search, 
  BookOpen, 
  Layers, 
  X, 
  ShieldCheck, 
  Code2,
  ExternalLink,
  GraduationCap,
  Sun,
  Moon,
  Share2,
  Trash2,
  Check
} from 'lucide-react';

/**
 * SHUT UP AND TAKE COURSE v2.7 FINAL
 * Developer: Abdullah Al Fahim
 * Repository: https://github.com/abdullah-alfahim/Shut-up-and-the-Course-
 */

const DAYS = ['SAT', 'SUN', 'MON', 'TUE', 'WED'];
const SLOTS = [
  { label: '8:30 AM - 10:00 AM', key: 'S1' },
  { label: '10:00 AM - 11:30 AM', key: 'S2' },
  { label: '11:30 AM - 1:00 PM', key: 'S3' },
  { label: 'BREAK', key: 'BR' },
  { label: '1:30 PM - 3:00 PM', key: 'S4' },
  { label: '3:00 PM - 4:30 PM', key: 'S5' }
];

const COLORS = [
  '#E6F1FB:#0C447C', '#EAF3DE:#27500A', '#FAEEDA:#633806', '#FBEAF0:#72243E',
  '#E1F5EE:#085041', '#EEEDFE:#3C3489', '#FAECE7:#712B13', '#F1EFE8:#444441'
];

const DAY_MAP = {
  saturday: 'SAT',
  sunday: 'SUN',
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED'
};

function parseTimeToMinutes(t) {
  const parts = t.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const timeStr = parts[0];
  const ampm = parts[1].toUpperCase();
  const timeParts = timeStr.replace('.', ':').split(':');
  let hours = parseInt(timeParts[0], 10);
  let minutes = parseInt(timeParts[1], 10) || 0;
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function timeRangeToSlots(timeRange) {
  const parts = timeRange.split(/\s*-\s*/);
  if (parts.length < 2) return [];
  const startMin = parseTimeToMinutes(parts[0]);
  const endMin = parseTimeToMinutes(parts[1]);
  
  const standardSlots = [
    { key: 'S1', start: 8*60+30, end: 10*60 },     // 8:30 AM - 10:00 AM
    { key: 'S2', start: 10*60, end: 11*60+30 },    // 10:00 AM - 11:30 AM
    { key: 'S3', start: 11*60+30, end: 13*60 },    // 11:30 AM - 1:00 PM
    { key: 'S4', start: 13*60+30, end: 15*60 },    // 1:30 PM - 3:00 PM
    { key: 'S5', start: 15*60, end: 16*60+30 }     // 3:00 PM - 4:30 PM
  ];
  
  const matched = [];
  for (const slot of standardSlots) {
    if (startMin < slot.end && endMin > slot.start) {
      matched.push(slot.key);
    }
  }
  return matched;
}

const COURSES = {};
const SCH = {};

courseData.batches.forEach((b) => {
  const batchId = b.batch;
  COURSES[batchId] = [];

  const courseSectionsMap = {};

  b.courses.forEach((c) => {
    courseSectionsMap[c.course_code] = new Set();
  });

  Object.keys(DAY_MAP).forEach((jsonDayKey) => {
    const timetableKey = `${jsonDayKey}_timetable`;
    const timetable = b[timetableKey] || [];
    const appDay = DAY_MAP[jsonDayKey];

    timetable.forEach((slotInfo) => {
      const code = slotInfo.course_code;
      const sec = slotInfo.section;
      const timeStr = slotInfo.time;
      const room = slotInfo.room;

      if (!courseSectionsMap[code]) {
        courseSectionsMap[code] = new Set();
      }
      courseSectionsMap[code].add(sec);

      const key = `${code}||${batchId}`;
      if (!SCH[key]) {
        SCH[key] = {};
      }
      if (!SCH[key][sec]) {
        SCH[key][sec] = {};
      }
      if (!SCH[key][sec][appDay]) {
        SCH[key][sec][appDay] = {};
      }

      const slots = timeRangeToSlots(timeStr);
      slots.forEach((slotKey) => {
        SCH[key][sec][appDay][slotKey] = room;
      });
    });
  });

  b.courses.forEach((c) => {
    const code = c.course_code;
    const name = c.course_title;
    const credit = c.credit;
    const sectionsSet = courseSectionsMap[code];
    const sections = sectionsSet ? Array.from(sectionsSet).sort() : [];
    
    COURSES[batchId].push({
      code,
      name,
      credit,
      sections: sections.length > 0 ? sections : ['D1']
    });
  });
});

// Helper slot extraction
function getSlots(code, batch, sec) {
  const key = `${code}||${batch}`;
  const s = SCH[key];
  if (!s || !s[sec]) return [];
  const r = [];
  for (const d of DAYS) {
    if (s[sec][d]) {
      for (const [sl, room] of Object.entries(s[sec][d])) {
        r.push({ day: d, slot: sl, room });
      }
    }
  }
  return r;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gub_routine_theme') || 'light';
  });

  const [selectedBatch, setSelectedBatch] = useState(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#state=')) {
      try {
        const base64 = hash.split('#state=')[1];
        const state = JSON.parse(atob(decodeURIComponent(base64)));
        if (state.batch) return state.batch;
      } catch (e) {
        console.error(e);
      }
    }
    return localStorage.getItem('gub_routine_batch') || '';
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [selected, setSelected] = useState(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#state=')) {
      try {
        const base64 = hash.split('#state=')[1];
        const state = JSON.parse(atob(decodeURIComponent(base64)));
        if (state.selected) return state.selected;
      } catch (e) {
        console.error(e);
      }
    }
    try {
      const saved = localStorage.getItem('gub_routine_selected');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error(e);
      return {};
    }
  });

  const [courseColors, setCourseColors] = useState(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#state=')) {
      try {
        const base64 = hash.split('#state=')[1];
        const state = JSON.parse(atob(decodeURIComponent(base64)));
        if (state.colors) return state.colors;
      } catch (e) {
        console.error(e);
      }
    }
    try {
      const saved = localStorage.getItem('gub_routine_colors');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error(e);
      return {};
    }
  });

  const [hoveredSection, setHoveredSection] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('gub_routine_selected', JSON.stringify(selected));
    localStorage.setItem('gub_routine_colors', JSON.stringify(courseColors));
  }, [selected, courseColors]);

  useEffect(() => {
    localStorage.setItem('gub_routine_theme', theme);
    const root = document.querySelector('.app-shell');
    if (root) {
      if (theme === 'dark') {
        root.classList.add('theme-dark');
        root.classList.remove('theme-light');
      } else {
        root.classList.add('theme-light');
        root.classList.remove('theme-dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gub_routine_batch', selectedBatch);
  }, [selectedBatch]);

  // Clean URL share state on mount
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#state=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const batches = useMemo(() => Object.keys(COURSES).sort((a, b) => b - a), []);

  const coursesList = useMemo(() => {
    if (!selectedBatch) return [];
    let list = COURSES[selectedBatch] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => `${c.code} ${c.name}`.toLowerCase().includes(q));
    }
    return list;
  }, [selectedBatch, searchQuery]);

  const totalCredits = useMemo(() => {
    let t = 0;
    for (const k of Object.keys(selected)) {
      const [code, batch] = k.split('||');
      const c = COURSES[batch]?.find(x => x.code === code);
      if (c) t += c.credit;
    }
    return t;
  }, [selected]);

  const selectedEntries = useMemo(() => Object.entries(selected), [selected]);

  const currentOccupied = useMemo(() => {
    const o = {};
    for (const [k, sec] of Object.entries(selected)) {
      const [code, batch] = k.split('||');
      for (const s of getSlots(code, batch, sec)) {
        o[`${s.day}:${s.slot}`] = true;
      }
    }
    return o;
  }, [selected]);

  const handleSectionToggle = (code, batch, sec) => {
    const k = `${code}||${batch}`;
    if (selected[k] === sec) {
      const newSel = { ...selected };
      const newCol = { ...courseColors };
      delete newSel[k];
      delete newCol[k];
      setSelected(newSel);
      setCourseColors(newCol);
      return;
    }

    const occupied = {};
    for (const [key, val] of Object.entries(selected)) {
      if (key === k) continue;
      const [c, b] = key.split('||');
      for (const s of getSlots(c, b, val)) occupied[`${s.day}:${s.slot}`] = true;
    }

    const slotsToAdd = getSlots(code, batch, sec);
    if (slotsToAdd.some(s => occupied[`${s.day}:${s.slot}`])) return;

    const newSel = { ...selected, [k]: sec };
    const newCol = { ...courseColors };
    if (!newCol[k]) newCol[k] = COLORS[Object.keys(newCol).length % COLORS.length];
    setSelected(newSel);
    setCourseColors(newCol);
  };

  const removeCourse = (k) => {
    const newSel = { ...selected };
    const newCol = { ...courseColors };
    delete newSel[k];
    delete newCol[k];
    setSelected(newSel);
    setCourseColors(newCol);
  };

  const getItemsForSlot = (day, slotKey) => {
    const items = [];
    for (const [k, sec] of Object.entries(selected)) {
      const [code, batch] = k.split('||');
      const slots = getSlots(code, batch, sec);
      const match = slots.find(s => s.day === day && s.slot === slotKey);
      if (match) {
        const [bg, fg] = (courseColors[k] || COLORS[0]).split(':');
        items.push({ key: k, code, sec, room: match.room, bg, fg });
      }
    }
    return items;
  };

  const shareSchedule = () => {
    const hashObj = {
      selected,
      colors: courseColors,
      theme,
      batch: selectedBatch
    };
    const hashString = btoa(JSON.stringify(hashObj));
    const shareUrl = `${window.location.origin}${window.location.pathname}#state=${encodeURIComponent(hashString)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearAllSelected = () => {
    setSelected({});
    setCourseColors({});
    setHoveredSection(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const selectedCount = selectedEntries.length;
  const occupiedCount = Object.keys(currentOccupied).length;

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow--one" />
      <div className="ambient-glow ambient-glow--two" />

      <div className="app-frame">
        <header className="app-header">
          <div className="brand">
            <div className="brand__mark">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="brand__text">
              <div className="brand__kicker">Course planner</div>
              <h1 className="brand__title">Shut Up and Take Course</h1>
              <div className="brand__subtitle">CSE · Summer 2026 · GUB</div>
            </div>
          </div>

          <div className="header-meta">
            <div className="meta-pill">{batches.length} batches</div>
            <div className="meta-pill">{selectedCount} selected</div>
            <div className="meta-pill">{occupiedCount} occupied slots</div>
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <main className="workspace">
          <aside className="panel panel--controls">
            <div className="panel__header">
              <div className="panel__header-row">
                <h2 className="panel__title">
                  <Layers className="w-4 h-4" /> Catalog
                </h2>
                <div className="credit-badge">{totalCredits.toFixed(1)} Credits</div>
              </div>

              {/* Visual Credit Progress bar */}
              <div className="credit-progress-container">
                <div className="credit-progress-label">
                  <span>Semester Progress</span>
                  <span>{totalCredits.toFixed(1)} / 15.0 Cr</span>
                </div>
                <div className="credit-progress-bar">
                  <div 
                    className="credit-progress-fill" 
                    style={{ 
                      width: `${Math.min((totalCredits / 15) * 100, 100)}%`,
                      backgroundImage: totalCredits >= 15 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #3b82f6)'
                    }} 
                  />
                </div>
              </div>

              <div className="field-stack" style={{ marginTop: '0.85rem' }}>
                <select
                  className="field-select"
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSearchQuery('');
                  }}
                >
                  <option value="">Select your batch</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>

                <div className="field-wrap">
                  <Search className="field-icon w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by code or title"
                    className="field"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!selectedBatch}
                  />
                </div>
              </div>
            </div>

            <div className="panel__body">
              <div className="course-list">
                {!selectedBatch ? (
                  <div className="empty-state">
                    <GraduationCap className="empty-state__icon" />
                    <div>
                      <div className="empty-state__title">Choose a batch</div>
                      <div className="empty-state__text">Select a batch above to load available courses.</div>
                    </div>
                  </div>
                ) : coursesList.length === 0 ? (
                  <div className="search-empty">No matches found.</div>
                ) : (
                  coursesList.map((c) => {
                    const k = `${c.code}||${selectedBatch}`;
                    const isSel = !!selected[k];
                    const [bg, fg] = isSel ? (courseColors[k] || COLORS[0]).split(':') : [];

                    return (
                      <article
                        key={c.code}
                        className={`course-card ${isSel ? 'course-card--selected' : ''}`}
                        style={isSel ? { backgroundColor: bg, borderColor: `${fg}40` } : {}}
                      >
                        <div className="course-card__top">
                          <span
                            className={`course-card__code ${isSel ? 'course-card__code--selected' : ''}`}
                            style={isSel ? { color: fg, borderColor: `${fg}20` } : {}}
                          >
                            {c.code}
                          </span>
                          <span className="course-card__credits">{c.credit} Cr</span>
                        </div>

                        <div
                          className={`course-card__title ${isSel ? 'course-card__title--selected' : ''}`}
                          style={isSel ? { color: fg } : {}}
                        >
                          {c.name}
                        </div>

                        <div className="section-row">
                          {c.sections.map((sec) => {
                            const active = selected[k] === sec;
                            const slots = getSlots(c.code, selectedBatch, sec);
                            const conflict = !active && slots.some((s) => currentOccupied[`${s.day}:${s.slot}`]);

                            return (
                              <button
                                key={sec}
                                onMouseEnter={() => setHoveredSection({ code: c.code, batch: selectedBatch, sec })}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => {
                                  handleSectionToggle(c.code, selectedBatch, sec);
                                  setHoveredSection(null);
                                }}
                                disabled={conflict}
                                className={`section-chip ${active ? 'section-chip--active' : ''} ${conflict ? 'section-chip--blocked' : ''}`}
                                style={active ? { backgroundColor: fg, borderColor: fg } : {}}
                              >
                                {sec}
                              </button>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className="schedule-panel">
            <div className="enrollment-card">
              <div className="enrollment-card__header">
                <h3 className="section-kicker">My enrollment</h3>
                {selectedCount > 0 && (
                  <div className="enrollment-actions">
                    <button onClick={shareSchedule} className="enrollment-btn enrollment-btn--share" title="Share Schedule">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Share'}</span>
                    </button>
                    <button onClick={clearAllSelected} className="enrollment-btn enrollment-btn--clear" title="Clear All Selected">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="enrollment-card__body">
                <div className="chip-cloud">
                  {selectedCount === 0 ? (
                    <div className="enrollment-empty">
                      <BookOpen className="w-5 h-5" />
                      Waiting for courses...
                    </div>
                  ) : (
                    selectedEntries.map(([k, sec]) => {
                      const [code] = k.split('||');
                      const [bg, fg] = (courseColors[k] || COLORS[0]).split(':');

                      return (
                        <div key={k} className="enrollment-chip" style={{ backgroundColor: bg, color: fg }}>
                          <span>{code} — {sec}</span>
                          <button onClick={() => removeCourse(k)} className="enrollment-chip__button" aria-label={`Remove ${code} ${sec}`}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="schedule-card">
              <div className="schedule-card__header">
                <h3 className="section-kicker">Weekly timetable</h3>
              </div>
              <div className="schedule-scroll">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      {DAYS.map((d) => (
                        <th key={d}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SLOTS.map((sl) => {
                      if (sl.key === 'BR') {
                        return (
                          <tr key={sl.key} className="schedule-break">
                            <td className="schedule-slot">BREAK</td>
                            {DAYS.map((d) => (
                              <td key={d} />
                            ))}
                          </tr>
                        );
                      }

                      return (
                        <tr key={sl.key}>
                          <td className="schedule-slot">
                            {sl.label.split(' - ').map((t, i) => (
                              <div key={i} className="schedule-slot__line">
                                {t}
                              </div>
                            ))}
                          </td>
                          {DAYS.map((d) => {
                            const items = getItemsForSlot(d, sl.key);

                            // Check if this slot matches the hovered section
                            const hoveredSlots = hoveredSection
                              ? getSlots(hoveredSection.code, hoveredSection.batch, hoveredSection.sec)
                              : [];
                            const isHoveredSlot = hoveredSlots.some(s => s.day === d && s.slot === sl.key);

                            return (
                              <td key={d} className="schedule-cell">
                                {items.map((it) => (
                                  <div
                                    key={it.key}
                                    className="schedule-card-item"
                                    style={{ backgroundColor: it.bg, color: it.fg, borderColor: `${it.fg}20` }}
                                  >
                                    <div className="schedule-card-item__top">
                                      <span className="schedule-card-item__code">{it.code}</span>
                                      <span className="schedule-card-item__section">{it.sec}</span>
                                    </div>
                                    <div className="schedule-card-item__room" style={{ borderColor: `${it.fg}10` }}>
                                      <ShieldCheck className="w-3.5 h-3.5" /> RM: {it.room}
                                    </div>
                                  </div>
                                ))}

                                {isHoveredSlot && (
                                  <div className={`schedule-preview-item ${items.length > 0 ? 'schedule-preview-item--conflict' : ''}`}>
                                    <span className="schedule-preview-item__code">{hoveredSection.code}</span>
                                    <span className="schedule-preview-item__sec">{hoveredSection.sec}</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer-card">
          <div className="profile-wrap">
            <img
              className="profile-avatar"
              src={developerImage}
              alt="Abdullah Al Fahim"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Abdullah+Al+Fahim&background=1a3a6b&color=fff&size=200';
              }}
            />
            <div className="profile-badge">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="profile-body">
            <h4 className="profile-name">Abdullah Al Fahim</h4>
            <div className="profile-meta">
              <span>Blue Team Secretary</span>
              <span>GUCC Cyber Security Society</span>
            </div>
            <div className="profile-links">
              <a
                href="https://github.com/abdullah-alfahim"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <Code2 className="w-5 h-5" />
                GitHub Repository
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          <div className="footer-note">
            <div className="footer-note__label">Engineered with precision</div>
            <div className="footer-note__body">
              Department of CSE
              <br />
              Green University of Bangladesh
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}