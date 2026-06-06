/**
 * Mutualidad de la Salud Santiago del Estero - Script de Interactividad
 * Cobertura de Obra Social y Beneficios Mutuales (Convenio ASPE)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCarousel();
  initCalculator();
  initWhatsAppWidget();
  initAdminModule();
});

/**
 * 1. NAVBAR & MOBILE MENU LOGIC
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar logic on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Animate hamburger lines
    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/**
 * 2. TESTIMONIALS CAROUSEL
 */
let currentSlide = 0;
let carouselInterval;

function initCarousel() {
  const dots = document.querySelectorAll('.dot');
  if (dots.length > 0) {
    // Start auto transition
    startCarouselTimer();
  }
}

function startCarouselTimer() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    const totalSlides = document.querySelectorAll('.review-slide').length;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 6000); // 6 seconds per slide
}

function gotoSlide(index) {
  currentSlide = index;
  updateCarousel();
  startCarouselTimer(); // Reset timer on manual action
}

function updateCarousel() {
  const track = document.getElementById('reviews-track');
  const dots = document.querySelectorAll('.dot');
  
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

/**
 * 3. CALCULATOR / PLAN SIMULATOR
 */
let selectedPlanType = 'integral'; // default: integral (sepelio removed from calculator)

function selectPlan(planType) {
  selectedPlanType = planType;
  
  const optIntegral = document.getElementById('opt-integral');
  const adicionalesGroup = document.getElementById('adicionales-group');
  const hijosDesc = document.getElementById('hijos-desc');
  
  if (optIntegral) optIntegral.classList.add('active');
  if (adicionalesGroup) adicionalesGroup.style.display = 'block';
  if (hijosDesc) hijosDesc.textContent = '* El plan de salud integral añade cobertura médica activa para cada miembro de la familia.';
  
  updateCalculos();
}

function updateCalculos() {
  const cantHijosInput = document.getElementById('cant-hijos');
  const valHijos = document.getElementById('val-hijos');
  const resPlanName = document.getElementById('res-plan-name');
  const resPrice = document.getElementById('res-price');
  const resFeatures = document.getElementById('res-features');
  
  const hijos = parseInt(cantHijosInput.value);
  valHijos.textContent = hijos;
  
  let totalCost = 0;
  let featuresHTML = '';
  
  if (selectedPlanType === 'sepelio') {
    // Plan Sepelio is flat $5000 regardless of children
    totalCost = 5000;
    resPlanName.textContent = 'Plan Sepelio Familiar';
    
    featuresHTML = `
      <li>Servicio de Sepelio completo</li>
      <li>Subsidio en efectivo de $500.000</li>
      <li>Cubre Titular, Cónyuge e Hijos (${hijos} declarados)</li>
      <li>Tarifa familiar plana unificada</li>
      <li>Atención inmediata 24hs en caso de fallecimiento</li>
    `;
  } else {
    // Plan Integral: Base $12000 for couple + $1500 per child
    const baseCost = 12000;
    const costPerChild = 1500;
    totalCost = baseCost + (hijos * costPerChild);
    resPlanName.textContent = 'Plan Salud + Obra Social';
    
    featuresHTML = `
      <li>Cobertura médica y de Obra Social</li>
      <li>Emergencias y Guardia activa de la Mutual 24hs</li>
      <li>Internación Domiciliaria de la Mutualidad</li>
      <li>Servicio de Sepelio completo y subsidio de $500.000</li>
      <li>Cubre Titular, Cónyuge e Hijos (${hijos} declarados)</li>
      <li>Beneficios mutuales (Turismo, Peluquería gratis)</li>
    `;
  }
  
  // Format price to currency standard
  resPrice.textContent = `$${totalCost.toLocaleString('es-AR')}`;
  resFeatures.innerHTML = featuresHTML;
}

/**
 * 4. WHATSAPP REDIRECTIONS
 */
const JORGE_COMMERCIAL = '5493843402048'; // Ventas / Asesoría
const MARCOS_ADMIN = '5493843421738'; // Administración / Afiliados
const GUARDIA_EMERGENCIA = '3855250505'; // Guardia (Teléfono directo)

function solicitarPlanSepelio() {
  const url = `https://wa.me/${JORGE_COMMERCIAL}?text=Hola!%20Quiero%20solicitar%20información%20para%20afiliarme%20al%20*Plan%20Sepelio%20Familiar*%20por%20$5.000%20mensuales%20y%20subsidio%20de%20$500.000.`;
  window.open(url, '_blank');
}

function solicitarPlanCalculado() {
  const cantHijos = document.getElementById('cant-hijos').value;
  const planName = selectedPlanType === 'sepelio' ? 'Plan Sepelio Familiar' : 'Plan Salud + Obra Social';
  const price = document.getElementById('res-price').textContent;
  
  const text = `Hola! Estuve simulando en la web y me interesa el *${planName}* con cobertura para matrimonio y *${cantHijos}* hijos. La cuota estimada es de *${price}*. ¿Cuáles son los requisitos de afiliación?`;
  
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${JORGE_COMMERCIAL}?text=${encodedText}`;
  window.open(url, '_blank');
}

/**
 * 5. FLOATING WHATSAPP WIDGET
 */
function initWhatsAppWidget() {
  const waTrigger = document.getElementById('wa-trigger');
  const waPanel = document.getElementById('wa-panel');
  
  if (waTrigger && waPanel) {
    // Open/Close Panel on click
    waTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      waPanel.classList.toggle('active');
      if (waPanel.classList.contains('active')) {
        waPanel.style.display = 'flex';
      } else {
        setTimeout(() => {
          if (!waPanel.classList.contains('active')) waPanel.style.display = 'none';
        }, 300);
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!waPanel.contains(e.target) && e.target !== waTrigger && !waTrigger.contains(e.target)) {
        waPanel.classList.remove('active');
        setTimeout(() => {
          if (!waPanel.classList.contains('active')) waPanel.style.display = 'none';
        }, 300);
      }
    });
  }
}

function openContact(departamento) {
  let url = '';
  
  if (departamento === 'emergencias') {
    // Emergency is a call!
    url = `tel:${GUARDIA_EMERGENCIA}`;
    window.location.href = url;
  } else if (departamento === 'ventas') {
    url = `https://wa.me/${JORGE_COMMERCIAL}?text=Hola!%20Me%20interesa%20conocer%20los%20planes%20y%20beneficios%20de%20la%20Mutualidad%20de%20la%20Salud.`;
    window.open(url, '_blank');
  } else if (departamento === 'administracion') {
    url = `https://wa.me/${MARCOS_ADMIN}?text=Hola!%20Me%20comunico%20para%20realizar%20una%20consulta%20sobre%20mi%20afiliación%20o%20trámites%20en%20la%20Mutualidad.`;
    window.open(url, '_blank');
  }
}

/**
 * 6. CLIENT-SIDE VISUAL ADMIN MODULE
 */
function openAdminLogin() {
  document.getElementById('admin-login-modal').classList.add('active');
}

function initAdminModule() {
  // Close modal when pressing Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminLogin();
    }
  });

  // Restore saved edits from localStorage on startup if any
  restoreSavedEdits();

  // If already logged in, activate editor
  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    activateEditMode();
  }
}

function closeAdminLogin() {
  document.getElementById('admin-login-modal').classList.remove('active');
  document.getElementById('admin-login-error').style.display = 'none';
  document.getElementById('admin-password').value = '';
}

function submitAdminLogin() {
  const password = document.getElementById('admin-password').value;
  const errorMsg = document.getElementById('admin-login-error');
  
  // Custom simple admin password (changeable)
  if (password === 'admin' || password === 'mutual2026') {
    sessionStorage.setItem('admin_logged_in', 'true');
    closeAdminLogin();
    activateEditMode();
  } else {
    errorMsg.style.display = 'block';
  }
}

function activateEditMode() {
  document.body.classList.add('admin-mode-active');
  document.getElementById('admin-control-bar').classList.add('active');
  
  // Find all elements to make editable
  const elements = document.querySelectorAll('h1, h2, h3, h4, p, li, strong, span');
  elements.forEach((el, index) => {
    // Exclude admin modules, navbar header, whatsapp triggers
    if (
      el.closest('#navbar') || 
      el.closest('#admin-control-bar') || 
      el.closest('#admin-login-modal') || 
      el.closest('#wa-panel') || 
      el.closest('.footer-bottom') || 
      el.closest('.whatsapp-widget') ||
      el.id === 'val-hijos' ||
      el.id === 'res-price'
    ) {
      return;
    }
    
    // Add unique data attribute to keep track of element positions for saving
    el.setAttribute('data-edit-id', 'el-' + index);
    el.setAttribute('contenteditable', 'true');
  });
}

function exitAdminMode() {
  sessionStorage.removeItem('admin_logged_in');
  document.body.classList.remove('admin-mode-active');
  document.getElementById('admin-control-bar').classList.remove('active');
  
  // Disable contenteditable
  const elements = document.querySelectorAll('[contenteditable="true"]');
  elements.forEach(el => {
    el.removeAttribute('contenteditable');
  });
}

function saveAdminChanges() {
  const edits = {};
  const elements = document.querySelectorAll('[data-edit-id]');
  elements.forEach(el => {
    const id = el.getAttribute('data-edit-id');
    edits[id] = el.innerHTML;
  });
  
  localStorage.setItem('mutualidad_salud_santiago_edits', JSON.stringify(edits));
  alert('¡Cambios guardados en este navegador! Recuerda que para que tu cliente u otros usuarios lo vean, debes descargar el archivo index.html modificado y subirlo a tu hosting (Netlify).');
}

function restoreSavedEdits() {
  const saved = localStorage.getItem('mutualidad_salud_santiago_edits');
  if (!saved) return;
  
  try {
    const edits = JSON.parse(saved);
    const elements = document.querySelectorAll('h1, h2, h3, h4, p, li, strong, span');
    elements.forEach((el, index) => {
      if (
        el.closest('#navbar') || 
        el.closest('#admin-control-bar') || 
        el.closest('#admin-login-modal') || 
        el.closest('#wa-panel') || 
        el.closest('.footer-bottom') || 
        el.closest('.whatsapp-widget') ||
        el.id === 'val-hijos' ||
        el.id === 'res-price'
      ) {
        return;
      }
      
      const key = 'el-' + index;
      if (edits[key] !== undefined) {
        el.innerHTML = edits[key];
      }
    });
  } catch (e) {
    console.error('Error al restaurar cambios guardados', e);
  }
}

function exportUpdatedHtml() {
  // Clone document to clean it
  const clone = document.documentElement.cloneNode(true);
  
  // Clean all admin elements from clone
  const adminBar = clone.querySelector('#admin-control-bar');
  if (adminBar) adminBar.remove();
  
  const adminModal = clone.querySelector('#admin-login-modal');
  if (adminModal) adminModal.remove();
  
  const adminTrigger = clone.querySelector('#admin-login-trigger');
  if (adminTrigger) adminTrigger.remove();
  
  // Remove contenteditable attributes and helper classes
  const editableItems = clone.querySelectorAll('[contenteditable="true"]');
  editableItems.forEach(el => {
    el.removeAttribute('contenteditable');
    el.removeAttribute('data-edit-id');
  });
  
  // Clean classes from body
  const body = clone.querySelector('body');
  if (body) {
    body.classList.remove('admin-mode-active');
  }
  
  // Serialize HTML
  const finalHtml = '<!DOCTYPE html>\n' + clone.outerHTML;
  
  // Trigger download
  const blob = new Blob([finalHtml], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'index.html';
  a.click();
}

/**
 * 7. ADMIN IMAGE EDITOR MODULE
 */
let imgEditModeActive = false;
let currentEditImg = null;

function toggleImageEditMode() {
  imgEditModeActive = !imgEditModeActive;
  const btn = document.getElementById('btn-img-edit');
  if (imgEditModeActive) {
    btn.style.background = '#4a1fa0';
    btn.innerHTML = '<i class="fa-solid fa-image"></i> Modo Imagen: ON';
    document.querySelectorAll('img').forEach(img => {
      if (img.closest('#admin-control-bar') || img.closest('#admin-login-modal') || img.closest('#admin-img-modal') || img.closest('#admin-link-modal') || img.id === 'admin-img-current') return;
      img.style.outline = '3px dashed #6c3fc5';
      img.style.cursor = 'pointer';
      img.dataset.imgEditBound = 'true';
      img._adminClickHandler = () => openImgModal(img);
      img.addEventListener('click', img._adminClickHandler);
    });
  } else {
    btn.style.background = '#6c3fc5';
    btn.innerHTML = '<i class="fa-solid fa-image"></i> Editar Imágenes';
    document.querySelectorAll('[data-img-edit-bound]').forEach(img => {
      img.style.outline = '';
      img.style.cursor = '';
      if (img._adminClickHandler) img.removeEventListener('click', img._adminClickHandler);
      delete img.dataset.imgEditBound;
    });
  }
}

function openImgModal(img) {
  currentEditImg = img;
  document.getElementById('admin-img-current').src = img.src || '';
  document.getElementById('admin-img-url').value = '';
  document.getElementById('admin-img-file').value = '';
  document.getElementById('admin-img-modal').style.display = 'flex';
}

function closeImgModal() {
  document.getElementById('admin-img-modal').style.display = 'none';
  currentEditImg = null;
}

function previewUploadedImg(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('admin-img-current').src = e.target.result;
      document.getElementById('admin-img-url').value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewUrlImg(url) {
  if (url) {
    document.getElementById('admin-img-current').src = url;
    document.getElementById('admin-img-file').value = '';
  }
}

function applyImgChange() {
  if (!currentEditImg) return;
  const fileInput = document.getElementById('admin-img-file');
  const urlInput = document.getElementById('admin-img-url').value.trim();
  const previewSrc = document.getElementById('admin-img-current').src;
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      currentEditImg.src = e.target.result;
      currentEditImg.removeAttribute('srcset');
      closeImgModal();
      alert('✅ Imagen actualizada. Descargá el index.html para publicar.');
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else if (urlInput) {
    currentEditImg.src = urlInput;
    currentEditImg.removeAttribute('srcset');
    closeImgModal();
    alert('✅ Imagen actualizada. Descargá el index.html para publicar.');
  } else if (previewSrc) {
    currentEditImg.src = previewSrc;
    closeImgModal();
  } else {
    alert('Seleccioná un archivo o pegá una URL.');
  }
}

/**
 * 8. ADMIN LINK EDITOR MODULE
 */
let linkEditModeActive = false;
let currentEditLink = null;

function toggleLinkEditMode() {
  linkEditModeActive = !linkEditModeActive;
  const btn = document.getElementById('btn-link-edit');
  if (linkEditModeActive) {
    btn.style.background = '#8a2a10';
    btn.innerHTML = '<i class="fa-solid fa-link"></i> Modo Vínculos: ON';
    document.querySelectorAll('a').forEach(link => {
      if (link.closest('#admin-control-bar') || link.closest('#admin-login-modal') || link.closest('#admin-img-modal') || link.closest('#admin-link-modal') || link.closest('#navbar')) return;
      link.style.outline = '3px dashed #c55f3f';
      link.style.cursor = 'pointer';
      link.dataset.linkEditBound = 'true';
      link._adminLinkHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLinkModal(link);
      };
      link.addEventListener('click', link._adminLinkHandler, true);
    });
  } else {
    btn.style.background = '#c55f3f';
    btn.innerHTML = '<i class="fa-solid fa-link"></i> Editar Vínculos';
    document.querySelectorAll('[data-link-edit-bound]').forEach(link => {
      link.style.outline = '';
      link.style.cursor = '';
      if (link._adminLinkHandler) link.removeEventListener('click', link._adminLinkHandler, true);
      delete link.dataset.linkEditBound;
    });
  }
}

function openLinkModal(link) {
  currentEditLink = link;
  document.getElementById('admin-link-text').value = link.innerText.trim();
  document.getElementById('admin-link-href').value = link.getAttribute('href') || '';
  document.getElementById('admin-link-blank').checked = link.getAttribute('target') === '_blank';
  document.getElementById('admin-link-modal').style.display = 'flex';
}

function closeLinkModal() {
  document.getElementById('admin-link-modal').style.display = 'none';
  currentEditLink = null;
}

function applyLinkChange() {
  if (!currentEditLink) return;
  const newText = document.getElementById('admin-link-text').value.trim();
  const newHref = document.getElementById('admin-link-href').value.trim();
  const newBlank = document.getElementById('admin-link-blank').checked;
  if (newText) currentEditLink.innerText = newText;
  if (newHref) currentEditLink.setAttribute('href', newHref);
  currentEditLink.setAttribute('target', newBlank ? '_blank' : '_self');
  closeLinkModal();
  alert('✅ Hipervínculo actualizado. Descargá el index.html para publicar.');
}
