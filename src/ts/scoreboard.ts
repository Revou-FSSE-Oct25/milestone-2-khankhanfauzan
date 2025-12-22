export const renderScoreboard = (filterKey: string): void => {
    const tbody = document.getElementById("scoreboardBody") as HTMLTableSectionElement | null;
    if (!tbody) return;

    tbody.innerHTML = "";
    const data = (window as any).getScoreboard?.() || [];

    const filtered = data.filter((u: any) => {
        if (!filterKey || filterKey === "all") return true;
        return Number(u.games?.[filterKey] || 0) > 0;
    });

    if (filtered.length === 0) {
        const tr = document.createElement("tr");
        tr.className = "bg-neutral-primary";
        tr.innerHTML = `<td colspan="2" class="px-6 py-4 text-center">No scores saved yet.</td>`;
        tbody.appendChild(tr);
        return;
    }

    filtered.forEach((u: any, idx: number) => {
        const tr = (window as any).renderScoreboardRow?.(u.username, (u.total || 0), idx, ' <i class="ri-meteor-fill"></i>');
        if (tr) tbody.appendChild(tr);
    });
};
