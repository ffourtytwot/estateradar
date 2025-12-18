let marketChart;

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';

    // Update text with fade effect
    document.querySelectorAll('[data-i18n]').forEach(element => {
        // Simple fade out/in logic
        element.style.opacity = '0.5'; 
        setTimeout(() => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
            element.style.opacity = '1';
        }, 150);
    });

    // Update Chart
    if (marketChart) {
        marketChart.data.datasets[0].label = translations[lang].chart_label_market;
        marketChart.data.datasets[1].label = translations[lang].chart_label_bot;
        marketChart.update();
    }

    // Save preference
    localStorage.setItem('preferredLang', lang);
    updateLangButtons(lang);
}

function updateLangButtons(activeLang) {
    const activeClass = "bg-white text-dark-900 shadow-md cursor-default transform scale-105";
    const inactiveClass = "text-slate-400 hover:text-white cursor-pointer hover:bg-white/10";
    
    ['pl', 'en', 'ru'].forEach(lang => {
        const btn = document.getElementById(`btn-${lang}`);
        if (btn) {
            // Reset classes
            btn.className = `px-3 py-1.5 rounded-full text-xs font-bold transition duration-200 ${lang === activeLang ? activeClass : inactiveClass}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Determine language
    const savedLang = localStorage.getItem('preferredLang');
    // Check if browser is PL, otherwise default to EN
    const browserLang = navigator.language.slice(0, 2) === 'pl' ? 'pl' : 'en'; 
    const initialLang = savedLang || browserLang;

    // Init components
    initChart();
    
    // Set language (if it's not English, switch it)
    if (initialLang !== 'en') {
        setLanguage(initialLang);
    } else {
        updateLangButtons('en'); // Just visual update
    }
});

function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    
    // Gradients
    const gradientMarket = ctx.createLinearGradient(0, 0, 0, 400);
    gradientMarket.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo
    gradientMarket.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const gradientBot = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBot.addColorStop(0, 'rgba(34, 197, 94, 0.5)'); // Green
    gradientBot.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

    marketChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mokotów', 'Wola', 'Ursynów', 'Praga Płd.', 'Bielany'],
            datasets: [
                {
                    label: 'Avg Market Price', // Default EN
                    data: [18500, 17800, 16200, 14500, 13900], // Updated somewhat realistic prices
                    backgroundColor: '#6366f1',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Bot Deal Price', // Default EN
                    data: [14200, 13500, 12100, 11200, 10800],
                    backgroundColor: '#22c55e',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { 
                    labels: { color: '#cbd5e1', font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } },
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' PLN/m²';
                        }
                    }
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
