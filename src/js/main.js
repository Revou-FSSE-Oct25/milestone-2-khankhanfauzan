(function () {
  let pendingTarget = null;

  function openUsernameModal() {
    const modal = document.getElementById("usernameModal");
    const input = document.getElementById("usernameInput");
    const error = document.getElementById("usernameError");
    modal && modal.classList.replace("hidden", "flex");
    if (input) {
      input.value = "";
      input.focus();
    }
    error && error.classList.add("hidden");
  }

  function closeUsernameModal() {
    const modal = document.getElementById("usernameModal");
    modal && modal.classList.replace("flex", "hidden");
  }

  function closeMobileMenu() {
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    const mobileNavIcon = document.getElementById("mobileNavIcon");
    mobileMenuOverlay && mobileMenuOverlay.classList.add("hidden");
    if (mobileNavIcon) {
      mobileNavIcon.classList.add("ri-menu-3-line");
      mobileNavIcon.classList.remove("ri-close-line");
    }
  }

  function updateNavUI() {
    const btn = document.querySelector('a#navUserButton');
    const welcomeHeading = document.getElementById('welcomeMessage');
    const mobileWelcome = document.getElementById('mobileWelcomeMessage');
    const mobileWelcomeName = document.getElementById('mobileWelcomeName');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const mobilePlayBtn = document.getElementById('mobilePlayBtn');
    const u = window.getCurrentUser && window.getCurrentUser();

    if (u) {
      if (btn) {
        btn.setAttribute('href', '#');
        btn.onclick = function (e) { e.preventDefault(); logout(); };
        btn.innerHTML = 'Logout';
      }
      if (welcomeHeading) {
        welcomeHeading.textContent = 'Hello, ' + u;
        welcomeHeading.classList.remove('hidden');
      }
      if (mobileWelcomeName) mobileWelcomeName.textContent = u;
      mobileWelcome && mobileWelcome.classList.remove('hidden');
      mobilePlayBtn && mobilePlayBtn.classList.add('hidden');
      mobileLogoutBtn && mobileLogoutBtn.classList.remove('hidden');
    } else {
      if (btn) {
        btn.setAttribute('href', '#games');
        btn.onclick = function (e) { checkCurrentUser(e); };
        btn.innerHTML = 'Lets Play! <i class="ri-arrow-right-s-line"></i>';
      }
      welcomeHeading && welcomeHeading.classList.add('hidden');
      mobileWelcome && mobileWelcome.classList.add('hidden');
      mobilePlayBtn && mobilePlayBtn.classList.remove('hidden');
      mobileLogoutBtn && mobileLogoutBtn.classList.add('hidden');
    }
  }

  function startGame(target) {
    const user = window.getCurrentUser && window.getCurrentUser();
    if (!user) {
      pendingTarget = target;
      openUsernameModal();
      return;
    }
    document.location.href = target;
  }

  function renderScoreboard(filterKey) {
    const tbody = document.getElementById("scoreboardBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const data = window.getScoreboard ? window.getScoreboard() : [];
    const filtered = data.filter(function (u) {
      if (!filterKey || filterKey === "all") return true;
      return Number((u.games || {})[filterKey] || 0) > 0;
    });
    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      tr.className = "bg-neutral-primary";
      tr.innerHTML = `<td colspan="2" class="px-6 py-4 text-center">No scores saved yet.</td>`;
      tbody.appendChild(tr);
      return;
    }
    filtered.forEach(function (u, idx) {
      const tr = window.renderScoreboardRow ? window.renderScoreboardRow(u.username, (u.total || 0), idx, ' <i class="ri-meteor-fill text-amber-500"></i>') : null;
      if (tr) tbody.appendChild(tr);
    });
  }

  function checkCurrentUser(e) {
    const currentUser = window.getCurrentUser && window.getCurrentUser();
    if (!currentUser) {
      if (e && e.preventDefault) e.preventDefault();
      openUsernameModal();
      return false;
    }
    updateNavUI();
    return true;
  }

  function logout() {
    if (window.clearCurrentUser) window.clearCurrentUser();
    pendingTarget = null;
    updateNavUI();
    closeMobileMenu();
  }

  // Event bindings
  window.addEventListener('DOMContentLoaded', function () {
    updateNavUI();
    renderScoreboard("all");

    const usernameSubmit = document.getElementById("usernameSubmit");
    const usernameCancel = document.getElementById("usernameCancel");

    if (usernameSubmit) {
      usernameSubmit.addEventListener("click", function () {
        const input = document.getElementById("usernameInput");
        const val = (input && input.value || "").trim();
        if (!val) {
          const err = document.getElementById("usernameError");
          err && err.classList.remove("hidden");
          return;
        }
        window.setCurrentUser && window.setCurrentUser(val);
        closeUsernameModal();
        updateNavUI();
        if (pendingTarget) document.location.href = pendingTarget;
      });
    }

    if (usernameCancel) {
      usernameCancel.addEventListener("click", function () {
        closeUsernameModal();
        pendingTarget = null;
      });
    }

    const mobileNavToggle = document.getElementById("mobileNavToggle");
    const mobileNavIcon = document.getElementById("mobileNavIcon");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

    function openMobileMenu() {
      mobileMenuOverlay && mobileMenuOverlay.classList.remove("hidden");
      if (mobileNavIcon) {
        mobileNavIcon.classList.remove("ri-menu-3-line");
        mobileNavIcon.classList.add("ri-close-line");
      }
    }

    if (mobileNavToggle) {
      mobileNavToggle.addEventListener("click", function () {
        if (mobileMenuOverlay && mobileMenuOverlay.classList.contains("hidden")) openMobileMenu(); else closeMobileMenu();
      });
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener("click", function (e) {
        if (e.target && e.target.id === "mobileMenuOverlay") closeMobileMenu();
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll(".mobile-nav-link"), function (el) {
      el.addEventListener("click", function () { closeMobileMenu(); });
    });

    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', function () { logout(); });
    }

    const mobilePlayBtn = document.getElementById('mobilePlayBtn');
    if (mobilePlayBtn) {
      mobilePlayBtn.addEventListener('click', function () {
        const currentUser = window.getCurrentUser && window.getCurrentUser();
        if (!currentUser) {
          pendingTarget = '#games';
          openUsernameModal();
          return;
        }
        document.location.hash = 'games';
        closeMobileMenu();
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-game]'), function (el) {
      el.addEventListener('click', function (e) {
        const target = el.getAttribute('data-game');
        if (!target) return;
        const user = window.getCurrentUser && window.getCurrentUser();
        if (!user) {
          if (e && e.preventDefault) e.preventDefault();
          pendingTarget = target;
          openUsernameModal();
          return;
        }
        document.location.href = target;
      });
    });
  });
})(); 
