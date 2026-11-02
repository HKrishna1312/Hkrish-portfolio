/**
 * Hari Krishna P A — portfolio interactions
 * No dependencies, no build step.
 */
(function () {
  "use strict";

  var config = window.PORTFOLIO_CONFIG || {};
  var caseStudies = window.CASE_STUDIES || {};
  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Small helpers
     --------------------------------------------------------------------- */
  function $(selector, root) {
    return (root || doc).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  function setYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------------------
     Apply site configuration
     --------------------------------------------------------------------- */
  function applyConfig() {
    if (config.email) {
      $$("[data-email-link]").forEach(function (link) {
        link.href = "mailto:" + config.email;
        if (link.classList.contains("info-card__email")) {
          link.textContent = config.email;
        }
      });
      $$("[data-copy-email]").forEach(function (btn) {
        btn.setAttribute("data-copy-email", config.email);
      });
    }

    if (config.socials) {
      $$("[data-social]").forEach(function (link) {
        var key = link.getAttribute("data-social");
        var url = config.socials[key];
        if (!url) return;
        link.href = url;
        if (/^https?:/i.test(url)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      });
    }

    if (config.availability) {
      $$("[data-availability]").forEach(function (badge) {
        var text = badge.lastElementChild;
        if (text) text.textContent = config.availability;
      });
    }

    if (config.resumeUrl) {
      $$('a[href="resume.html"]').forEach(function (link) {
        link.href = config.resumeUrl;
      });
    }
  }

  /* ---------------------------------------------------------------------
     Header, progress bar and active section
     --------------------------------------------------------------------- */
  var header = $("#site-header");
  var progress = $("#scroll-progress");
  var navLinks = $$("[data-nav-link]");
  var sections = $$("main section[id]");
  var scrollQueued = false;

  function updateOnScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }

    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }

    var marker = y + (header ? header.offsetHeight : 80) + 140;
    var currentId = "";

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + y;
      if (top <= marker) currentId = section.id;
    });

    if (y + window.innerHeight >= doc.documentElement.scrollHeight - 4 && sections.length) {
      currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    scrollQueued = false;
  }

  function requestScrollUpdate() {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  function setupReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  function setupMobileNav() {
    var toggle = $("#nav-toggle");
    var panel = $("#mobile-nav");
    if (!toggle || !panel) return;

    var iconUse = toggle.querySelector("use");
    var focusableSelector = 'a[href], button:not([disabled])';
    var main = $("#main");
    var footer = $(".site-footer");

    function setExpanded(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.classList.toggle("is-open", open);
      panel.inert = !open;
      doc.body.classList.toggle("nav-open", open);
      if (main) main.inert = open;
      if (footer) footer.inert = open;
      if (iconUse) {
        iconUse.setAttribute("href", open ? "#i-close" : "#i-menu");
      }
    }

    function openNav() {
      setExpanded(true);
      var first = panel.querySelector(focusableSelector);
      if (first) window.setTimeout(function () { first.focus(); }, 60);
    }

    function closeNav(returnFocus) {
      setExpanded(false);
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) {
        closeNav(true);
      } else {
        openNav();
      }
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a[href]")) closeNav(false);
    });

    doc.addEventListener("keydown", function (event) {
      if (!panel.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeNav(true);
        return;
      }

      if (event.key !== "Tab") return;

      var focusable = $$(focusableSelector, panel).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && panel.classList.contains("is-open")) {
        setExpanded(false);
      }
    });

    window.addEventListener("hashchange", function () {
      if (panel.classList.contains("is-open")) closeNav(false);
    });
  }

  /* ---------------------------------------------------------------------
     Agent terminal replay
     --------------------------------------------------------------------- */
  function setupTerminal() {
    var terminal = $("[data-terminal]");
    if (!terminal) return;

    var lines = $$(".terminal__line", terminal);
    var replay = $("[data-terminal-replay]", terminal);

    function play() {
      if (reduceMotion || !lines.length) return;
      lines.forEach(function (line, index) {
        line.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
        line.animate(
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 380,
            delay: index * 150,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both"
          }
        );
      });
    }

    var hasPlayed = false;

    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting || hasPlayed) return;
            hasPlayed = true;
            play();
            observer.disconnect();
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(terminal);
    }

    if (replay) {
      replay.addEventListener("click", play);
    }
  }

  /* ---------------------------------------------------------------------
     Case study drawer
     --------------------------------------------------------------------- */
  function setupCaseStudies() {
    var dialog = $("#case-dialog");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var panel = $("#case-panel");
    var body = $("#case-body");
    var lastTrigger = null;

    function fill(key) {
      var data = caseStudies[key];
      if (!data) return false;

      $("#case-category").textContent = data.category || "Case study";
      $("#case-title").textContent = data.title || "Project";
      $("#case-summary").textContent = data.summary || "";
      $("#case-problem").textContent = data.problem || "";
      $("#case-solution").textContent = data.solution || "";
      $("#case-contributions").textContent = data.contributions || "";

      var meta = $("#case-meta");
      meta.textContent = "";
      (data.meta || []).forEach(function (entry) {
        var span = doc.createElement("span");
        span.textContent = entry;
        meta.appendChild(span);
      });
      meta.hidden = !(data.meta && data.meta.length);

      var highlights = $("#case-highlights");
      highlights.textContent = "";
      (data.highlights || []).forEach(function (entry) {
        var li = doc.createElement("li");
        li.textContent = entry;
        highlights.appendChild(li);
      });

      var stack = $("#case-stack");
      stack.textContent = "";
      (data.stack || []).forEach(function (entry) {
        var tag = doc.createElement("span");
        tag.className = "tag";
        tag.textContent = entry;
        stack.appendChild(tag);
      });

      return true;
    }

    function openCase(key, pushHistory) {
      if (!fill(key)) return;
      lastTrigger = doc.activeElement;
      dialog.showModal();
      doc.body.classList.add("is-locked");
      if (body) body.scrollTop = 0;

      if (pushHistory) {
        try {
          history.pushState(
            { caseStudy: key },
            "",
            "#case-" + encodeURIComponent(key)
          );
        } catch (error) {
          /* file:// history restrictions — ignore */
        }
      }
    }

    function closeCase(fromHistory) {
      if (!dialog.open) return;
      dialog.close();
      doc.body.classList.remove("is-locked");

      var hash = window.location.hash || "";
      var hasHistoryState = history.state && history.state.caseStudy;

      if (!fromHistory && hash.indexOf("#case-") === 0) {
        if (hasHistoryState) {
          history.back();
        } else {
          try {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          } catch (error) {
            /* ignore */
          }
        }
      }

      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus({ preventScroll: true });
      }
    }

    function keyFromHash() {
      var hash = window.location.hash || "";
      if (hash.indexOf("#case-") !== 0) return "";
      return decodeURIComponent(hash.slice(6));
    }

    function syncFromHash() {
      var key = keyFromHash();
      if (key && caseStudies[key]) {
        if (!dialog.open) {
          openCase(key, false);
        } else {
          fill(key);
        }
      } else if (dialog.open) {
        closeCase(true);
      }
    }

    doc.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-case]");
      if (trigger) {
        event.preventDefault();
        openCase(trigger.getAttribute("data-case"), true);
        return;
      }
      if (event.target.closest("[data-close-case]")) {
        closeCase(false);
      }
    });

    /* Click on the dimmed area closes the drawer. */
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeCase(false);
    });

    /* Native Esc: run our cleanup instead of closing silently. */
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeCase(false);
    });

    window.addEventListener("popstate", syncFromHash);

    if (keyFromHash()) {
      window.setTimeout(syncFromHash, 40);
    }

    /* Expose for the footer/contact links if needed later. */
    window.portfolioOpenCase = openCase;
  }

  /* ---------------------------------------------------------------------
     Copy email + toast
     --------------------------------------------------------------------- */
  function setupCopyEmail() {
    var toast = $("#toast");
    var toastText = $("#toast-text");
    var timeoutId;

    function showToast(message) {
      if (!toast) return;
      if (toastText) toastText.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 3200);
    }

    function fallbackCopy(text) {
      var field = doc.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      doc.body.appendChild(field);
      field.select();
      var copied = false;
      try {
        copied = doc.execCommand("copy");
      } catch (error) {
        copied = false;
      }
      doc.body.removeChild(field);
      return copied;
    }

    $$("[data-copy-email]").forEach(function (button) {
      button.addEventListener("click", function () {
        var email = button.getAttribute("data-copy-email") || config.email || "";
        if (!email) return;

        function done(ok) {
          if (!ok) {
            showToast("Could not copy — email is " + email);
            return;
          }
          var label = button.querySelector("span:last-child");
          if (label) label.textContent = "Copied";
          window.setTimeout(function () {
            if (label) label.textContent = "Copy";
          }, 2000);
          showToast("Email copied — " + email);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(
            function () { done(true); },
            function () { done(fallbackCopy(email)); }
          );
        } else {
          done(fallbackCopy(email));
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Contact form
     --------------------------------------------------------------------- */
  function setupContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    var submit = $("#cf-submit");
    var submitLabel = submit ? submit.querySelector(".btn__label") : null;
    var status = $("#cf-status");
    var fields = {
      name: {
        input: $("#cf-name"),
        error: $("#cf-name-error"),
        validate: function (value) {
          return value.trim().length >= 2 ? "" : "Please enter your name.";
        }
      },
      email: {
        input: $("#cf-email"),
        error: $("#cf-email-error"),
        validate: function (value) {
          var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
          return ok ? "" : "Please enter a valid email address.";
        }
      },
      message: {
        input: $("#cf-message"),
        error: $("#cf-message-error"),
        validate: function (value) {
          return value.trim().length >= 10
            ? ""
            : "Tell me a little more — at least 10 characters.";
        }
      }
    };

    function clearField(field) {
      if (!field.input) return;
      var wrapper = field.input.closest(".field");
      if (wrapper) wrapper.classList.remove("has-error");
      field.input.removeAttribute("aria-invalid");
      if (field.error) field.error.textContent = "";
    }

    function showFieldError(field, message) {
      if (!field.input) return;
      var wrapper = field.input.closest(".field");
      if (wrapper) wrapper.classList.add("has-error");
      field.input.setAttribute("aria-invalid", "true");
      if (field.error) field.error.textContent = message;
    }

    function validateAll() {
      var firstInvalid = null;
      Object.keys(fields).forEach(function (key) {
        var field = fields[key];
        if (!field.input) return;
        var error = field.validate(field.input.value);
        if (error) {
          showFieldError(field, error);
          if (!firstInvalid) firstInvalid = field.input;
        } else {
          clearField(field);
        }
      });
      return firstInvalid;
    }

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field.input) return;
      field.input.addEventListener("input", function () {
        clearField(field);
        if (status && status.classList.contains("is-error")) {
          status.className = "form__status";
          status.textContent = "";
        }
      });
      field.input.addEventListener("blur", function () {
        var error = field.validate(field.input.value);
        if (error) showFieldError(field, error);
      });
    });

    function setStatus(type, message) {
      if (!status) return;
      status.className = "form__status is-visible is-" + type;
      status.textContent = "";

      var icon = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "icon");
      icon.setAttribute("aria-hidden", "true");
      var use = doc.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", type === "success" ? "#i-check" : "#i-close");
      icon.appendChild(use);

      var text = doc.createElement("span");
      text.textContent = message;

      status.appendChild(icon);
      status.appendChild(text);
    }

    function setLoading(loading) {
      if (!submit) return;
      submit.disabled = loading;
      if (submitLabel) {
        submitLabel.textContent = loading ? "Sending…" : "Send Message";
      }
    }

    function mailtoFallback(payload) {
      var subject = payload.subject
        ? payload.subject
        : "Project enquiry from " + payload.name;
      var body =
        "Name: " + payload.name + "\n" +
        "Email: " + payload.email + "\n\n" +
        payload.message;
      var href =
        "mailto:" + (config.email || "1312harikrishna@gmail.com") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus(
        "success",
        "Your email app is opening with the message pre-filled. If nothing happens, write to " +
          (config.email || "1312harikrishna@gmail.com") + " directly."
      );
      window.location.href = href;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) return;

      var firstInvalid = validateAll();
      if (firstInvalid) {
        firstInvalid.focus();
        setStatus("error", "Please fix the highlighted fields and try again.");
        return;
      }

      var payload = {
        name: ($("#cf-name") || {}).value || "",
        email: ($("#cf-email") || {}).value || "",
        subject: ($("#cf-subject") || {}).value || "",
        message: ($("#cf-message") || {}).value || ""
      };

      var endpoint = (config.formspreeEndpoint || "").trim();
      var configured =
        /^https:\/\/formspree\.io\/f\/[A-Za-z0-9_-]+\/?$/.test(endpoint);

      if (!configured) {
        mailtoFallback(payload);
        return;
      }

      setLoading(true);
      if (status) {
        status.className = "form__status";
        status.textContent = "";
      }

      var data = new FormData();
      data.append("name", payload.name);
      data.append("email", payload.email);
      data.append("subject", payload.subject);
      data.append("message", payload.message);
      data.append("_subject", "Portfolio enquiry — " + payload.name);

      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            var detail = "";
            if (result.body && result.body.errors && result.body.errors.length) {
              detail = result.body.errors
                .map(function (error) { return error.message; })
                .join(" ");
            }
            throw new Error(detail || "The form service could not accept the message.");
          }
          form.reset();
          Object.keys(fields).forEach(function (key) { clearField(fields[key]); });
          setStatus(
            "success",
            "Message sent. Thanks for reaching out — I'll get back to you shortly."
          );
        })
        .catch(function (error) {
          setStatus(
            "error",
            (error && error.message ? error.message : "Something went wrong.") +
              " You can also email " + (config.email || "me") + " directly."
          );
        })
        .then(function () {
          setLoading(false);
        });
    });
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    applyConfig();
    setYear();
    setupReveal();
    setupMobileNav();
    setupTerminal();
    setupCaseStudies();
    setupCopyEmail();
    setupContactForm();

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateOnScroll();

    doc.documentElement.classList.add("js-ready");
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
