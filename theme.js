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

    document.addEventListener('DOMContentLoaded', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        updateToggleButtons(current);
        initScrollProgress();
    });
})();
