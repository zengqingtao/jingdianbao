export function formatData(info) {
    let list = [
        "watchCount",
        "clickCount",
        "itemCount",
        "enterItemCount",
        "addCartCount"
    ];
    list.forEach((element) => {
        let number = info[element]
        if (number >= 10000) {
            number = (number / 10000).toFixed(1) + 'w'
            info[element] = number
        }
    });
    return info
}