/* ==========================================================================
   SPATIAL BOOT SEQUENCE ENGINE
   ========================================================================== */
const bootScreen = document.querySelector('#bootScreen');
const site = document.querySelector('#site');
const progressBar = document.querySelector('#progressBar');
const progressText = document.querySelector('#progressText');
const bootStatusText = document.querySelector('#bootStatusText');
let progress = 0;

const spatialLogs = [
  { at: 20, text: "CALIBRATING QUANTUM EMITTERS..." },
  { at: 45, text: "LOCKING SATELLITE: ASTRA-7_GEO" },
  { at: 70, text: "SPHERICAL POLARIZATION: OPTIMAL" },
  { at: 90, text: "PHOTON CONVERGENCE: ENGAGED" },
  { at: 100, text: "HELIOS CORE AWAKE. PROCEED." }
];

const bootTimer = setInterval(() => {
  progress = Math.min(progress + 3.5, 100);
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}% ONLINE`;

  const activeLog = spatialLogs.find(l => l.at >= progress);
  if (activeLog) bootStatusText.textContent = activeLog.text;

  if (progress >= 100) {
    clearInterval(bootTimer);

    site.classList.add('ready');
    bootScreen.classList.add('fade-out');

    setTimeout(() => {
      bootScreen.remove();
      // AUTOMATICALLY OPEN CHATBOT WHEN ENTERING HERO SECTION
      setTimeout(() => {
        openChat();
      }, 1200);
    }, 750);
  }
}, 40);

/* FLOATING LIGHT MOTES */
const particles = document.querySelector('#particles');
for (let i = 0; i < 28; i++) {
  const p = document.createElement('i');
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (10 + Math.random() * 14) + 's';
  p.style.animationDelay = (-Math.random() * 20) + 's';
  const s = 2 + Math.random() * 3.5;
  p.style.width = p.style.height = s + 'px';
  if (i % 3 === 0) {
    p.style.background = 'var(--cyan)';
    p.style.boxShadow = '0 0 12px var(--cyan)';
  }
  particles.appendChild(p);
}

/* LIGHT FIELD CANVAS */
const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');
let W, H, motes = [];
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);
const MOTE_COUNT = Math.min(90, Math.floor(innerWidth / 16));
for (let i = 0; i < MOTE_COUNT; i++) {
  motes.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6 + .4,
    vy: -(Math.random() * .25 + .05),
    vx: (Math.random() - .5) * .15,
    hue: Math.random() > .65 ? 'cyan' : 'blue',
    a: Math.random() * .6 + .2,
    tw: Math.random() * .02 + .005
  });
}
function drawField() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (const m of motes) {
    m.y += m.vy; m.x += m.vx; m.a += m.tw;
    if (m.y < -10) m.y = H + 10;
    if (m.x < -10) m.x = W + 10;
    if (m.x > W + 10) m.x = -10;
    const alpha = (Math.sin(m.a) * .5 + .5) * .7 + .1;
    const color = m.hue === 'cyan' ? `rgba(0,240,255,${alpha})` : `rgba(91,155,255,${alpha * .7})`;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(m.x, m.y, m.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(drawField);
}
drawField();

/* ==========================================================================
   CHATBOT LOGIC WITH AUTO-TRIGGER
   ========================================================================== */
const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/abhijithku10@gmail.com";
const FORM_SUBMIT_AJAX_ENDPOINT = "https://formsubmit.co/ajax/abhijithku10@gmail.com";
const FORM_SUBMIT_ACTIVATION_KEY = "lumen-formsubmit-activation-attempted";
const chatBody = document.getElementById('chatBody');
const chatPanel = document.getElementById('chatPanel');
const chatOptions = document.getElementById('chatOptions');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
let convo = { name: null, age: null, location: null, email: null, grievance: null };
let step = 'greet', started = false;

function addMsg(text, cls = 'bot') {
  const div = document.createElement('div');
  div.className = 'msg ' + cls;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function addSystem(text) {
  const div = document.createElement('div');
  div.className = 'msg system';
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function showTyping(cb, ms = 650) {
  const t = document.createElement('div');
  t.className = 'typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(t);
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => { t.remove(); cb(); }, ms);
}
function botSay(text, delay = 650) {
  showTyping(() => { addMsg(text, 'bot'); }, delay);
}
function setOptions(opts) {
  chatOptions.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.textContent = o.label;
    b.onclick = () => { handleUserInput(o.value ?? o.label); };
    chatOptions.appendChild(b);
  });
}
function clearOptions() { chatOptions.innerHTML = ''; }

function openChat() {
  chatPanel.classList.add('open');
  const badge = document.getElementById('orbBadge');
  if (badge) badge.style.display = 'none';
  if (!started) { started = true; runFlow(); }
}
function closeChat() { chatPanel.classList.remove('open'); }

function runFlow() {
  botSay("Hey. I'm Lumen. I help people who need someone to listen.", 500);
  setTimeout(() => { botSay("What's your name?", 300); step = 'name'; }, 1300);
}

function handleUserInput(raw) {
  const text = (raw || '').trim();
  if (!text) return;
  addMsg(text, 'user');
  chatInput.value = '';
  clearOptions();

  if (step === 'name') {
    convo.name = text;
    botSay(`It's good to meet you, ${firstName(text)}. Can you tell me your age?`);
    step = 'age';
  } else if (step === 'age') {
    convo.age = text;
    botSay("Thank you. Where are you reaching out from — city or region?");
    step = 'location';
  } else if (step === 'location') {
    convo.location = text;
    botSay("And an email address, in case I need to follow up with you?");
    step = 'email';
  } else if (step === 'email') {
    convo.email = text;
    setTimeout(() => { botSay("So... tell me. How can I help you?", 500); step = 'grievance'; }, 300);
  } else if (step === 'grievance') {
    convo.grievance = text;
    botSay("I hear you. Give me a moment — I'm sending this to my console at Astra-7.", 500);
    step = 'confirm';
    setTimeout(sendSignal, 1500);
  } else if (step === 'done') {
    botSay("I've already logged your request — Astra-7 has it. I'll reach out if I need anything else. You're not carrying this alone.");
  }
}

function firstName(full) { return full.split(' ')[0]; }

function sendSignal() {
  addSystem('⚡ SIGNAL TRANSMITTED TO ASTRA-7 ⚡');
  const now = new Date();
  const formData = new FormData();
  formData.append('_subject', 'Someone Needs Your Help!');
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');
  formData.append('_replyto', convo.email);
  formData.append('Name', convo.name);
  formData.append('Age', convo.age);
  formData.append('Location', convo.location);
  formData.append('Email', convo.email);
  formData.append('Submitted', now.toLocaleString());
  formData.append('Grievance / Request', convo.grievance);
  const activationAttempted = localStorage.getItem(FORM_SUBMIT_ACTIVATION_KEY) === 'true';

  showTyping(() => {
    addMsg(`Got it, ${firstName(convo.name)}. Your signal has reached Astra-7's distress network. I'm on it.`, 'bot');
    setTimeout(() => {
      addSystem('Preparing notification email...');
      setTimeout(() => {
        if (!activationAttempted) {
          localStorage.setItem(FORM_SUBMIT_ACTIVATION_KEY, 'true');
          const approvalForm = document.createElement('form');
          approvalForm.method = 'POST';
          approvalForm.action = FORM_SUBMIT_ENDPOINT;
          approvalForm.style.display = 'none';
          for (const [name, value] of formData.entries()) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            approvalForm.appendChild(input);
          }
          document.body.appendChild(approvalForm);
          approvalForm.submit();
          return;
        }

        fetch(FORM_SUBMIT_AJAX_ENDPOINT, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
          .then(response => {
            if (!response.ok) throw new Error('FormSubmit request failed');
            return response.json();
          })
          .then(result => {
            if (!result.success) throw new Error(result.message || 'FormSubmit rejected the request');
            addSystem('Notification email sent successfully.');
          })
          .catch(error => {
            const message = location.protocol === 'file:'
              ? 'Please open this page through a web server before sending.'
              : 'The notification could not be sent. Please try again.';
            console.error('FormSubmit error:', error);
            addSystem(message);
          })
          .finally(() => { step = 'done'; });
      }, 700);
    }, 900);
  }, 900);
}

chatSend.addEventListener('click', () => { handleUserInput(chatInput.value); });
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') { handleUserInput(chatInput.value); } });

/* STORY MODE OBSERVER */
(function () {
  const storyBtn = document.getElementById('storyModeBtn');
  const originSection = document.getElementById('origin');
  const storyBadge = document.getElementById('storyBadge');
  const items = Array.from(document.querySelectorAll('.tl-item'));

  function enterStoryMode() {
    originSection.classList.add('story-mode');
    storyBadge.classList.add('show');
    setTimeout(() => { originSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }

  if (storyBtn) {
    storyBtn.addEventListener('click', e => { e.preventDefault(); enterStoryMode(); });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(it => it.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, { threshold: .5, rootMargin: '-20% 0px -20% 0px' });

  items.forEach(it => io.observe(it));
})();