(function() {
  "use strict";

  /**
   * Añade o quita la clase "scrolled" al body al hacer scroll
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Toggle del menú móvil
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Cerrar el menú móvil al hacer click en un enlace interno
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Botón de scroll hacia arriba
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animaciones AOS
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init Swiper
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Isotope
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Pure Counter
   */
  new PureCounter();

  /**
   * Ajuste de scroll al cargar si hay hash
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Envío de correo usando SMTP.js con Elastic Email
   * Asegúrate de cambiar Username, Password, From, To, Port según tus datos.
   */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const loading = document.querySelector(".loading");
      const errorMessage = document.querySelector(".error-message");
      const sentMessage = document.querySelector(".sent-message");

      loading.style.display = "block";
      errorMessage.style.display = "none";
      sentMessage.style.display = "none";

      const name = document.querySelector("input[name='name']").value;
      const email = document.querySelector("input[name='email']").value;
      const subject = document.querySelector("input[name='subject']").value;
      const message = document.querySelector("textarea[name='message']").value;

      if (!name || !email || !subject || !message) {
        loading.style.display = "none";
        errorMessage.innerText = "Por favor, completa todos los campos.";
        errorMessage.style.display = "block";
        return;
      }

      // Ajustar estos datos a los reales de tu cuenta Elastic Email
      Email.send({
        Host: "smtp.elasticemail.com",
        Username: "610e1160-3530-4e42-a9a0-809e8ec2d76d", // Tu API Key o credencial SMTP
        Password: "12345678", // Tu contraseña SMTP
        Port: 465,            // Prueba primero con 465 si SSL es requerido
        Secure: true,         // Fuerza uso de SSL
        To: "tu_destinatario@example.com",       // Cambia este correo al que recibirá el mensaje
        From: "tu_correo_verificado@example.com",// Debe ser un correo verificado en Elastic Email
        Subject: `Nuevo mensaje de ${name}: ${subject}`,
        Body: `
          <p>Has recibido un nuevo mensaje desde el formulario de contacto:</p>
          <ul>
            <li><strong>Nombre:</strong> ${name}</li>
            <li><strong>Correo del visitante:</strong> ${email}</li>
            <li><strong>Asunto:</strong> ${subject}</li>
            <li><strong>Mensaje:</strong> ${message}</li>
          </ul>
        `
      })
      .then(() => {
        loading.style.display = "none";
        sentMessage.style.display = "block";
        contactForm.reset();
      })
      .catch((error) => {
        loading.style.display = "none";
        errorMessage.innerText = "Hubo un error al enviar el mensaje: " + error.message;
        errorMessage.style.display = "block";
      });
    });
  }

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
