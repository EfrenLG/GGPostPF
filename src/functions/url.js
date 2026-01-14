export const url = () => {
    const url = window.location.pathname;
    const parts = url.split('/').filter(Boolean);
    return parts[0];
};