// ── Typewriter effect ──────────────────────────────────────────────
const phrases = [
  'whoami',
  'echo "Cloud Platform Engineer"',
  'kubectl get pods --all-namespaces',
  'docker build -t portfolio:latest .',
  'git push origin main',
  'python3 audit_aws.py',
  'trivy image portfolio:latest',
];

let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 38 : 78);
}
type();

// ── Active nav link on scroll ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--accent)' : '';
  });
});

// ── Skill bar animation on scroll ─────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fill').forEach(el => {
  skillObserver.observe(el);
});

// ── Contact form submit ────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn  = document.getElementById('submitBtn');
  const msg  = document.getElementById('formMsg');
  const form = e.target;

  btn.textContent = 'Sending...';
  btn.disabled    = true;
  msg.className   = 'form-msg';
  msg.textContent = '';

  try {
    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    form.name.value,
        email:   form.email.value,
        message: form.message.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      msg.className   = 'form-msg success';
      msg.textContent = '✓ Message sent! I will get back to you soon.';
      form.reset();
    } else {
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (err) {
    msg.className   = 'form-msg error';
    msg.textContent = '✗ ' + err.message;
  } finally {
    btn.textContent = 'Send Message →';
    btn.disabled    = false;
  }
});
