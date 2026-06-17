let selectedKey = 'C';
let accidental = null; // null, 'flat', or 'sharp'
let mode = 'major';
let selectedProg = null;
let customChords = [];
let instrument = 'piano';
let tempo = 80;
let isPlaying = false;
let playTimer = null;
let audioStarted = false;

const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const SCALES = {
  'C':  ['C',  'D',  'E',  'F',  'G',  'A',  'B'],
  'G':  ['G',  'A',  'B',  'C',  'D',  'E',  'F#'],
  'D':  ['D',  'E',  'F#', 'G',  'A',  'B',  'C#'],
  'A':  ['A',  'B',  'C#', 'D',  'E',  'F#', 'G#'],
  'E':  ['E',  'F#', 'G#', 'A',  'B',  'C#', 'D#'],
  'B':  ['B',  'C#', 'D#', 'E',  'F#', 'G#', 'A#'],
  'F#': ['F#', 'G#', 'A#', 'B',  'C#', 'D#', 'E#'],
  'F':  ['F',  'G',  'A',  'Bb', 'C',  'D',  'E'],
  'Bb': ['Bb', 'C',  'D',  'Eb', 'F',  'G',  'A'],
  'Eb': ['Eb', 'F',  'G',  'Ab', 'Bb', 'C',  'D'],
  'Ab': ['Ab', 'Bb', 'C',  'Db', 'Eb', 'F',  'G'],
  'Db': ['Db', 'Eb', 'F',  'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
};

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const MAJOR_QUALITIES = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MINOR_QUALITIES = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];

const MAJOR_ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const MINOR_ROMAN = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

const ENHARMONIC = {
  'Cb': 'B',
  'Db': 'C#',
  'D#': 'Eb',
  'Fb': 'E',
  'Gb': 'F#',
  'G#': 'Ab',
  'A#': 'Bb',
  'B#': 'C',
};

const MAJOR_PROGS = [
  { name: 'I-IV-V-I', degrees: [0, 3, 4, 0] },
  { name: 'I-V-vi-IV', degrees: [0, 4, 5, 3] },
  { name: 'I-IV-vi-V', degrees: [0, 3, 5, 4] },
  { name: 'I-vi-IV-V', degrees: [0, 5, 3, 4] },
  { name: 'I-V-IV-I', degrees: [0, 4, 3, 0] },
  { name: 'I-iii-IV-V', degrees: [0, 2, 3, 4] },
  { name: 'I-IV-I-V-IV-I', degrees: [0, 3, 0, 4, 3, 0] },
  { name: 'ii-V-I', degrees: [1, 4, 0] },
];

const MINOR_PROGS = [
  { name: 'i-iv-v-i', degrees: [0, 3, 4, 0] },
  { name: 'i-VI-III-VII', degrees: [0, 5, 2, 6] },
  { name: 'i-iv-VII-III', degrees: [0, 3, 6, 2] },
  { name: 'i-VI-VII-i', degrees: [0, 5, 6, 0] },
  { name: 'i-v-i', degrees: [0, 4, 0] },
  { name: 'i-III-VI-VII', degrees: [0, 2, 5, 6] },
  { name: 'i-iv-i-v', degrees: [0, 3, 0, 4] },
  { name: 'ii°-V-i', degrees: [1, 4, 0] },
];


function getScale(key, m) {
  const major = SCALES[key] || SCALES['C'];
  let notes;
  if (m === 'major') {
    notes = major;
  } else {
    // Natural minor starts on the 6th degree of the relative major
    const relativeMajor = Object.keys(SCALES).find(k => 
      SCALES[k][5] === key
    ) || key;
    notes = SCALES[relativeMajor] 
      ? [...SCALES[relativeMajor].slice(5), ...SCALES[relativeMajor].slice(0, 5)]
      : major;
  }
  const qualities = m === 'major' ? MAJOR_QUALITIES : MINOR_QUALITIES;
  const romans = m === 'major' ? MAJOR_ROMAN : MINOR_ROMAN;
  return notes.map((note, i) => ({
    note,
    quality: qualities[i],
    roman: romans[i]
  }));
}

function getFullKey(natural, acc) {
  if (acc === 'sharp') return natural + '#';
  if (acc === 'flat') return natural + 'b';
  return natural;
}

function renderKeys() {
  const row = document.getElementById('key-row');
  row.innerHTML = KEYS.map(k => {
    const full = getFullKey(k, accidental);
    return `<button class="${selectedKey === full ? 'active' : ''}" onclick="setKey('${k}')">${k}</button>`;
  }).join('');

const modRow = document.getElementById('modifier-row');
const naturalLetter = selectedKey.charAt(0);
const flatDisabled = naturalLetter === 'F' || naturalLetter === 'C' || accidental === 'sharp';
const sharpDisabled = naturalLetter === 'A' ||naturalLetter === 'B' || naturalLetter === 'D' || naturalLetter === 'E' || naturalLetter === 'G' || accidental === 'flat';

modRow.innerHTML = `
  <button 
    class="${accidental === 'flat' ? 'active' : ''}" 
    onclick="${flatDisabled ? '' : "setAccidental('flat')"}"
    ${flatDisabled ? 'disabled' : ''}>♭</button>
  <button 
    class="${accidental === 'sharp' ? 'active' : ''}" 
    onclick="${sharpDisabled ? '' : "setAccidental('sharp')"}"
    ${sharpDisabled ? 'disabled' : ''}>♯</button>
`;
}

function setKey(k) {
  accidental = null;
  selectedKey = k;
  remapChords();
  renderKeys();
  renderPalette();
  renderDropRow();
  renderPlayback();
}

function setAccidental(type) {
  accidental = accidental === type ? null : type;
  selectedKey = getFullKey(selectedKey.charAt(0), accidental);
  remapChords();
  renderKeys();
  renderPalette();
  renderDropRow();
  renderPlayback();
}

function remapChords() {
  const scale = getScale(selectedKey, mode);
  customChords = customChords.map(c => {
    if (c.degree !== undefined) return { ...scale[c.degree], degree: c.degree };
    return c;
  });
}

function setMode(m) {
  mode = m;
  document.getElementById('btn-major').classList.toggle('active', m === 'major');
  document.getElementById('btn-minor').classList.toggle('active', m === 'minor');
  renderProgressions();
  renderPalette();
  renderPlayback();
}

function renderProgressions() {
  const progs = mode === 'major' ? MAJOR_PROGS : MINOR_PROGS;
  const container = document.getElementById('prog-row');
  container.innerHTML = progs.map((p, i) =>
    `<button class="${selectedProg === i ? 'active' : ''}" onclick="selectProg(${i})">${p.name}</button>`
  ).join('');
}

function selectProg(i) {
  selectedProg = i;
  const progs = mode === 'major' ? MAJOR_PROGS : MINOR_PROGS;
  const scale = getScale(selectedKey, mode);
  customChords = progs[i].degrees.map(d => ({ ...scale[d], degree: d }));
  renderProgressions();
  renderDropRow();
}

function renderPalette() {
  const scale = getScale(selectedKey, mode);
  const container = document.getElementById('palette-row');
  container.innerHTML = scale.map((c, i) =>
    `<button draggable="true" ondragstart="paletteDragStart(event, ${i})" onclick="addChord(${i})">${getChordName(c)} <span class="roman">${c.roman}</span></button>`
  ).join('');
}

function paletteDragStart(event, i) {
  const scale = getScale(selectedKey, mode);
  event.dataTransfer.setData('text', JSON.stringify({ chord: { ...scale[i], degree: i } }));
}

function initDropZone() {
  const drop = document.getElementById('drop-row');
  drop.addEventListener('dragover', e => e.preventDefault());
  drop.addEventListener('drop', e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    const chord = data.chord !== undefined ? data.chord : data;
    const buttons = [...drop.querySelectorAll('button:not(#clear-row button)')];
    const index = buttons.findIndex(b => {
      const box = b.getBoundingClientRect();
      return e.clientX < box.left + box.width / 2;
    });
    if (index === -1) {
      customChords.push(chord);
    } else {
      customChords.splice(index, 0, chord);
    }
    renderDropRow();
  });
}

function renderDropRow() {
  const container = document.getElementById('drop-row');
  if (!customChords.length) { container.innerHTML = ''; return; }
  container.innerHTML = `
    <div id="clear-row">
      <button onclick="clearChords()">Clear all</button>
    </div>
    ${customChords.map((c, i) =>
      `<button draggable="true" 
        ondragstart="dropChordDragStart(event, ${i})"
        ondragover="event.preventDefault()"
        ondrop="dropOnChord(event, ${i})">
        ${getChordName(c)} <span class="roman">${c.roman}</span> <span onclick="removeChord(${i})">×</span>
      </button>`
    ).join('')}
  `;
  checkProgMatch();
  renderPlayback();
}

function clearChords() {
  customChords = [];
  selectedProg = null;
  renderDropRow();
  renderProgressions();
}

function removeChord(i) {
  customChords.splice(i, 1);
  renderDropRow();
}

function addChord(i) {
  const scale = getScale(selectedKey, mode);
  customChords.push({ ...scale[i], degree: i });
  renderDropRow();
}

function checkProgMatch() {
  const progs = mode === 'major' ? MAJOR_PROGS : MINOR_PROGS;
  const scale = getScale(selectedKey, mode);
  selectedProg = progs.findIndex(p =>
    p.degrees.length === customChords.length &&
    p.degrees.every((d, i) => scale[d].note === customChords[i].note)
  );
  renderProgressions();
}

function dropChordDragStart(event, i) {
  event.dataTransfer.setData('text', JSON.stringify({ chord: customChords[i], fromIndex: i }));
}

function dropOnChord(event, targetIndex) {
  event.preventDefault();
  event.stopPropagation();
  const data = JSON.parse(event.dataTransfer.getData('text'));
  if (data.fromIndex !== undefined) {
    const moved = customChords.splice(data.fromIndex, 1)[0];
    customChords.splice(targetIndex, 0, moved);
  } else {
    const chord = data.chord !== undefined ? data.chord : data;
    customChords.splice(targetIndex, 0, chord);
  }
  renderDropRow();
}

function getChordName(c) {
  if (c.quality === 'min') return c.note + 'm';
  if (c.quality === 'dim') return c.note + 'dim';
  if (c.quality === 'aug') return c.note + 'aug';
  return c.note;
}

function renderPlayback() {
  const progs = mode === 'major' ? MAJOR_PROGS : MINOR_PROGS;
  let progName = '';
  
  if (selectedProg !== null && selectedProg !== -1) {
    progName = progs[selectedProg].name;
  } else if (customChords.length > 0) {
    progName = customChords.map(c => c.roman).join('-');
  }

  const infoEl = document.getElementById('playback-info');
  infoEl.innerHTML = `<strong>${selectedKey} ${mode}</strong> ${progName}`;

  const container = document.getElementById('playback-chords');
  container.innerHTML = customChords.map(c =>
    `<button>${getChordName(c)}</button>`
  ).join('');
}

function setInstrument(i) {
  instrument = i;
  document.getElementById('btn-piano').classList.toggle('active', i === 'piano');
  document.getElementById('btn-guitar').classList.toggle('active', i === 'guitar');
}

function setTempo(v) {
  tempo = +v;
  document.getElementById('tempo-display').textContent = v + ' bpm';
}

async function startAudio() {
  if (!audioStarted) {
    await Tone.start();
    audioStarted = true;
  }
}

function getChordFreqs(note, quality, octave = 4) {
  const root = NOTES.indexOf(note);
  let intervals;
  if (quality === 'maj') intervals = [0, 4, 7];
  else if (quality === 'min') intervals = [0, 3, 7];
  else if (quality === 'dim') intervals = [0, 3, 6];
  else if (quality === 'aug') intervals = [0, 4, 8];
  else intervals = [0, 4, 7];
  
  return intervals.map(iv => {
    const ni = (root + iv) % 12;
    const o = octave + (root + iv >= 12 ? 1 : 0);
    return NOTES[ni] + o;
  });
}

function playChord(note, quality) {
  const freqs = getChordFreqs(note, quality);
  
  if (instrument === 'guitar') {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 1.2 },
      volume: -8
    });
    const filter = new Tone.Filter(2200, 'lowpass');
    synth.connect(filter);
    filter.toDestination();
    freqs.forEach((f, i) => {
      setTimeout(() => synth.triggerAttackRelease(f, '2n'), i * 30);
    });
    setTimeout(() => synth.dispose(), 3000);
  } else {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0.3, release: 1.5 },
      volume: -6
    });
    synth.toDestination();
    synth.triggerAttackRelease(freqs, '2n');
    setTimeout(() => synth.dispose(), 3000);
  }
}

async function togglePlay() {
  await startAudio();
  if (isPlaying) {
    stopPlay();
    return;
  }
  if (!customChords.length) return;
  isPlaying = true;
  document.getElementById('play-btn').textContent = '⏹';
  playChords();
}

function playChords() {
  let i = 0;
  const beatMs = (60 / tempo) * 2 * 1000;

  function next() {
    if (!isPlaying || i >= customChords.length) {
      stopPlay();
      return;
    }
    highlightChord(i);
    playChord(customChords[i].note, customChords[i].quality);
    i++;
    playTimer = setTimeout(next, beatMs);
  }
  next();
}

function stopPlay() {
  clearTimeout(playTimer);
  isPlaying = false;
  document.getElementById('play-btn').textContent = '▶';
  highlightChord(-1);
}

function highlightChord(idx) {
  document.querySelectorAll('#playback-chords button').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

setMode('major');
renderKeys();
renderProgressions();
renderPalette();
initDropZone();
renderPlayback();
setInstrument('piano');