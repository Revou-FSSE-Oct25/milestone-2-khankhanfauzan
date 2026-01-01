import { checkCurrentUser, logout } from "./auth.ts";

export const closeMobileMenu = (): void => {
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    const mobileNavIcon = document.getElementById("mobileNavIcon");

    mobileMenuOverlay?.classList.add("hidden");
    mobileNavIcon?.classList.replace("ri-close-line", "ri-menu-3-line");
};

export const updateNavUI = (): void => {
    const btn = document.querySelector(
        "a#navUserButton"
    ) as HTMLAnchorElement | null;
    const welcomeHeading = document.getElementById("welcomeMessage");
    const mobileWelcome = document.getElementById("mobileWelcomeMessage");
    const mobileWelcomeName = document.getElementById("mobileWelcomeName");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    const mobilePlayBtn = document.getElementById("mobilePlayBtn");

    const u = (window as any).getCurrentUser?.();

    if (u) {
        if (btn) {
            btn.href = "#";
            btn.onclick = (e: MouseEvent) => {
                e.preventDefault();
                logout();
            };
            btn.innerHTML = "Logout";
        }
        if (welcomeHeading) {
            welcomeHeading.textContent = `Hello, ${u}`;
            welcomeHeading.classList.remove("hidden");
        }
        if (mobileWelcomeName) mobileWelcomeName.textContent = u;
        mobileWelcome?.classList.remove("hidden");
        mobilePlayBtn?.classList.add("hidden");
        mobileLogoutBtn?.classList.remove("hidden");
    } else {
        if (btn) {
            btn.href = "#games";
            btn.onclick = (e: MouseEvent) => checkCurrentUser(e);
            btn.innerHTML = 'Lets Play! <i class="ri-arrow-right-s-line"></i>';
        }
        welcomeHeading?.classList.add("hidden");
        mobileWelcome?.classList.add("hidden");
        mobilePlayBtn?.classList.remove("hidden");
        mobileLogoutBtn?.classList.add("hidden");
    }
};
