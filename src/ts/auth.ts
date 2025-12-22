import { openUsernameModal, closeUsernameModal } from "./modal.ts";
import { updateNavUI, closeMobileMenu } from "./ui.ts";

let pendingTarget: string | null = null;

export const getPendingTarget = () => pendingTarget;
export const setPendingTarget = (target: string | null) => {
    pendingTarget = target;
};

export const checkCurrentUser = (e?: Event): boolean => {
    const currentUser = (window as any).getCurrentUser?.();
    if (!currentUser) {
        e?.preventDefault();
        openUsernameModal();
        return false;
    }
    updateNavUI();
    return true;
};

export const logout = (): void => {
    (window as any).clearCurrentUser?.();
    pendingTarget = null;
    updateNavUI();
    closeMobileMenu();
};
