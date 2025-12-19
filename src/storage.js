(function () {
  var STORE_KEY = "revfun_scores_simple";
  var USER_KEY = "revfun_current_user";

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeStore(arr) {
    localStorage.setItem(STORE_KEY, JSON.stringify(arr));
  }

  function findUser(arr, username) {
    var idx = -1;
    for (var i = 0; i < arr.length; i++) {
      if ((arr[i] || {}).username === username) { idx = i; break; }
    }
    return { idx: idx, user: idx >= 0 ? arr[idx] : null };
  }


  window.getCurrentUser = function () {
    var u = localStorage.getItem(USER_KEY);
    if (!u) return null;
    return String(u).trim() || null;
  };

  window.clearCurrentUser = function () {
    localStorage.removeItem(USER_KEY);
  };

  window.setCurrentUser = function (username) {
    var u = String(username || "").trim();
    if (!u) return;
    localStorage.setItem(USER_KEY, u);
    var arr = readStore();
    var f = findUser(arr, u);
    if (!f.user) {
      arr.push({ username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} });
      writeStore(arr);
    }
  };

  window.saveScore = function (gameKey, scoreDelta) {
    var u = window.getCurrentUser();
    if (!u) return;
    var arr = readStore();
    var f = findUser(arr, u);
    var user = f.user || { username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} };
    var s = Number(scoreDelta) || 0;
    user.total = Number(user.total || 0) + s;
    user.games[gameKey] = Number(user.games[gameKey] || 0) + s;
    user.lastDelta = s;
    user.lastDeltaByGame = user.lastDeltaByGame || {};
    user.lastDeltaByGame[gameKey] = s;
    if (f.idx >= 0) arr[f.idx] = user; else arr.push(user);
    writeStore(arr);
  };

  window.getScoreboard = function () {
    var arr = readStore();
    arr.sort(function (a, b) { return Number(b.total || 0) - Number(a.total || 0); });
    return arr;
  };

  window.getScoreboardForGame = function (gameKey) {
    var arr = readStore();
    var filtered = arr
      .map(function (u) {
        var score = Number((u.games || {})[gameKey] || 0);
        return { username: u.username, score: score, lastDelta: Number((u.lastDeltaByGame || {})[gameKey] || 0) };
      })
      .filter(function (i) { return i.score > 0; });
    filtered.sort(function (a, b) { return b.score - a.score; });
    return filtered;
  };
  window.renderScoreboardRow = function (username, score, idx, suffixHtml) {
    var tr = document.createElement("tr");
    tr.className = "bg-neutral-primary border-b border-default";
    var th = document.createElement("th");
    th.scope = "row";
    th.className = "px-6 py-4 font-medium text-heading whitespace-nowrap";
    th.innerHTML = String(username || "") + (idx === 0 ? ' <i class="ri-vip-crown-fill text-yellow-500 ml-2"></i>' : "");
    var td = document.createElement("td");
    td.className = "px-6 py-4";
    td.innerHTML = String(Number(score || 0)) + (suffixHtml || "");
    tr.appendChild(th);
    tr.appendChild(td);
    return tr;
  };
})(); 
