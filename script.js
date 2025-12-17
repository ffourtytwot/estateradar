let marketChart;

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';

    // Text updates with fade effect
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.style.opacity = '0';
        setTimeout(() => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
            element.style.opacity = '1';
        }, 200);
    });

    if (marketChart) {
        marketChart.data.datasets[0].label = translations[lang].chart_label_market;
        marketChart.data.datasets[1].label = translations[lang].chart_label_bot;
        marketChart.update();
    }

    localStorage.setItem('preferredLang', lang);
    updateLangButtons(lang);
}

function updateLangButtons(activeLang) {
    const activeClass = "bg-white text-dark-900 shadow-md cursor-default";
    const inactiveClass = "text-slate-400 hover:text-white cursor-pointer";
    
    ['pl', 'en', 'ru'].forEach(lang => {
        const btn = document.getElementById(`btn-${lang}`);
        if (btn) {
            btn.className = lang === activeLang 
                ? `px-3 py-1.5 rounded-full text-xs font-bold transition ${activeClass}`
                : `px-3 py-1.5 rounded-full text-xs font-semibold transition ${inactiveClass}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language.startsWith('pl') ? 'pl' : 'en';
    const initialLang = savedLang || browserLang;

    initChart();
    setLanguage(initialLang);
});

function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    
    // Gradient for Market Line
    const gradientMarket = ctx.createLinearGradient(0, 0, 0, 400);
    gradientMarket.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradientMarket.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    // Gradient for Bot Line
    const gradientBot = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBot.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
    gradientBot.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

    marketChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mokotów', 'Wola', 'Ursynów', 'Praga Płd.', 'Bielany'],
            datasets: [
                {
                    label: 'Market Avg',
                    data: [16500, 15800, 14200, 13500, 12900],
                    backgroundColor: '#6366f1',
                    borderRadius: 4,
                    barPercentage: 0.6,
                },
                {
                    label: 'Bot Deals',
                    data: [14200, 13500, 12100, 11200, 10800],
                    backgroundColor: '#22c55e',
                    borderRadius: 4,
                    barPercentage: 0.6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    labels: { color: '#94a3b8', font: { family: "'Plus Jakarta Sans', sans-serif" } } 
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } }
                }
            }
        }
    });
}