export const progressBar = (length) => {

    const percent = Math.min(length * 12.5, 100);
    let color = '#77ff00';

    if (length < 4) color = '#ff6f61';
    else if (length < 8) color = '#ffcc00';

    return { width: `${percent}%`, backgroundColor: color };
};