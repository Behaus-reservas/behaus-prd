// public/components/dashboard-menu.js (MEJORADO)

class DashboardMenu extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        
        shadow.innerHTML = `
            <style>
                .menu-container {
                    width: 220px;
                    background-color: var(--menu-bg);
                    color: var(--menu-text-color);
                    padding: 20px 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
                    position: fixed;
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                }
                
                .logo {
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: var(--secondary-color);
                }

                nav ul {
                    list-style: none;
                    padding: 0;
                    flex-grow: 1;
                }

                .menu-item a, .logout-btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    text-decoration: none;
                    color: var(--menu-text-color);
                    transition: background-color 0.3s;
                    font-size: 0.9em;
                }

                .menu-item a:hover, .menu-item a.active {
                    background-color: var(--menu-hover-bg);
                    border-left: 4px solid var(--secondary-color);
                }

                .menu-item span.icon {
                    margin-right: 10px;
                    font-size: 1.1em;
                }

                /* Submenús */
                .submenu {
                    display: none; 
                    background-color: var(--menu-hover-bg); 
                    padding-left: 30px;
                }
                .menu-item.expanded .submenu {
                    display: block;
                }
                .menu-item.has-submenu > a::after {
                    content: '▼';
                    margin-left: auto;
                    font-size: 0.7em;
                    transition: transform 0.2s;
                }
                .menu-item.expanded.has-submenu > a::after {
                    transform: rotate(180deg);
                }

                .logout-section {
                    padding: 10px 20px;
                }
                #logoutButton {
                    background-color: #e74c3c; 
                    color: white;
                    border: none;
                    padding: 10px;
                    width: 100%;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
                :host-context(html.dark-mode) #logoutButton {
                    background-color: #c0392b; /* Darker red for dark mode */
                }
            </style>
            <div class="menu-container">
                <div class="logo">🏨 Hotel Admin</div>
                <nav>
                    <ul>
                        <li class="menu-item"><a href="/dashboard"><span class="icon">🏠</span> Dashboard</a></li>
                        <li class="menu-item"><a href="/planner.html"><span class="icon">📅</span> Planificador Ocupación</a></li>
                        <li class="menu-item has-submenu">
                            <a href="#"><span class="icon">📊</span> Reportes</a>
                            <ul class="submenu">
                                <li><a href="/reports.html">Ocupacion</a></li>
                                <li><a href="/profit-loss-report.html">Ganancias/Pérdidas</a></li>
                            </ul>
                        </li>
                        <li class="menu-item"><a href="/housekeeping.html"><span class="icon">🧹</span> Limpieza</a></li>
                        <li class="menu-item"><a href="/invoices.html"><span class="icon">🧾</span> Facturación</a></li>
                        <li class="menu-item"><a href="/expenses.html"><span class="icon">💸</span> Gastos Operativos</a></li>
                        
                        <li class="menu-item has-submenu">
                            <a href="#"><span class="icon">⚙️</span> Configuración</a>
                            <ul class="submenu">
                                <li><a href="/prices.html">Precios y Tarifas</a></li>
                                <li><a href="/employees.html">Gestión Empleados</a></li>
                                <li><a href="/shifts-planner.html">Planificador Turnos</a></li>
                                <li><a href="/settings-panel.html">Ajustes Cuenta</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div class="logout-section">
                    <button id="logoutButton">Cerrar Sesión</button>
                </div>
            </div>
        `;
    
    }

    connectedCallback() {
        this.shadowRoot.getElementById('logoutButton').addEventListener('click', () => this.handleLogout());
        this.highlightActiveLink();
        this.setupSubMenus();
    }

    handleLogout() {
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                window.location.href = '/'; 
            });
    }

    highlightActiveLink() {
        const links = this.shadowRoot.querySelectorAll('a');
        const currentPath = window.location.pathname;

        links.forEach(link => {
            // Comprueba si la ruta del enlace coincide con la ruta actual de la ventana
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
                // Si es parte de un submenú, expande el padre
                const parentSubmenu = link.closest('.submenu');
                if (parentSubmenu) {
                    const parentItem = parentSubmenu.closest('.menu-item');
                    if (parentItem) {
                         parentItem.classList.add('expanded');
                    }
                }
            }
        });
    }

    setupSubMenus() {
        this.shadowRoot.querySelectorAll('.has-submenu > a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Evita la navegación si solo es un toggle
                const parentItem = link.closest('.menu-item');
                parentItem.classList.toggle('expanded');
            });
        });
    }
}

customElements.define('dashboard-menu', DashboardMenu);
