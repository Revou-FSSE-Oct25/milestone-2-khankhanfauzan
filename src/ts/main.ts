import { openUsernameModal, closeUsernameModal } from "./modal.ts";
import { updateNavUI, closeMobileMenu } from "./ui.ts";
import {
    checkCurrentUser,
    logout,
    getPendingTarget,
    setPendingTarget,
} from "./auth.ts";
import { renderScoreboard } from "./scoreboard.ts";
import { GamePath } from "./types.ts";

(window as any).checkCurrentUser = checkCurrentUser;
(window as any).logout = logout;

const startGame = (target: string): void => {
    const user = (window as any).getCurrentUser?.();
    if (!user) {
        setPendingTarget(target);
        openUsernameModal();
        return;
    }
    window.location.href = target;
};
(window as any).startGame = startGame;

document.getElementById("usernameSubmit")?.addEventListener("click", () => {
    const input = document.getElementById(
        "usernameInput"
    ) as HTMLInputElement | null;
    const val = input?.value.trim();
    if (!val) {
        document.getElementById("usernameError")?.classList.remove("hidden");
        return;
    }
    (window as any).setCurrentUser?.(val);
    closeUsernameModal();
    updateNavUI();
    const target = getPendingTarget();
    if (target) window.location.href = target;
});

document.getElementById("usernameCancel")?.addEventListener("click", () => {
    closeUsernameModal();
    setPendingTarget(null);
});

document.getElementById("mobileNavToggle")?.addEventListener("click", () => {
    const overlay = document.getElementById("mobileMenuOverlay");
    if (overlay?.classList.contains("hidden")) {
        overlay.classList.remove("hidden");
    } else {
        closeMobileMenu();
    }
});

const initGameButtons = (): void => {
    const gameButtons =
        document.querySelectorAll<HTMLButtonElement>(".btn-play");
    gameButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetPath = button.getAttribute("data-game");
            const isValidGame = Object.values(GamePath).includes(
                targetPath as GamePath
            );
            if (targetPath && isValidGame) {
                startGame(targetPath);
            } else {
                console.error(
                    `Game path tidak valid atau tidak terdaftar: ${targetPath}`
                );
            }
        });
    });
};

window.addEventListener("DOMContentLoaded", () => {
    updateNavUI();
    initGameButtons();
    renderScoreboard("all");
});
