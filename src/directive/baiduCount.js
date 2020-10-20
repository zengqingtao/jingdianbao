import {isRunBuild} from "../utils/checkEnv";

export default {
    bind(el, binding) {
        if (isRunBuild()) {
            el.addEventListener('click', function () {
                _hmt.push(['_trackEvent', binding.value.event, binding.value.value,binding.value.label]);
            })
        }
    }
}