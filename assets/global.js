function getFocusableElements(t) {
  return Array.from(
    t.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
document.querySelectorAll('[id^="Details-"] summary').forEach((t) => {
  t.setAttribute("role", "button"),
    t.setAttribute("aria-expanded", t.parentNode.hasAttribute("open")),
    t.nextElementSibling.getAttribute("id") &&
      t.setAttribute("aria-controls", t.nextElementSibling.id),
    t.addEventListener("click", (t) => {
      t.currentTarget.setAttribute(
        "aria-expanded",
        !t.currentTarget.closest("details").hasAttribute("open")
      );
    }),
    t.closest("header-drawer") ||
      t.parentElement.addEventListener("keyup", onKeyUpEscape);
});
const trapFocusHandlers = {};
function trapFocus(t, e = t) {
  var i = getFocusableElements(t),
    s = i[0],
    n = i[i.length - 1];
  removeTrapFocus(),
    (trapFocusHandlers.focusin = (e) => {
      (e.target === t || e.target === n || e.target === s) &&
        document.addEventListener("keydown", trapFocusHandlers.keydown);
    }),
    (trapFocusHandlers.focusout = function () {
      document.removeEventListener("keydown", trapFocusHandlers.keydown);
    }),
    (trapFocusHandlers.keydown = function (e) {
      "TAB" === e.code.toUpperCase() &&
        (e.target !== n || e.shiftKey || (e.preventDefault(), s.focus()),
        (e.target === t || e.target === s) &&
          e.shiftKey &&
          (e.preventDefault(), n.focus()));
    }),
    document.addEventListener("focusout", trapFocusHandlers.focusout),
    document.addEventListener("focusin", trapFocusHandlers.focusin),
    e.focus(),
    "INPUT" === e.tagName &&
      ["search", "text", "email", "url"].includes(e.type) &&
      e.value &&
      e.setSelectionRange(0, e.value.length);
}
try {
  document.querySelector(":focus-visible");
} catch (t) {
  focusVisiblePolyfill();
}
function focusVisiblePolyfill() {
  let t = [
      "ARROWUP",
      "ARROWDOWN",
      "ARROWLEFT",
      "ARROWRIGHT",
      "TAB",
      "ENTER",
      "SPACE",
      "ESCAPE",
      "HOME",
      "END",
      "PAGEUP",
      "PAGEDOWN",
    ],
    e = null,
    i = null;
  window.addEventListener("keydown", (e) => {
    t.includes(e.code.toUpperCase()) && (i = !1);
  }),
    window.addEventListener("mousedown", (t) => {
      i = !0;
    }),
    window.addEventListener(
      "focus",
      () => {
        e && e.classList.remove("focused"),
          i || (e = document.activeElement).classList.add("focused");
      },
      !0
    );
}
function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((t) => {
    t.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }),
    document.querySelectorAll(".js-vimeo").forEach((t) => {
      t.contentWindow.postMessage('{"method":"pause"}', "*");
    }),
    document.querySelectorAll("video").forEach((t) => t.pause()),
    document.querySelectorAll("product-model").forEach((t) => {
      t.modelViewerUI && t.modelViewerUI.pause();
    });
}
function removeTrapFocus(t = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin),
    document.removeEventListener("focusout", trapFocusHandlers.focusout),
    document.removeEventListener("keydown", trapFocusHandlers.keydown),
    t && t.focus();
}
function onKeyUpEscape(t) {
  if ("ESCAPE" !== t.code.toUpperCase()) return;
  let e = t.target.closest("details[open]");
  if (!e) return;
  let i = e.querySelector("summary");
  e.removeAttribute("open"), i.setAttribute("aria-expanded", !1), i.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super(),
      (this.input = this.querySelector("input")),
      (this.changeEvent = new Event("change", { bubbles: !0 })),
      this.input.addEventListener("change", this.onInputChange.bind(this)),
      this.querySelectorAll("button").forEach((t) =>
        t.addEventListener("click", this.onButtonClick.bind(this))
      );
  }
  quantityUpdateUnsubscriber = void 0;
  connectedCallback() {
    this.validateQtyRules(),
      (this.quantityUpdateUnsubscriber = subscribe(
        PUB_SUB_EVENTS.quantityUpdate,
        this.validateQtyRules.bind(this)
      ));
  }
  disconnectedCallback() {
    this.quantityUpdateUnsubscriber && this.quantityUpdateUnsubscriber();
  }
  onInputChange(t) {
    this.validateQtyRules();
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = this.input.value;
    "plus" === t.target.name ? this.input.stepUp() : this.input.stepDown(),
      e !== this.input.value && this.input.dispatchEvent(this.changeEvent);
  }
  validateQtyRules() {
    let t = parseInt(this.input.value);
    if (this.input.min) {
      let e = parseInt(this.input.min),
        i = this.querySelector(".quantity__button[name='minus']");
      i.classList.toggle("disabled", t <= e);
    }
    if (this.input.max) {
      let s = parseInt(this.input.max),
        n = this.querySelector(".quantity__button[name='plus']");
      n.classList.toggle("disabled", t >= s);
    }
  }
}
function debounce(t, e) {
  let i;
  return (...s) => {
    clearTimeout(i), (i = setTimeout(() => t.apply(this, s), e));
  };
}
function fetchConfig(t = "json") {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: `application/${t}` },
  };
}
customElements.define("quantity-input", QuantityInput),
  void 0 === window.Shopify && (window.Shopify = {}),
  (Shopify.bind = function (t, e) {
    return function () {
      return t.apply(e, arguments);
    };
  }),
  (Shopify.setSelectorByValue = function (t, e) {
    for (var i = 0, s = t.options.length; i < s; i++) {
      var n = t.options[i];
      if (e == n.value || e == n.innerHTML) return (t.selectedIndex = i), i;
    }
  }),
  (Shopify.addListener = function (t, e, i) {
    t.addEventListener
      ? t.addEventListener(e, i, !1)
      : t.attachEvent("on" + e, i);
  }),
  (Shopify.postLink = function (t, e) {
    var i = (e = e || {}).method || "post",
      s = e.parameters || {},
      n = document.createElement("form");
    for (var r in (n.setAttribute("method", i),
    n.setAttribute("action", t),
    s)) {
      var a = document.createElement("input");
      a.setAttribute("type", "hidden"),
        a.setAttribute("name", r),
        a.setAttribute("value", s[r]),
        n.appendChild(a);
    }
    document.body.appendChild(n), n.submit(), document.body.removeChild(n);
  }),
  (Shopify.CountryProvinceSelector = function (t, e, i) {
    (this.countryEl = document.getElementById(t)),
      (this.provinceEl = document.getElementById(e)),
      (this.provinceContainer = document.getElementById(i.hideElement || e)),
      Shopify.addListener(
        this.countryEl,
        "change",
        Shopify.bind(this.countryHandler, this)
      ),
      this.initCountry(),
      this.initProvince();
  }),
  (Shopify.CountryProvinceSelector.prototype = {
    initCountry: function () {
      var t = this.countryEl.getAttribute("data-default");
      Shopify.setSelectorByValue(this.countryEl, t), this.countryHandler();
    },
    initProvince: function () {
      var t = this.provinceEl.getAttribute("data-default");
      t &&
        this.provinceEl.options.length > 0 &&
        Shopify.setSelectorByValue(this.provinceEl, t);
    },
    countryHandler: function (t) {
      var e = this.countryEl.options[this.countryEl.selectedIndex],
        i = JSON.parse(e.getAttribute("data-provinces"));
      if ((this.clearOptions(this.provinceEl), i && 0 == i.length))
        this.provinceContainer.style.display = "none";
      else {
        for (var s = 0; s < i.length; s++) {
          var e = document.createElement("option");
          (e.value = i[s][0]),
            (e.innerHTML = i[s][1]),
            this.provinceEl.appendChild(e);
        }
        this.provinceContainer.style.display = "";
      }
    },
    clearOptions: function (t) {
      for (; t.firstChild; ) t.removeChild(t.firstChild);
    },
    setOptions: function (t, e) {
      for (var i = 0; i < e.length; i++) {
        var s = document.createElement("option");
        (s.value = e[i]), (s.innerHTML = e[i]), t.appendChild(s);
      }
      e.length;
    },
  });
class MenuDrawer extends HTMLElement {
  constructor() {
    super(),
      (this.mainDetailsToggle = this.querySelector("details")),
      this.addEventListener("keyup", this.onKeyUp.bind(this)),
      this.addEventListener("focusout", this.onFocusOut.bind(this)),
      this.bindEvents();
  }
  bindEvents() {
    this.querySelectorAll("summary").forEach((t) =>
      t.addEventListener("click", this.onSummaryClick.bind(this))
    ),
      this.querySelectorAll("button").forEach((t) =>
        t.addEventListener("click", this.onCloseButtonClick.bind(this))
      );
  }
  onKeyUp(t) {
    if ("ESCAPE" !== t.code.toUpperCase()) return;
    let e = t.target.closest("details[open]");
    e &&
      (e === this.mainDetailsToggle
        ? this.closeMenuDrawer(
            t,
            this.mainDetailsToggle.querySelector("summary")
          )
        : this.closeSubmenu(e));
  }
  onSummaryClick(t) {
    let e = t.currentTarget,
      i = e.parentNode,
      s = i.closest(".has-submenu"),
      n = i.hasAttribute("open"),
      r = window.matchMedia("(prefers-reduced-motion: reduce)");
    function a() {
      trapFocus(e.nextElementSibling, i.querySelector("button")),
        e.nextElementSibling.removeEventListener("transitionend", a);
    }
    i === this.mainDetailsToggle
      ? (n && t.preventDefault(),
        n ? this.closeMenuDrawer(t, e) : this.openMenuDrawer(e),
        window.matchMedia("(max-width: 990px)") &&
          document.documentElement.style.setProperty(
            "--viewport-height",
            `${window.innerHeight}px`
          ))
      : setTimeout(() => {
          i.classList.add("menu-opening"),
            e.setAttribute("aria-expanded", !0),
            s && s.classList.add("submenu-open"),
            !r || r.matches
              ? a()
              : e.nextElementSibling.addEventListener("transitionend", a);
        }, 100);
  }
  openMenuDrawer(t) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    }),
      t.setAttribute("aria-expanded", !0),
      trapFocus(this.mainDetailsToggle, t),
      document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
  closeMenuDrawer(t, e = !1) {
    void 0 !== t &&
      (this.mainDetailsToggle.classList.remove("menu-opening"),
      this.mainDetailsToggle.querySelectorAll("details").forEach((t) => {
        t.removeAttribute("open"), t.classList.remove("menu-opening");
      }),
      this.mainDetailsToggle.querySelectorAll(".submenu-open").forEach((t) => {
        t.classList.remove("submenu-open");
      }),
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      ),
      removeTrapFocus(e),
      this.closeAnimation(this.mainDetailsToggle));
  }
  onFocusOut(t) {
    setTimeout(() => {
      this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement) &&
        this.closeMenuDrawer();
    });
  }
  onCloseButtonClick(t) {
    let e = t.currentTarget.closest("details");
    this.closeSubmenu(e);
  }
  closeSubmenu(t) {
    let e = t.closest(".submenu-open");
    e && e.classList.remove("submenu-open"),
      t.classList.remove("menu-opening"),
      t.querySelector("summary").setAttribute("aria-expanded", !1),
      removeTrapFocus(t.querySelector("summary")),
      this.closeAnimation(t);
  }
  closeAnimation(t) {
    let e,
      i = (s) => {
        void 0 === e && (e = s);
        let n = s - e;
        n < 400
          ? window.requestAnimationFrame(i)
          : (t.removeAttribute("open"),
            t.closest("details[open]") &&
              trapFocus(
                t.closest("details[open]"),
                t.querySelector("summary")
              ));
      };
    window.requestAnimationFrame(i);
  }
}
customElements.define("menu-drawer", MenuDrawer);
class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }
  openMenuDrawer(t) {
    (this.header = this.header || document.querySelector(".section-header")),
      (this.borderOffset =
        this.borderOffset ||
        this.closest(".header-wrapper").classList.contains(
          "header-wrapper--border-bottom"
        )
          ? 1
          : 0),
      document.documentElement.style.setProperty(
        "--header-bottom-position",
        `${parseInt(
          this.header.getBoundingClientRect().bottom - this.borderOffset
        )}px`
      ),
      this.header.classList.add("menu-open"),
      setTimeout(() => {
        this.mainDetailsToggle.classList.add("menu-opening");
      }),
      t.setAttribute("aria-expanded", !0),
      trapFocus(this.mainDetailsToggle, t),
      document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
  closeMenuDrawer(t, e) {
    super.closeMenuDrawer(t, e), this.header.classList.remove("menu-open");
  }
}
customElements.define("header-drawer", HeaderDrawer);
class ModalDialog extends HTMLElement {
  constructor() {
    super(),
      this.querySelector('[id^="ModalClose-"]').addEventListener(
        "click",
        this.hide.bind(this, !1)
      ),
      this.addEventListener("keyup", (t) => {
        "ESCAPE" === t.code.toUpperCase() && this.hide();
      }),
      this.classList.contains("media-modal")
        ? this.addEventListener("pointerup", (t) => {
            "mouse" !== t.pointerType ||
              t.target.closest("deferred-media, product-model") ||
              this.hide();
          })
        : this.addEventListener("click", (t) => {
            t.target === this && this.hide();
          });
  }
  connectedCallback() {
    this.moved || ((this.moved = !0), document.body.appendChild(this));
  }
  show(t) {
    this.openedBy = t;
    let e = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden"),
      this.setAttribute("open", ""),
      e && e.loadContent(),
      trapFocus(this, this.querySelector('[role="dialog"]')),
      window.pauseAllMedia();
  }
  hide() {
    document.body.classList.remove("overflow-hidden"),
      document.body.dispatchEvent(new CustomEvent("modalClosed")),
      this.removeAttribute("open"),
      removeTrapFocus(this.openedBy),
      window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);
const searchResultsElem = "body";
class ModalOpener extends HTMLElement {
  constructor() {
    super();
    let t = this.querySelector("button");
    if (!t) return;
    t.addEventListener("click", () => {
      let e = document.querySelector(this.getAttribute("data-modal"));
      e && e.show(t);
    });
  }
}
customElements.define("modal-opener", ModalOpener);
class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    let t = this.querySelector('[id^="Deferred-Poster-"]');
    if (!t) return;
    t.addEventListener("click", this.loadContent.bind(this));
  }
  loadContent(t = !0) {
    if ((window.pauseAllMedia(), !this.getAttribute("loaded"))) {
      let e = document.createElement("div");
      e.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(!0)
      ),
        this.setAttribute("loaded", !0);
      let i = this.appendChild(e.querySelector("video, model-viewer, iframe"));
      t && i.focus();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);
class SliderComponent extends HTMLElement {
  constructor() {
    if (
      (super(),
      (this.slider = this.querySelector('[id^="Slider-"]')),
      (this.sliderItems = this.querySelectorAll('[id^="Slide-"]')),
      (this.enableSliderLooping = !1),
      (this.currentPageElement = this.querySelector(
        ".slider-counter--current"
      )),
      (this.pageTotalElement = this.querySelector(".slider-counter--total")),
      (this.prevButton = this.querySelector('button[name="previous"]')),
      (this.nextButton = this.querySelector('button[name="next"]')),
      !this.slider || !this.nextButton)
    )
      return;
    this.initPages();
    let t = new ResizeObserver((t) => this.initPages());
    t.observe(this.slider),
      this.slider.addEventListener("scroll", this.update.bind(this)),
      this.prevButton.addEventListener("click", this.onButtonClick.bind(this)),
      this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }
  initPages() {
    (this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (t) => t.clientWidth > 0
    )),
      this.sliderItemsToShow.length < 2 ||
        ((this.sliderItemOffset =
          this.sliderItemsToShow[1].offsetLeft -
          this.sliderItemsToShow[0].offsetLeft),
        (this.slidesPerPage = Math.floor(
          (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) /
            this.sliderItemOffset
        )),
        (this.totalPages =
          this.sliderItemsToShow.length - this.slidesPerPage + 1),
        this.update());
  }
  resetPages() {
    (this.sliderItems = this.querySelectorAll('[id^="Slide-"]')),
      this.initPages();
  }
  update() {
    if (!this.slider || !this.nextButton) return;
    let t = this.currentPage;
    (this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1),
      this.currentPageElement &&
        this.pageTotalElement &&
        ((this.currentPageElement.textContent = this.currentPage),
        (this.pageTotalElement.textContent = this.totalPages)),
      this.currentPage != t &&
        this.dispatchEvent(
          new CustomEvent("slideChanged", {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.sliderItemsToShow[this.currentPage - 1],
            },
          })
        ),
      this.enableSliderLooping ||
        (this.isSlideVisible(this.sliderItemsToShow[0]) &&
        0 === this.slider.scrollLeft
          ? this.prevButton.setAttribute("disabled", "disabled")
          : this.prevButton.removeAttribute("disabled"),
        this.isSlideVisible(
          this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
        )
          ? this.nextButton.setAttribute("disabled", "disabled")
          : this.nextButton.removeAttribute("disabled"));
  }
  isSlideVisible(t, e = 0) {
    let i = this.slider.clientWidth + this.slider.scrollLeft - e;
    return (
      t.offsetLeft + t.clientWidth <= i &&
      t.offsetLeft >= this.slider.scrollLeft
    );
  }
  onButtonClick(t) {
    t.preventDefault();
    let e = t.currentTarget.dataset.step || 1;
    (this.slideScrollPosition =
      "next" === t.currentTarget.name
        ? this.slider.scrollLeft + e * this.sliderItemOffset
        : this.slider.scrollLeft - e * this.sliderItemOffset),
      this.slider.scrollTo({ left: this.slideScrollPosition });
  }
}
window.addEventListener("DOMContentLoaded", function () {
  let t = document.querySelectorAll(".comparison-slider");
  t.forEach((t) => {
    let e = t.querySelector(".comparison-slider__overlay"),
      i = t.querySelector(".comparison-slider__overlay-under"),
      s = t.querySelector(".comparison-slider__line"),
      n = t.querySelector(".comparison-slider__input");
    n.addEventListener("input", (t) => {
      let n = t.currentTarget.value;
      (e.style.width = n + "%"),
        (i.style.width = 100 - n + "%"),
        (s.style.left = n + "%");
    });
  });
  let e = document.querySelector(".sticky-atc");
  if (e) {
    let i = document.querySelector(".footer ");
    i.style.marginBottom = e.clientHeight - 1 + "px";
  }
  let s = document.querySelector(".sign-up-popup-modal");
  if (s) {
    let n = s.getAttribute("data-test-mode"),
      r = s.getAttribute("data-delay-seconds"),
      a = s.getAttribute("data-delay-days"),
      o = s.getAttribute("data-display-timer"),
      l = s.getAttribute("data-timer-duration"),
      d = document.querySelector(".sign-up-popup-overlay"),
      u = s.querySelector(".popup-modal__close"),
      c = s.querySelector(".popup-modal__dismiss-btn"),
      h = new Date(),
      p = "promo-bar-data-" + window.location.host;
    if ("false" === n) {
      if (null === this.localStorage.getItem(p)) g();
      else {
        let m = JSON.parse(this.localStorage.getItem(p)),
          y = new Date(m.next_display_date);
        h.getTime() > y.getTime() && g();
      }
    } else v();
    function g() {
      setTimeout(function () {
        var t, e, i;
        s.classList.add("popup-modal--active"),
          d.classList.add("popup-overlay--active"),
          v();
        let n =
          ((t = h),
          (e = parseInt(a)),
          (i = new Date(t)).setDate(i.getDate() + e),
          i);
        localStorage.setItem(
          p,
          JSON.stringify({ next_display_date: n, dismissed: !1 })
        );
      }, 1e3 * parseInt(r));
    }
    function v() {
      if ("true" === o) {
        let t = s.querySelector(".popup-modal__timer__minutes"),
          e = s.querySelector(".popup-modal__timer__seconds"),
          i = 60 * parseFloat(l),
          n = Math.floor(i / 60);
        1 === n.toString().length && (n = "0" + n);
        let r = i % 60;
        1 === r.toString().length && (r = "0" + r),
          (t.innerText = n),
          (e.innerText = r),
          setInterval(() => {
            let s = Math.floor((i -= 1) / 60);
            1 === s.toString().length && (s = "0" + s);
            let n = i % 60;
            1 === n.toString().length && (n = "0" + n),
              (t.innerText = s),
              (e.innerText = n),
              i <= 0 && (i = 60 * parseFloat(l) - 45);
          }, 1e3);
      }
    }
    function f() {
      s.classList.remove("popup-modal--active"),
        d.classList.remove("popup-overlay--active");
    }
    d.addEventListener("click", function () {
      f();
    }),
      u.addEventListener("click", function () {
        f();
      }),
      c &&
        c.addEventListener("click", function () {
          f();
        });
  }
}),
  customElements.define("slider-component", SliderComponent);
class SlideshowComponent extends SliderComponent {
  constructor() {
    if (
      (super(),
      (this.sliderControlWrapper = this.querySelector(".slider-buttons")),
      (this.enableSliderLooping = !0),
      !this.sliderControlWrapper)
    )
      return;
    (this.sliderFirstItemNode = this.slider.querySelector(".slideshow__slide")),
      this.sliderItemsToShow.length > 0 && (this.currentPage = 1),
      (this.sliderControlLinksArray = Array.from(
        this.sliderControlWrapper.querySelectorAll(".slider-counter__link")
      )),
      this.sliderControlLinksArray.forEach((t) =>
        t.addEventListener("click", this.linkToSlide.bind(this))
      ),
      this.slider.addEventListener(
        "scroll",
        this.setSlideVisibility.bind(this)
      ),
      this.setSlideVisibility(),
      "true" === this.slider.getAttribute("data-autoplay") &&
        this.setAutoPlay();
  }
  setAutoPlay() {
    (this.sliderAutoplayButton = this.querySelector(".slideshow__autoplay")),
      (this.autoplaySpeed = 1e3 * this.slider.dataset.speed),
      this.sliderAutoplayButton.addEventListener(
        "click",
        this.autoPlayToggle.bind(this)
      ),
      this.addEventListener("mouseover", this.focusInHandling.bind(this)),
      this.addEventListener("mouseleave", this.focusOutHandling.bind(this)),
      this.addEventListener("focusin", this.focusInHandling.bind(this)),
      this.addEventListener("focusout", this.focusOutHandling.bind(this)),
      this.play(),
      (this.autoplayButtonIsSetToPlay = !0);
  }
  onButtonClick(t) {
    super.onButtonClick(t);
    let e = 1 === this.currentPage,
      i = this.currentPage === this.sliderItemsToShow.length;
    (e || i) &&
      (e && "previous" === t.currentTarget.name
        ? (this.slideScrollPosition =
            this.slider.scrollLeft +
            this.sliderFirstItemNode.clientWidth *
              this.sliderItemsToShow.length)
        : i &&
          "next" === t.currentTarget.name &&
          (this.slideScrollPosition = 0),
      this.slider.scrollTo({ left: this.slideScrollPosition }));
  }
  update() {
    super.update(),
      (this.sliderControlButtons = this.querySelectorAll(
        ".slider-counter__link"
      )),
      this.prevButton.removeAttribute("disabled"),
      this.sliderControlButtons.length &&
        (this.sliderControlButtons.forEach((t) => {
          t.classList.remove("slider-counter__link--active"),
            t.removeAttribute("aria-current");
        }),
        this.sliderControlButtons[this.currentPage - 1].classList.add(
          "slider-counter__link--active"
        ),
        this.sliderControlButtons[this.currentPage - 1].setAttribute(
          "aria-current",
          !0
        ));
  }
  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay),
      this.autoplayButtonIsSetToPlay ? this.pause() : this.play(),
      (this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay);
  }
  focusOutHandling(t) {
    let e =
      t.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(t.target);
    this.autoplayButtonIsSetToPlay && !e && this.play();
  }
  focusInHandling(t) {
    let e =
      t.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(t.target);
    e && this.autoplayButtonIsSetToPlay
      ? this.play()
      : this.autoplayButtonIsSetToPlay && this.pause();
  }
  play() {
    this.slider.setAttribute("aria-live", "off"),
      clearInterval(this.autoplay),
      (this.autoplay = setInterval(
        this.autoRotateSlides.bind(this),
        this.autoplaySpeed
      ));
  }
  pause() {
    this.slider.setAttribute("aria-live", "polite"),
      clearInterval(this.autoplay);
  }
  togglePlayButtonState(t) {
    t
      ? (this.sliderAutoplayButton.classList.add("slideshow__autoplay--paused"),
        this.sliderAutoplayButton.setAttribute(
          "aria-label",
          window.accessibilityStrings.playSlideshow
        ))
      : (this.sliderAutoplayButton.classList.remove(
          "slideshow__autoplay--paused"
        ),
        this.sliderAutoplayButton.setAttribute(
          "aria-label",
          window.accessibilityStrings.pauseSlideshow
        ));
  }
  autoRotateSlides() {
    let t =
      this.currentPage === this.sliderItems.length
        ? 0
        : this.slider.scrollLeft +
          this.slider.querySelector(".slideshow__slide").clientWidth;
    this.slider.scrollTo({ left: t });
  }
  setSlideVisibility() {
    this.sliderItemsToShow.forEach((t, e) => {
      let i = t.querySelectorAll("a");
      e === this.currentPage - 1
        ? (i.length &&
            i.forEach((t) => {
              t.removeAttribute("tabindex");
            }),
          t.setAttribute("aria-hidden", "false"),
          t.removeAttribute("tabindex"))
        : (i.length &&
            i.forEach((t) => {
              t.setAttribute("tabindex", "-1");
            }),
          t.setAttribute("aria-hidden", "true"),
          t.setAttribute("tabindex", "-1"));
    });
  }
  linkToSlide(t) {
    t.preventDefault();
    let e =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(t.currentTarget) +
          1 -
          this.currentPage);
    this.slider.scrollTo({ left: e });
  }
}
customElements.define("slideshow-component", SlideshowComponent);
class VariantSelects extends HTMLElement {
  constructor() {
    super(), this.addEventListener("change", this.onVariantChange);
  }
  onVariantChange() {
    this.updateOptions(),
      this.updateMasterId(),
      this.toggleAddButton(!0, "", !1),
      this.updatePickupAvailability(),
      this.removeErrorMessage(),
      this.updateVariantStatuses(),
      this.currentVariant
        ? (this.updateMedia(),
          this.updateURL(),
          this.updateVariantInput(),
          this.renderProductInfo(),
          this.updateShareUrl())
        : (this.toggleAddButton(!0, "", !0), this.setUnavailable());
  }
  updateOptions() {
    this.options = Array.from(this.querySelectorAll("select"), (t) => t.value);
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find(
      (t) => !t.options.map((t, e) => this.options[e] === t).includes(!1)
    );
  }
  updateMedia() {
    if (!this.currentVariant || !this.currentVariant.featured_media) return;
    let t = document.querySelectorAll(
      `[id^="MediaGallery-${this.dataset.section}"]`
    );
    t.forEach((t) =>
      t.setActiveMedia(
        `${this.dataset.section}-${this.currentVariant.featured_media.id}`,
        !0
      )
    );
    let e = document.querySelector(
      `#ProductModal-${this.dataset.section} .product-media-modal__content`
    );
    if (!e) return;
    let i = e.querySelector(
      `[data-media-id="${this.currentVariant.featured_media.id}"]`
    );
    e.prepend(i);
  }
  updateURL() {
    this.currentVariant &&
      "false" !== this.dataset.updateUrl &&
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?variant=${this.currentVariant.id}`
      );
  }
  updateShareUrl() {
    let t = document.getElementById(`Share-${this.dataset.section}`);
    t &&
      t.updateUrl &&
      t.updateUrl(
        `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`
      );
  }
  updateVariantInput() {
    let t = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );
    t.forEach((t) => {
      let e = t.querySelector('input[name="id"]');
      (e.value = this.currentVariant.id),
        (e.dataset.selectedId = this.currentVariant.id),
        e.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
  }
  updateVariantStatuses() {
    let t = this.variantData.filter(
        (t) => this.querySelector(":checked").value === t.option1
      ),
      e = [...this.querySelectorAll(".product-form__input")];
    e.forEach((i, s) => {
      if (0 === s) return;
      let n = [...i.querySelectorAll('input[type="radio"], option')],
        r = e[s - 1].querySelector(":checked").value,
        a = t
          .filter((t) => t.available && t[`option${s}`] === r)
          .map((t) => t[`option${s + 1}`]);
      this.setInputAvailability(n, a);
    });
  }
  setInputAvailability(t, e) {
    t.forEach((t) => {
      e.includes(t.getAttribute("value"))
        ? (t.innerText = t.getAttribute("value"))
        : (t.innerText = window.variantStrings.unavailable_with_option.replace(
            "[value]",
            t.getAttribute("value")
          ));
    });
  }
  updatePickupAvailability() {
    let t = document.querySelector("pickup-availability");
    t &&
      (this.currentVariant && this.currentVariant.available
        ? t.fetchAvailability(this.currentVariant.id)
        : (t.removeAttribute("available"), (t.innerHTML = "")));
  }
  removeErrorMessage() {
    let t = this.closest("section");
    if (!t) return;
    let e = t.querySelector("product-form");
    e && e.handleErrorMessage();
  }
  renderProductInfo() {
    let t = this.currentVariant.id,
      e = this.dataset.originalSection
        ? this.dataset.originalSection
        : this.dataset.section;
    fetch(
      `${this.dataset.url}?variant=${t}&section_id=${
        this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section
      }`
    )
      .then((t) => t.text())
      .then((i) => {
        if (this.currentVariant.id !== t) return;
        let s = new DOMParser().parseFromString(i, "text/html"),
          n = document.getElementById(`price-${this.dataset.section}`),
          r = s.getElementById(
            `price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          a = document.getElementById(`atc-price-${this.dataset.section}`),
          o = s.getElementById(
            `atc-price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          l = document.getElementById(`option-1-price-${this.dataset.section}`),
          d = s.getElementById(
            `option-1-price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          u = document.getElementById(`option-2-price-${this.dataset.section}`),
          c = s.getElementById(
            `option-2-price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          h = document.getElementById(`option-3-price-${this.dataset.section}`),
          p = s.getElementById(
            `option-3-price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          m = document.getElementById(`option-4-price-${this.dataset.section}`),
          y = s.getElementById(
            `option-4-price-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          g = document.getElementById(
            `option-1-variant-${this.dataset.section}`
          ),
          v = s.getElementById(
            `option-1-variant-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          f = document.getElementById(
            `option-2-variant-${this.dataset.section}`
          ),
          b = s.getElementById(
            `option-2-variant-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          S = document.getElementById(
            `option-3-variant-${this.dataset.section}`
          ),
          E = s.getElementById(
            `option-3-variant-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          L = document.getElementById(
            `option-4-variant-${this.dataset.section}`
          ),
          A = s.getElementById(
            `option-4-variant-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          T = s.getElementById(
            `Sku-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          I = document.getElementById(`Sku-${this.dataset.section}`),
          B = s.getElementById(
            `Inventory-${
              this.dataset.originalSection
                ? this.dataset.originalSection
                : this.dataset.section
            }`
          ),
          q = document.getElementById(`Inventory-${this.dataset.section}`);
        r && n && (n.innerHTML = r.innerHTML),
          o && a && (a.innerHTML = o.innerHTML),
          d && l && (l.innerHTML = d.innerHTML),
          c && u && (u.innerHTML = c.innerHTML),
          p && h && (h.innerHTML = p.innerHTML),
          y && m && (m.innerHTML = y.innerHTML),
          v && g && (g.innerHTML = v.innerHTML),
          b && f && (f.innerHTML = b.innerHTML),
          E && S && (S.innerHTML = E.innerHTML),
          A && L && (L.innerHTML = E.innerHTML),
          B && q && (q.innerHTML = B.innerHTML),
          T &&
            I &&
            ((I.innerHTML = T.innerHTML),
            I.classList.toggle(
              "visibility-hidden",
              T.classList.contains("visibility-hidden")
            ));
        let C = document.getElementById(`price-${this.dataset.section}`);
        C && C.classList.remove("visibility-hidden"),
          q && q.classList.toggle("visibility-hidden", "" === B.innerText);
        let w = s.getElementById(`ProductSubmitButton-${e}`);
        this.toggleAddButton(
          !w || w.hasAttribute("disabled"),
          window.variantStrings.soldOut
        ),
          publish(PUB_SUB_EVENTS.variantChange, {
            data: { sectionId: e, html: s, variant: this.currentVariant },
          });
      });
  }
  toggleAddButton(t = !0, e, i = !0) {
    let s = document.getElementById(`product-form-${this.dataset.section}`);
    if (!s) return;
    let n = s.querySelector('[name="add"]'),
      r = s.querySelector('[name="add"] > span');
    if (
      n &&
      (t
        ? (n.setAttribute("disabled", "disabled"), e && (r.textContent = e))
        : (n.removeAttribute("disabled"),
          (r.textContent = window.variantStrings.addToCart)),
      !i)
    )
      return;
  }
  setUnavailable() {
    let t = document.getElementById(`product-form-${this.dataset.section}`),
      e = t.querySelector('[name="add"]'),
      i = t.querySelector('[name="add"] > span'),
      s = document.getElementById(`price-${this.dataset.section}`),
      n = document.getElementById(`Inventory-${this.dataset.section}`),
      r = document.getElementById(`Sku-${this.dataset.section}`);
    e &&
      ((i.textContent = window.variantStrings.unavailable),
      s && s.classList.add("visibility-hidden"),
      n && n.classList.add("visibility-hidden"),
      r && r.classList.add("visibility-hidden"));
  }
  getVariantData() {
    return (
      (this.variantData =
        this.variantData ||
        JSON.parse(
          this.querySelector('[type="application/json"]').textContent
        )),
      this.variantData
    );
  }
}
customElements.define("variant-selects", VariantSelects);
class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }
  setInputAvailability(t, e) {
    t.forEach((t) => {
      e.includes(t.getAttribute("value"))
        ? t.classList.remove("disabled")
        : t.classList.add("disabled");
    });
  }
  updateOptions() {
    let t = Array.from(this.querySelectorAll("fieldset"));
    this.options = t.map(
      (t) =>
        Array.from(t.querySelectorAll("input")).find((t) => t.checked).value
    );
  }
}
customElements.define("variant-radios", VariantRadios);
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let t = (t, e) => {
      t[0].isIntersecting &&
        (e.unobserve(this),
        fetch(this.dataset.url)
          .then((t) => t.text())
          .then((t) => {
            let e = document.createElement("div");
            e.innerHTML = t;
            let i = e.querySelector("product-recommendations");
            i && i.innerHTML.trim().length && (this.innerHTML = i.innerHTML),
              !this.querySelector("slideshow-component") &&
                this.classList.contains("complementary-products") &&
                this.remove(),
              e.querySelector(".grid__item") &&
                this.classList.add("product-recommendations--loaded");
          })
          .catch((t) => {
            console.error(t);
          }));
    };
    new IntersectionObserver(t.bind(this), {
      rootMargin: "0px 0px 400px 0px",
    }).observe(this);
  }
}
customElements.define("product-recommendations", ProductRecommendations);
