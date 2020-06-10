export function useLabel(el: HTMLElement) {
    let lastTime = 0;
    function addLabel(damage: number) {
        const newSpan = document.createElement('span');
        newSpan.innerText = damage.toString();
        newSpan.setAttribute('class', 'damage-span');
        el.appendChild(newSpan);

        const keyframes = [{ bottom: '20px' }, { bottom: '80%' }];
        const options = {
            duration: 1000,
            easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        };
        setTimeout(
            () => {
                lastTime = Date.now();
                newSpan.animate(keyframes, options).onfinish = () => {
                    newSpan.remove();
                };
            },
            Date.now() - lastTime > 50 ? 0 : 50,
        );
    }
    return addLabel;
}
