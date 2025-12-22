const STORE_KEY = "revfun_scores_simple";
const USER_KEY = "revfun_current_user";

type UserRecord = {
  username: string;
  total: number;
  games: Record<string, number>;
  lastDelta: number;
  lastDeltaByGame: Record<string, number>;
};

type ScoreRow = {
  username: string;
  score: number;
  lastDelta: number;
};

function readStore(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserRecord[]) : [];
  } catch {
    return [];
  }
}

function writeStore(arr: UserRecord[]): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(arr));
}

function findUser(arr: UserRecord[], username: string): { idx: number; user: UserRecord | null } {
  let idx = -1;
  for (let i = 0; i < arr.length; i++) {
    if ((arr[i] || {}).username === username) { idx = i; break; }
  }
  return { idx, user: idx >= 0 ? arr[idx] : null };
}

export function getCurrentUser(): string | null {
  const u = localStorage.getItem(USER_KEY);
  if (!u) return null;
  return String(u).trim() || null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function setCurrentUser(username: string): void {
  const u = String(username || "").trim();
  if (!u) return;
  localStorage.setItem(USER_KEY, u);
  const arr = readStore();
  const f = findUser(arr, u);
  if (!f.user) {
    arr.push({ username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} });
    writeStore(arr);
  }
}

export function saveScore(gameKey: string, scoreDelta: number): void {
  const u = getCurrentUser();
  if (!u) return;
  const arr = readStore();
  const f = findUser(arr, u);
  const user: UserRecord = f.user || { username: u, total: 0, games: {}, lastDelta: 0, lastDeltaByGame: {} };
  const s = Number(scoreDelta) || 0;
  user.total = Number(user.total || 0) + s;
  user.games[gameKey] = Number(user.games[gameKey] || 0) + s;
  user.lastDelta = s;
  user.lastDeltaByGame = user.lastDeltaByGame || {};
  user.lastDeltaByGame[gameKey] = s;
  if (f.idx >= 0) arr[f.idx] = user; else arr.push(user);
  writeStore(arr);
}

export function getScoreboard(): UserRecord[] {
  const arr = readStore();
  arr.sort((a, b) => Number(b.total || 0) - Number(a.total || 0));
  return arr;
}

export function getScoreboardForGame(gameKey: string): ScoreRow[] {
  const arr = readStore();
  const filtered: ScoreRow[] = arr
    .map((u) => {
      const score = Number((u.games || {})[gameKey] || 0);
      return { username: u.username, score, lastDelta: Number((u.lastDeltaByGame || {})[gameKey] || 0) };
    })
    .filter((i) => i.score > 0);
  filtered.sort((a, b) => b.score - a.score);
  return filtered;
}

export function renderScoreboardRow(username: string, score: number, idx: number, suffixHtml: string): HTMLTableRowElement {
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
}
