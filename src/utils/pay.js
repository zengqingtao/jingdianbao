/**
 *
 * @param aliPayUrl 后端返回的支付表单
 * @param isNewTab  是否跳转到新页面
 */
export const aliPay = (aliPayUrl, isNewTab = false) => {
    let aliPayBox = document.getElementById('aliPayForm');
    if (isNewTab) aliPayUrl = aliPayUrl.replace('<form', '<form target="_blank"');
    const div = document.createElement('div'); // 创建div
    div.id = 'aliPayForm';

    if (aliPayBox) {
        aliPayBox.removeChild(document.querySelector('#aliPayForm form'));
        aliPayBox.innerHTML = aliPayUrl;
        document.querySelector('#aliPayForm form').submit();
        return;
    }
    div.innerHTML = aliPayUrl; // 将返回的form 放入div
    document.body.appendChild(div);
    document.querySelector('#aliPayForm form').submit();
};