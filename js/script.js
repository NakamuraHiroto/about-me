'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニュー
  const menuButton = document.querySelector('.menu-button');
  const globalNav = document.querySelector('.global-nav');

  if (menuButton && globalNav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      globalNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

      menuButton.setAttribute('aria-expanded', String(!isOpen));
      globalNav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    globalNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // TOPページの画像スライダー
  const slider = document.querySelector('.slider');

  if (slider) {
    const track = slider.querySelector('.slider__track');
    const slides = slider.querySelectorAll('.slider__slide');
    const previousButton = slider.querySelector('[data-slider="previous"]');
    const nextButton = slider.querySelector('[data-slider="next"]');
    const dotsArea = slider.querySelector('.slider__dots');
    const dots = [];
    let currentIndex = 0;
    let timerId;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;

      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentIndex);
      });
    };

    const stopAutoPlay = () => {
      window.clearInterval(timerId);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      timerId = window.setInterval(() => {
        showSlide(currentIndex + 1);
      }, 4500);
    };

    slides.forEach((slide, index) => {
      const dot = document.createElement('button');

      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `スライド${index + 1}を表示`);
      dot.addEventListener('click', () => {
        showSlide(index);
        startAutoPlay();
      });

      if (dotsArea) {
        dotsArea.appendChild(dot);
      }

      dots.push(dot);
    });

    if (previousButton) {
      previousButton.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoPlay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoPlay();
      });
    }

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  }

  // お問い合わせフォームの入力チェック
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    const requiredFields = [...contactForm.querySelectorAll('[required]')];
    const formStatus = contactForm.querySelector('.form__status');

    const validateField = (field) => {
      const errorArea = document.querySelector(`#${field.id}-error`);
      const value = field.value.trim();
      let message = '';

      if (!value) {
        message = 'この項目を入力してください。';
      } else if (
        field.type === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        message = '正しいメールアドレス形式で入力してください。';
      } else if (field.id === 'message' && value.length < 10) {
        message = '内容は10文字以上で入力してください。';
      }

      field.classList.toggle('is-error', Boolean(message));
      field.setAttribute('aria-invalid', String(Boolean(message)));

      if (errorArea) {
        errorArea.textContent = message;
      }

      return !message;
    };

    requiredFields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isValid = requiredFields.map(validateField).every(Boolean);

      if (formStatus) {
        formStatus.hidden = !isValid;

        if (isValid) {
          formStatus.textContent =
            '入力内容を確認しました。※このフォームに送信機能はありません。';
        }
      }

      if (!isValid) {
        contactForm.querySelector('.is-error')?.focus();
      }
    });
  }

  // ページ上部へ戻るボタン
  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    const updateButtonVisibility = () => {
      backToTopButton.classList.toggle('is-visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', updateButtonVisibility, {
      passive: true,
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    updateButtonVisibility();
  }

  // スクロール時のフェードイン
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    fadeElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    fadeElements.forEach((element) => {
      element.classList.add('is-visible');
    });
  }
});
