export const openUsernameModal = (): void => {
    const modal = document.getElementById("usernameModal");
    const input = document.getElementById("usernameInput") as HTMLInputElement | null;
    const error = document.getElementById("usernameError");

    modal?.classList.replace("hidden", "flex");

    if (input) {
        input.value = "";
        input.focus();
    }
    error?.classList.add("hidden");
};

export const closeUsernameModal = (): void => {
    const modal = document.getElementById("usernameModal");
    modal?.classList.replace("flex", "hidden");
};
