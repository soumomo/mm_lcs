// Theme & Scroll Progress manager for academic paper design
(function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);

    window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleButtons(next);
    };

    function updateToggleButtons(theme) {
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.innerHTML = theme === 'dark' ? '☀ Light' : '☽ Dark';
        });
    }

    // Scroll Progress & Line-by-Line Percentage Tracking
    function initScrollProgress() {
        // Create top progress bar container if not present
        let progressContainer = document.querySelector('.scroll-progress-container');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'scroll-progress-container';
            progressContainer.setAttribute('title', 'Scroll Progress: hover to preview, click to jump');
            
            const bar = document.createElement('div');
            bar.className = 'scroll-progress-bar';
            bar.id = 'topProgressBar';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'scroll-progress-tooltip';
            tooltip.id = 'topProgressTooltip';
            tooltip.textContent = '0%';
            
            progressContainer.appendChild(bar);
            progressContainer.appendChild(tooltip);
            document.body.prepend(progressContainer);
        }

        const progressBar = document.getElementById('topProgressBar');
        const tooltip = document.getElementById('topProgressTooltip');
        const percentageBadges = document.querySelectorAll('.progress-percentage-val');
        const miniFills = document.querySelectorAll('.progress-fill-mini');

        function updateProgress() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const rawPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            const percent = Math.min(100, Math.max(0, Math.round(rawPercent)));

            if (progressBar) {
                progressBar.style.width = rawPercent + '%';
            }
            miniFills.forEach(fill => {
                fill.style.width = rawPercent + '%';
            });
            percentageBadges.forEach(badge => {
                badge.textContent = percent + '%';
            });
        }

        // Hover tracking over the top progress bar
        progressContainer.addEventListener('mousemove', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const hoverPercent = Math.round((mouseX / rect.width) * 100);
            if (tooltip) {
                tooltip.style.left = e.clientX + 'px';
                tooltip.textContent = hoverPercent + '% (Click to jump)';
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            }
        });

        progressContainer.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });

        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickFraction = (e.clientX - rect.left) / rect.width;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({
                top: clickFraction * docHeight,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // Interactive Kitty Mascot
    function initKitty() {
        let containers = document.querySelectorAll('.interactive-kitty');
        if (!containers.length) {
            const footers = document.querySelectorAll('.site-footer');
            footers.forEach(f => {
                if (!f.querySelector('.interactive-kitty')) {
                    const kDiv = document.createElement('div');
                    kDiv.className = 'interactive-kitty';
                    f.appendChild(kDiv);
                }
            });
            containers = document.querySelectorAll('.interactive-kitty');
        }
        if (!containers.length) return;

        containers.forEach(container => {
            if (container.dataset.initialized) return;
            container.dataset.initialized = 'true';

            let petCount = parseInt(localStorage.getItem('kitty_pets') || '0', 10);

            container.innerHTML = `
                <div class="kitty-wrapper" id="kittyWrapper">
                    <div class="kitty-bubble" id="kittyBubble">purr~</div>
                    <div class="kitty-container" id="kittyBtn" title="Click to pet the kitty!">
                        <svg class="kitty-svg" viewBox="0 0 160 120" role="img" aria-label="Cute interactive cat">
                            <!-- Shadow -->
                            <ellipse cx="80" cy="106" rx="44" ry="7" fill="var(--rule)" opacity="0.45" />
                            
                            <!-- Tail -->
                            <path class="kitty-tail" d="M 115 95 C 132 95, 145 85, 142 68 C 140 55, 128 58, 130 66 C 132 74, 124 85, 112 88" 
                                  fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" />
                            
                            <!-- Body (Loaf) -->
                            <path d="M 46 98 C 42 75, 60 62, 80 62 C 100 62, 118 75, 114 98 C 112 104, 48 104, 46 98 Z" 
                                  fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2.5" />
                            
                            <!-- Left Ear -->
                            <g class="kitty-ear-left">
                                <polygon points="52,48 44,18 70,32" fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" />
                                <polygon points="53,44 49,24 66,33" fill="var(--accent)" opacity="0.32" />
                            </g>
                            
                            <!-- Right Ear -->
                            <g class="kitty-ear-right">
                                <polygon points="108,48 116,18 90,32" fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" />
                                <polygon points="107,44 111,24 94,33" fill="var(--accent)" opacity="0.32" />
                            </g>

                            <!-- Head -->
                            <ellipse cx="80" cy="52" rx="33" ry="27" fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2.5" />

                            <!-- Cheeks / Blush -->
                            <ellipse cx="61" cy="61" rx="5" ry="3" fill="var(--accent)" opacity="0.28" />
                            <ellipse cx="99" cy="61" rx="5" ry="3" fill="var(--accent)" opacity="0.28" />

                            <!-- Whiskers Left -->
                            <line x1="56" y1="58" x2="34" y2="55" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />
                            <line x1="55" y1="62" x2="32" y2="63" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />
                            <line x1="56" y1="66" x2="36" y2="70" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />

                            <!-- Whiskers Right -->
                            <line x1="104" y1="58" x2="126" y2="55" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />
                            <line x1="105" y1="62" x2="128" y2="63" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />
                            <line x1="104" y1="66" x2="124" y2="70" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" opacity="0.65" />

                            <!-- Open Eyes Group (Tracks Cursor) -->
                            <g class="kitty-eye-open">
                                <!-- Left Eye Sclera & Pupil -->
                                <ellipse cx="68" cy="50" rx="7" ry="8" fill="#ffffff" stroke="var(--ink)" stroke-width="1.8" />
                                <g class="kitty-pupil-l">
                                    <ellipse cx="68" cy="50" rx="4.5" ry="5.5" fill="#20221f" />
                                    <circle cx="66.5" cy="48" r="1.6" fill="#ffffff" />
                                </g>

                                <!-- Right Eye Sclera & Pupil -->
                                <ellipse cx="92" cy="50" rx="7" ry="8" fill="#ffffff" stroke="var(--ink)" stroke-width="1.8" />
                                <g class="kitty-pupil-r">
                                    <ellipse cx="92" cy="50" rx="4.5" ry="5.5" fill="#20221f" />
                                    <circle cx="90.5" cy="48" r="1.6" fill="#ffffff" />
                                </g>
                            </g>

                            <!-- Closed / Happy Eyes Group (Squints when petted/blinking) -->
                            <g class="kitty-eye-closed">
                                <path d="M 61 52 Q 68 44 75 52" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" />
                                <path d="M 85 52 Q 92 44 99 52" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" />
                            </g>

                            <!-- Nose -->
                            <polygon points="78,58 82,58 80,61" fill="var(--accent)" />

                            <!-- Cute Mouth (w-shape) -->
                            <path d="M 75 63 Q 78 66 80 63 Q 82 66 85 63" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round" />

                            <!-- Front Paws -->
                            <ellipse cx="67" cy="101" rx="8" ry="5" fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2" />
                            <ellipse cx="93" cy="101" rx="8" ry="5" fill="var(--card-bg)" stroke="var(--ink)" stroke-width="2" />
                            <line x1="67" y1="99" x2="67" y2="104" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" />
                            <line x1="93" y1="99" x2="93" y2="104" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div class="kitty-caption" id="kittyCaption"></div>
                </div>
            `;

            const wrapper = container.querySelector('#kittyWrapper');
            const btn = container.querySelector('#kittyBtn');
            const bubble = container.querySelector('#kittyBubble');
            const caption = container.querySelector('#kittyCaption');
            const pupilL = container.querySelector('.kitty-pupil-l');
            const pupilR = container.querySelector('.kitty-pupil-r');

            let isHappy = false;
            let bubbleTimeout = null;

            const purrs = [
                'purr~',
                'meow! ♥',
                'prrrrr...',
                'nya~ (=^･ω･^=)',
                '*head bump*',
                'happy cat~',
                'mew! ✨',
                '*purrs softly*',
                'prrr ♥'
            ];

            function updateCaption() {
                if (petCount === 0) {
                    caption.textContent = 'pet me • 0 pets';
                } else if (petCount === 1) {
                    caption.textContent = 'happy kitty • 1 pet';
                } else if (petCount < 10) {
                    caption.textContent = `purring • ${petCount} pets`;
                } else {
                    caption.textContent = `purr master • ${petCount} pets ✨`;
                }
            }
            updateCaption();

            // Natural Blinking
            function blink() {
                if (!isHappy) {
                    wrapper.classList.add('is-blinking');
                    setTimeout(() => {
                        wrapper.classList.remove('is-blinking');
                    }, 140);
                }
                const nextBlink = Math.random() * 4500 + 2500;
                setTimeout(blink, nextBlink);
            }
            setTimeout(blink, 2000);

            // Cursor Eye-Tracking
            window.addEventListener('mousemove', (e) => {
                if (isHappy) return;
                const rect = btn.getBoundingClientRect();
                const kittyCenterX = rect.left + rect.width / 2;
                const kittyCenterY = rect.top + rect.height / 2;

                const dx = e.clientX - kittyCenterX;
                const dy = e.clientY - kittyCenterY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const maxOffset = 2.4;
                const angle = Math.atan2(dy, dx);
                const offset = Math.min(dist / 90, 1) * maxOffset;

                const moveX = (Math.cos(angle) * offset).toFixed(2);
                const moveY = (Math.sin(angle) * offset).toFixed(2);

                if (pupilL && pupilR) {
                    pupilL.setAttribute('transform', `translate(${moveX} ${moveY})`);
                    pupilR.setAttribute('transform', `translate(${moveX} ${moveY})`);
                }
            });

            // Gentle Web Audio Synthesized Chirp/Purr
            function playPurrSound() {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (!AudioCtx) return;
                    const ctx = new AudioCtx();
                    const now = ctx.currentTime;

                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(520, now);
                    osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
                    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);

                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.20);
                } catch(err) {}
            }

            // Click / Pet Event
            btn.addEventListener('click', (e) => {
                petCount++;
                localStorage.setItem('kitty_pets', petCount);
                updateCaption();
                playPurrSound();

                // Spawn floating heart
                const heart = document.createElement('div');
                heart.className = 'kitty-heart';
                heart.innerHTML = '♥';
                const rect = btn.getBoundingClientRect();
                const clickX = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
                const clickY = e.clientY ? (e.clientY - rect.top) : (rect.height / 3);
                heart.style.left = `${clickX}px`;
                heart.style.top = `${clickY}px`;
                btn.appendChild(heart);
                setTimeout(() => heart.remove(), 900);

                // Squint eyes happily
                isHappy = true;
                wrapper.classList.add('is-happy');
                if (pupilL && pupilR) {
                    pupilL.setAttribute('transform', 'translate(0 0)');
                    pupilR.setAttribute('transform', 'translate(0 0)');
                }

                // Show bubble
                const msg = purrs[Math.floor(Math.random() * purrs.length)];
                bubble.textContent = msg;
                bubble.classList.add('visible');

                clearTimeout(bubbleTimeout);
                bubbleTimeout = setTimeout(() => {
                    bubble.classList.remove('visible');
                    isHappy = false;
                    wrapper.classList.remove('is-happy');
                }, 1200);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        updateToggleButtons(current);
        initScrollProgress();
        initKitty();
    });
})();
