// ============================================
// FORMULARIO DE EARLY ACCESS
// ============================================

document.getElementById('earlyAccessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const interest = document.querySelector('select[name="interest"]').value;
    
    // Validar
    if (!name || !email || !interest) {
        alert('Por favor completa los campos requeridos');
        return;
    }
    
    // Preparar mensaje
    const message = `
*¡Nuevo registro en CargoPro!*

📝 Nombre: ${name}
📧 Email: ${email}
📱 Teléfono: ${phone || 'No proporcionado'}
📦 Interés: ${interest} pantalones

---
Registro completado desde la landing page
    `.trim();
    
    // Opción 1: Enviar a WhatsApp (descomenta y actualiza el número)
    // const whatsappUrl = `https://wa.me/18095555555?text=${encodeURIComponent(message)}`;
    // window.open(whatsappUrl, '_blank');
    
    // Opción 2: Guardar en localStorage (para después integrar backend)
    let registros = JSON.parse(localStorage.getItem('cargoproRegistros')) || [];
    registros.push({
        name,
        email,
        phone,
        interest,
        fecha: new Date().toLocaleString('es-DO')
    });
    localStorage.setItem('cargoproRegistros', JSON.stringify(registros));
    
    // Mostrar confirmación
    showSuccessMessage();
    this.reset();
});

function showSuccessMessage() {
    const form = document.getElementById('earlyAccessForm');
    const originalHTML = form.innerHTML;
    
    form.innerHTML = `
        <div class="success-message" style="
            background: #2ECC71;
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            font-size: 1.1rem;
        ">
            <div style="font-size: 2rem; margin-bottom: 10px;">✓</div>
            <p style="margin: 0; font-weight: 600;">¡Registro completado!</p>
            <p style="margin: 10px 0 0 0; font-size: 0.95rem;">Te contactaremos pronto con detalles de la preventa.</p>
        </div>
    `;
    
    // Restaurar formulario después de 5 segundos
    setTimeout(() => {
        form.innerHTML = originalHTML;
        attachFormListener();
    }, 5000);
}

// Re-attach listener después de resetear formulario
function attachFormListener() {
    document.getElementById('earlyAccessForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // El listener original sigue funcionando
    });
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Scroll smooth para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Highlight navbar link según scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// ANIMACIONES AL SCROLL (observador)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar observador a cards
document.querySelectorAll('.feature-card, .numero-card, .stat').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ============================================
// FUNCIONES UTILITARIAS PARA DESARROLLO
// ============================================

// Ver registros guardados (en consola)
window.verRegistros = function() {
    const registros = JSON.parse(localStorage.getItem('cargoproRegistros')) || [];
    console.table(registros);
    console.log(`Total registros: ${registros.length}`);
};

// Limpiar registros
window.limpiarRegistros = function() {
    localStorage.removeItem('cargoproRegistros');
    console.log('Registros eliminados');
};

// Exportar registros como CSV
window.exportarRegistros = function() {
    const registros = JSON.parse(localStorage.getItem('cargoproRegistros')) || [];
    if (registros.length === 0) {
        console.log('No hay registros para exportar');
        return;
    }
    
    let csv = 'Nombre,Email,Teléfono,Interés,Fecha\n';
    registros.forEach(r => {
        csv += `"${r.name}","${r.email}","${r.phone}","${r.interest}","${r.fecha}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cargopro-registros-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

console.log('%cCargoPro Landing Page', 'font-size: 16px; font-weight: bold; color: #4A90A4;');
console.log('Comandos útiles:');
console.log('  verRegistros()      - Ver todos los registros');
console.log('  limpiarRegistros()  - Limpiar registros');
console.log('  exportarRegistros() - Descargar CSV');
