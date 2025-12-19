var pendingTarget = null;
function openUsernameModal() {
  var modal = document.getElementById("usernameModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("usernameInput").value = "";
  document.getElementById("usernameError").classList.add("hidden");
  document.getElementById("usernameInput").focus();
}

function closeUsernameModal() {
  var modal = document.getElementById("usernameModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function updateNavUI() {
  var btn = document.querySelector('a#navUserButton');
  var welcomeHeading = document.getElementById('welcomeMessage');
  var mobileWelcome = document.getElementById('mobileWelcomeMessage');
  var mobileWelcomeName = document.getElementById('mobileWelcomeName');
  var mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  var mobilePlayBtn = document.getElementById('mobilePlayBtn');
  var u = window.getCurrentUser && window.getCurrentUser();
  if (u) {
    if (btn) {
      btn.setAttribute('href', '#');
      btn.removeAttribute('onclick');
      btn.onclick = function (e) { e.preventDefault(); logout(); };
      btn.innerHTML = 'Logout';
    }
    if (welcomeHeading) {
      welcomeHeading.textContent = 'Hello, ' + u;
      welcomeHeading.classList.remove('hidden');
    }
    if (mobileWelcome && mobileWelcomeName) {
      mobileWelcomeName.textContent = u;
      mobileWelcome.classList.remove('hidden');
    }
    if (mobilePlayBtn) mobilePlayBtn.classList.add('hidden');
    if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
  } else {
    if (btn) {
      btn.setAttribute('href', '#games');
      btn.removeAttribute('onclick');
      btn.onclick = function (e) { checkCurrentUser(e); };
      btn.innerHTML = 'Lets\n                                    Play!\n                                    <i class="ri-arrow-right-s-line"></i>';
    }
    if (welcomeHeading) {
      welcomeHeading.classList.add('hidden');
    }
    if (mobileWelcome) mobileWelcome.classList.add('hidden');
    if (mobilePlayBtn) mobilePlayBtn.classList.remove('hidden');
    if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
  }
}

function startGame(target) {
  var user = window.getCurrentUser && window.getCurrentUser();
  if (!user) {
    pendingTarget = target;
    openUsernameModal();
    return;
  }
  document.location.href = target;
}

document.getElementById("usernameSubmit").addEventListener("click", function () {
  var val = document.getElementById("usernameInput").value.trim();
  if (!val) {
    document.getElementById("usernameError").classList.remove("hidden");
    return;
  }
  window.setCurrentUser(val);
  closeUsernameModal();
  updateNavUI();
  if (pendingTarget) {
    document.location.href = pendingTarget;
  }
});

document.getElementById("usernameCancel").addEventListener("click", function () {
  closeUsernameModal();
  pendingTarget = null;
});

function renderScoreboard(filterKey) {
  var tbody = document.getElementById("scoreboardBody");
  tbody.innerHTML = "";
  var data = window.getScoreboard ? window.getScoreboard() : [];
  var filtered = data.filter(function (u) {
    if (!filterKey || filterKey === "all") return true;
    return Number((u.games || {})[filterKey] || 0) > 0;
  });
  if (filtered.length === 0) {
    var tr = document.createElement("tr");
    tr.className = "bg-neutral-primary";
    var td = document.createElement("td");
    td.colSpan = 2;
    td.className = "px-6 py-4 text-center text-(--color-secondary-text)";
    td.textContent = "No scores saved yet.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  filtered.forEach(function (u, idx) {
    var tr = window.renderScoreboardRow ? window.renderScoreboardRow(u.username, (u.total || 0), idx, ' <i class="ri-meteor-fill text-amber-500"></i>') : null;
    if (tr) tbody.appendChild(tr);
  });
}

renderScoreboard("all");

window.startGame = startGame;
window.addEventListener('DOMContentLoaded', updateNavUI);

var mobileNavToggle = document.getElementById("mobileNavToggle");
var mobileNavIcon = document.getElementById("mobileNavIcon");
var mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

function openMobileMenu() {
  mobileMenuOverlay.classList.remove("hidden");
  mobileNavIcon.classList.remove("ri-menu-3-line");
  mobileNavIcon.classList.add("ri-close-line");
}

function closeMobileMenu() {
  mobileMenuOverlay.classList.add("hidden");
  mobileNavIcon.classList.add("ri-menu-3-line");
  mobileNavIcon.classList.remove("ri-close-line");
}

if (mobileNavToggle) {
  mobileNavToggle.addEventListener("click", function () {
    if (mobileMenuOverlay.classList.contains("hidden")) openMobileMenu(); else closeMobileMenu();
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

function checkCurrentUser(e) {
  var currentUser = window.getCurrentUser && window.getCurrentUser();
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

window.checkCurrentUser = checkCurrentUser;
window.logout = logout;
var mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

if (mobileLogoutBtn) {
  mobileLogoutBtn.addEventListener('click', function () { logout(); });
}

function mobilePlay() {
  var currentUser = window.getCurrentUser && window.getCurrentUser();
  if (!currentUser) {
    pendingTarget = '#games';
    openUsernameModal();
    return;
  }
  document.location.hash = 'games';
  closeMobileMenu();
}

var mobilePlayBtn = document.getElementById('mobilePlayBtn');

if (mobilePlayBtn) {
  mobilePlayBtn.addEventListener('click', function () { mobilePlay(); });
}
