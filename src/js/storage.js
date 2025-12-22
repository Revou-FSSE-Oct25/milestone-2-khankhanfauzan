(function () {
    const STORE_KEY = "revfun_scores_simple";
    const USER_KEY = "revfun_current_user";

    function readStore() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function writeStore(arr) {
        localStorage.setItem(STORE_KEY, JSON.stringify(arr));
    }

    function findUser(arr, username) {
        let idx = -1;
        for (let i = 0; i < arr.length; i++) {
            if ((arr[i] || {}).username === username) { idx = i; break; }
        }
        return { idx, user: idx >= 0 ? arr[idx] : null };
    }

    window.getCurrentUser = function () {
        const u = localStorage.getItem(USER_KEY);
        if (!u) return null;
        return String(u).trim() || null;
    };

    window.clearCurrentUser = function () {
        localStorage.removeItem(USER_KEY);
    };

    window.setCurrentUser = function (username) {
        const u = String(username || "").trim();
        if (!u) return;
        localStorage.setItem(USER_KEY, u);
        const arr = readStore();
        const f = findUser(arr, u);
        if (!f.user) {
            arr.push({ username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} });
            writeStore(arr);
        }
    };

    window.saveScore = function (gameKey, scoreDelta) {
        const u = window.getCurrentUser();
        if (!u) return;
        const arr = readStore();
        const f = findUser(arr, u);
        const user = f.user || { username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} };
        const s = Number(scoreDelta) || 0;
        user.total = Number(user.total || 0) + s;
        user.games[gameKey] = Number(user.games[gameKey] || 0) + s;
        user.lastDelta = s;
        user.lastDeltaByGame = user.lastDeltaByGame || {};
        user.lastDeltaByGame[gameKey] = s;
        if (f.idx >= 0) arr[f.idx] = user; else arr.push(user);
        writeStore(arr);
    };

    window.getScoreboard = function () {
        const arr = readStore();
        arr.sort(function (a, b) { return Number(b.total || 0) - Number(a.total || 0); });
        return arr;
    };

    window.getScoreboardForGame = function (gameKey) {
        const arr = readStore();
        const filtered = arr
            .map(function (u) {
                const score = Number((u.games || {})[gameKey] || 0);
                return { username: u.username, score: score, lastDelta: Number((u.lastDeltaByGame || {})[gameKey] || 0) };
            })
            .filter(function (i) { return i.score > 0; });
        filtered.sort(function (a, b) { return b.score - a.score; });
        return filtered;
    };
    window.renderScoreboardRow = function (username, score, idx, suffixHtml) {
        const tr = document.createElement("tr");
        tr.className = "bg-neutral-primary border-b border-default";
        const th = document.createElement("th");
        th.scope = "row";
        th.className = "px-6 py-4 font-medium text-heading whitespace-nowrap";
        th.innerHTML = String(username || "") + (idx === 0 ? ' <i class="ri-vip-crown-fill text-yellow-500 ml-2"></i>' : "");
        const td = document.createElement("td");
        td.className = "px-6 py-4";
        td.innerHTML = String(Number(score || 0)) + (suffixHtml || "");
        tr.appendChild(th);
        tr.appendChild(td);
        return tr;
    };
})(); 
