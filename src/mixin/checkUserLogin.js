import { checkLogin } from "../api/user";

export default {
    data() {
        return {
            isLogin: false
        }
    },
    created() {
        this._checkUserLogin();
    },
    methods: {
        async _checkUserLogin() {
            let { data } = await checkLogin();
            const CALLBACK = {
                200: () => {
                    this.isLogin = true;
                },
                "default": () => {
                    this.openLoginModal();
                }
            };
            CALLBACK[data.code] ? CALLBACK[data.code]() : CALLBACK['default']();
        },
        openLoginModal() {
            this.$store.commit('LOGIN_MODAL_TOGGLE', { toggle: true, loginType: 2 });
        }
    }
}