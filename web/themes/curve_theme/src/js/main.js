(function ($, Drupal, once) {
  Drupal.behaviors.curve_theme = {
    attach: function (context, settings) {
      const pageHeader = document.getElementById("page-header");
      const mainMenuFixed = document.getElementById("mobile-menu-fixed");
      const mainMenuScroll = document.getElementById("mobile-menu-scroll");
      const modalScrollWrapper = document.getElementById(
        "modal-scroll-wrapper"
      );
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
      const heroSections = document.querySelectorAll(".paragraph--type--hero");
      const fullWidthImageSections = document.querySelectorAll(
        ".paragraph--type--full-width-image"
      );
      const desktopMenuSticky = document.getElementById("desktop-menu-sticky");
      const tagSections = document.querySelectorAll(".tag-section");
      const desktopMenu = document.getElementById("desktop-menu");
      const desktopMenuLinks = document.querySelectorAll("#desktop-menu a");
      const contactUsOverlayToggles = document.querySelectorAll(
        "[data-toggle-contact-us]"
      );
      const modalContactUs = document.getElementById("modal-contact-us");
      const modalCloseButton = document.querySelector(
        "[data-close-contact-us]"
      );

      // Hero: Set section height for mobile.
      heroSections.forEach(function (heroSection) {
        if (window.innerWidth < 1024) {
          heroSection.style.height =
            window.innerHeight - pageHeader.clientHeight + "px";
        }
      });

      // Mobile Menu toggle
      function closeMobileMenu() {
        mainMenuFixed.classList.remove("open");
        mobileMenuToggle.classList.remove("open");
        document.documentElement.classList.remove("scroll-lock");
      }
      mobileMenuToggle.addEventListener("click", function () {
        mainMenuFixed.classList.toggle("open");
        mobileMenuToggle.classList.toggle("open");
        document.documentElement.classList.toggle("scroll-lock");
      });

      // Contact Us Overlay Toggle.
      contactUsOverlayToggles.forEach(function (contactUsOverlayToggle) {
        contactUsOverlayToggle.addEventListener("click", function (e) {
          e.preventDefault();
          if (!modalContactUs) return;

          closeMobileMenu();

          modalContactUs.classList.add("open");
          document.documentElement.classList.add("scroll-lock");
          document.documentElement.classList.add("contact-us-modal-open");
        });
      });

      function closeModal() {
        modalContactUs.classList.remove("open");
        document.documentElement.classList.remove("scroll-lock");
        document.documentElement.classList.remove("contact-us-modal-open");
      }

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeModal();
        }
      });

      document.addEventListener("click", function (event) {
        const modalWrapper = document.querySelector(".modal-wrapper");

        if (
          modalWrapper &&
          modalContactUs.contains(event.target) &&
          !modalWrapper.contains(event.target)
        ) {
          closeModal();
        }
      });

      if (modalCloseButton) {
        modalCloseButton.addEventListener("click", function (e) {
          e.preventDefault();
          if (!modalContactUs) return;

          closeModal();
        });
      }

      // Init Page Menu.
      function initPageMenu() {
        if (!desktopMenu || !mobileMenu) return;

        // Create Mobile Menu.
        mobileMenu.innerHTML = desktopMenu.innerHTML;
        const mobileMenuLinks = mobileMenu.querySelectorAll("a");

        // Init link click events.
        function handleMenuLinkClick(e) {
          e.preventDefault();

          const targetId = this.getAttribute("href").substring(1);
          const target = document.getElementById(targetId);
          if (!target) return;

          closeMobileMenu();

          const headerOffset = window.innerWidth < 1024 ? 92 : 0;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        desktopMenuLinks.forEach(function (desktopMenuLink) {
          desktopMenuLink.addEventListener("click", handleMenuLinkClick);
        });
        mobileMenuLinks.forEach(function (desktopMenuLink) {
          desktopMenuLink.addEventListener("click", handleMenuLinkClick);
        });
      }
      initPageMenu();

      // Desktop menu position calculation.
      function setDesktopMenuPosition() {
        if (!desktopMenuSticky) return;

        const firstTag = document.querySelector(".section .item-tag");
        const topOffset = firstTag.getBoundingClientRect().top + window.scrollY;
        desktopMenuSticky.style.paddingTop = topOffset + "px";
      }

      //
      function getTagSectionPositions() {
        let values = [];
        tagSections.forEach(function (tagSection) {
          const topOffset =
            tagSection.getBoundingClientRect().top + window.scrollY;
          const bottomOffset =
            tagSection.getBoundingClientRect().bottom + window.scrollY;

          values.push({ topOffset, bottomOffset });
        });

        return values;
      }

      let tagSectionPositions = [];
      function onResize() {
        // Set Mobile menu container to fixed height to enable scrolling when necessary.
        mainMenuScroll.style.height =
          window.innerHeight - pageHeader.clientHeight + "px";

        if (window.innerWidth >= 1024) {
          modalScrollWrapper.style.height = "";
        } else {
          modalScrollWrapper.style.height =
            window.innerHeight - pageHeader.clientHeight + "px";
        }

        // Reset Mobile menu visibility when resized to desktop.
        if (window.innerWidth >= 1024) {
          mainMenuFixed.classList.remove("open");
          mobileMenuToggle.classList.remove("open");
          document.documentElement.classList.remove("scroll-lock");
        }

        // Hero: Reset height for desktop, use css height.
        heroSections.forEach(function (heroSection) {
          if (window.innerWidth >= 1024) {
            heroSection.style.height = "";
          }
        });

        // Section: Full Width Image.
        // Apply correct background image (mobile/desktop).
        fullWidthImageSections.forEach(function (fullWidthImageSection) {
          if (window.innerWidth >= 1024) {
            fullWidthImageSection.style.backgroundImage = `url(${fullWidthImageSection.dataset.desktopImage})`;
          } else {
            fullWidthImageSection.style.backgroundImage = `url(${fullWidthImageSection.dataset.mobileImage})`;
          }
        });

        //
        if (window.innerWidth >= 1024) {
          setDesktopMenuPosition();
          tagSectionPositions = getTagSectionPositions();
        }
      }

      // Attach the event listener.
      window.addEventListener("resize", onResize);
      onResize();

      // Determine and set the active desktop menu item.
      function setDesktopMenuActiveItem() {
        if (!tagSectionPositions.length || !desktopMenuLinks.length) return;

        const desktopMenuTopOffset =
          desktopMenu.getBoundingClientRect().top + window.scrollY;
        let activeIndex;
        let i = 0;
        for (const tagSectionPosition of tagSectionPositions) {
          if (
            desktopMenuTopOffset >= tagSectionPosition.topOffset &&
            desktopMenuTopOffset <= tagSectionPosition.bottomOffset
          ) {
            activeIndex = i;
            break;
          }
          i++;
        }

        // Set active.
        i = 0;
        for (const desktopMenuLink of desktopMenuLinks) {
          desktopMenuLink.classList.remove("active");

          if (i === activeIndex) {
            desktopMenuLink.classList.add("active");
          }

          i++;
        }
      }

      // Process Full Width Image sections and check if background image should be fixed or not.

      function checkFullWidthImageAttachment(scrollPos) {
        const screenBottom = scrollPos + window.innerHeight;
        fullWidthImageSections.forEach(function (fullWidthImageSection) {
          const sectionBottomOffset =
            fullWidthImageSection.getBoundingClientRect().bottom +
            window.scrollY;
          // After user has scrolled past the bottom of the section, the image should scroll with content.
          if (screenBottom > sectionBottomOffset) {
            fullWidthImageSection.style.backgroundAttachment = "scroll";
          } else {
            // backgroundAttachment "fixed" is by default so we just remove the property
            fullWidthImageSection.style.backgroundAttachment = "";
          }
        });
      }

      // Attach the scroll listener.
      let lastKnownScrollPosition = 0;
      let ticking = false;
      function onScroll(scrollPos) {
        if (window.innerWidth >= 1024) {
          setDesktopMenuActiveItem();
          checkFullWidthImageAttachment(scrollPos);
        }
      }

      document.addEventListener("scroll", (event) => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll(lastKnownScrollPosition);
            ticking = false;
          });

          ticking = true;
        }
      });
      onScroll(window.scrollY);

      //
      //  Webform items
      //
      function handleWebformItems() {
        const formItems = document.querySelectorAll(
          ".webform-submission-form .form-text, .webform-submission-form .form-email, .webform-submission-form .form-tel"
        );
        formItems.forEach(function (formItem) {
          function checkValue(el) {
            if (el.value.length > 0 && el.parentElement) {
              el.parentElement.classList.add("has-value");
            } else {
              el.parentElement.classList.remove("has-value");
            }
          }

          // On Focus
          formItem.addEventListener("focus", function (e) {
            this.parentElement.classList.add("is-focused");
          });

          // On Blur
          formItem.addEventListener("blur", function (e) {
            this.parentElement.classList.remove("is-focused");
          });

          // On Input
          formItem.addEventListener("input", function (e) {
            checkValue(e.target);
          });

          checkValue(formItem);
        });
      }
      handleWebformItems();
    },
  };
})(jQuery, Drupal, once);
