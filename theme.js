// Theme manager for academic paper design
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

    document.addEventListener('DOMContentLoaded', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        updateToggleButtons(current);
    });
})();
