    /* ===== Loader ===== */
    const textToType = "Daniel.";
    const loaderTextEl = document.getElementById('loaderText');
    const typeDuration = 1300; 
    const typeInterval = typeDuration / textToType.length;
    
    let charIndex = 0;
    const typeWriter = setInterval(() => {
      if (loaderTextEl && charIndex < textToType.length) {
        loaderTextEl.textContent += textToType[charIndex];
        charIndex++;
      } else {
        clearInterval(typeWriter);
      }
    }, typeInterval);

    window.addEventListener('load', () => {
      setTimeout(() => document.getElementById('loader').classList.add('done'), 1500);
    });

    /* ===== Year ===== */
    document.getElementById('yr').textContent = new Date().getFullYear();

    /* ===== Nav scroll state ===== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });

    /* ===== Mobile menu ===== */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open'); nav.classList.remove('open');
      document.body.classList.remove('nav-open');
    }));

    /* ===== Active link on scroll ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = nav.querySelectorAll('a');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));

    /* ===== Reveal on scroll ===== */
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ===== Coffee counter ===== */
    let counted = false;
    const coffeeEl = document.getElementById('coffee');
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting && !counted) {
          counted = true;
          let v = 0; const end = 1000, dur = 1800, t0 = performance.now();
          const step = now => {
            const p = Math.min((now - t0) / dur, 1);
            coffeeEl.textContent = Math.floor(p * end) + (p === 1 ? '+' : '');
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 }).observe(coffeeEl);

    /* ===== Hero portrait tilt ===== */
    const tiltEl = document.querySelector('[data-tilt]');
    if (tiltEl && window.matchMedia('(pointer:fine)').matches) {
      const wrap = tiltEl.parentElement;
      wrap.addEventListener('mousemove', e => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tiltEl.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      });
      wrap.addEventListener('mouseleave', () => { tiltEl.style.transform = ''; });
    }

    /* ===== Project card spotlight ===== */
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* ===== WhatsApp shortcut from hero ===== */
    document.getElementById('waBtn').addEventListener('click', e => {
      e.preventDefault();
      window.open('https://wa.me/96170402982', '_blank');
    });

    /* ===== Contact form (Web3Forms) ===== */
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    const submitBtn = document.getElementById('submitBtn');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = {
      name: { el: document.getElementById('name'), err: document.getElementById('nameErr'), test: v => v.trim().length >= 2, msg: 'At least 2 characters.' },
      email: { el: document.getElementById('email'), err: document.getElementById('emailErr'), test: v => emailRegex.test(v.trim()), msg: 'Enter a valid email.' },
      subject: { el: document.getElementById('subject'), err: document.getElementById('subjectErr'), test: v => v.trim().length >= 3, msg: 'At least 3 characters.' },
      message: { el: document.getElementById('message'), err: document.getElementById('messageErr'), test: v => v.trim().length >= 10, msg: 'At least 10 characters.' }
    };

    Object.values(fields).forEach(f => {
      f.el.addEventListener('input', () => {
        if (f.test(f.el.value)) { f.err.textContent = ''; f.el.style.borderColor = ''; }
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      note.textContent = ''; note.className = 'form-note';
      let valid = true;
      Object.values(fields).forEach(f => {
        if (!f.test(f.el.value)) { f.err.textContent = f.msg; f.el.style.borderColor = 'var(--red)'; valid = false; }
        else { f.err.textContent = ''; f.el.style.borderColor = ''; }
      });
      if (!valid) return;

      submitBtn.style.opacity = '0.6'; submitBtn.style.pointerEvents = 'none';
      submitBtn.querySelector('.btn-text').textContent = 'Sending...';

      try {
        const data = new FormData();
        data.append('access_key', '06b611bb-139f-4cc6-82a8-95f3985e9c27');
        data.append('name', fields.name.el.value.trim());
        data.append('email', fields.email.el.value.trim());
        data.append('subject', fields.subject.el.value.trim());
        data.append('message', fields.message.el.value.trim());
        data.append('from_name', 'Portfolio Contact Form');

        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        const json = await res.json();
        if (json.success) {
          note.textContent = '✓ Message sent — I\'ll get back to you soon.';
          note.className = 'form-note ok';
          form.reset();
        } else { throw new Error(json.message || 'Failed'); }
      } catch (err) {
        note.textContent = '✕ Something went wrong. Try email instead.';
        note.className = 'form-note bad';
      } finally {
        submitBtn.style.opacity = ''; submitBtn.style.pointerEvents = '';
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      }
    });
