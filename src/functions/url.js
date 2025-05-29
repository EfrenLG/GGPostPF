export const url = () => {
    const url = window.location.href;
    const lastPart = url.substring(url.lastIndexOf('/') + 1);

    return lastPart;
};