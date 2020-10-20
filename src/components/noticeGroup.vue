<template>
    <transition name="el-fade-in-linear">
        <div v-if="noticeList.length && noticeModalToggle">
            <div class="notice-group">
                <i class="el-icon-close" @click="noticeModalToggle = false"></i>
                <div class="count-down">{{countDown}}</div>
                <div class="notice-list" v-for="(item, index) in noticeList" :key="index">
                    <a :href="item.link" :target="item.target" class="notice-item">
                        <img :src="item.content" alt="">
                    </a>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import {showNotice,checkLogin} from "../api/user";
    import {getCookie,addCookie} from "../utils/cookie";
    import { mapState } from "vuex"
    export default {
        data() {
            return {
                noticeModalToggle: true,
                noticeList: [],
                countDown: 10,
                timer: null,
            }
        },
        created() {
            this.checkUserLogin();
        },
        methods: {
            async checkUserLogin(){
                let {data:results} = await checkLogin();
                if(results.code === 200){
                    this.checkTodayShow();
                }
            },
             getNowDate(){
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            },
            checkTodayShow(){
                if(this.getNowDate()!== getCookie('showNoticeDate')){
                    this.getNoticeData();
                    addCookie('showNoticeDate',this.getNowDate(),999999);
                }
            },
            async getNoticeData() {
                let {data: results} = await showNotice();
                const CALLBACK = {
                    200: () => {
                        this.noticeList = results.data;
                        this.countDownClose();
                    },
                    "default": () => {

                    }
                };
                CALLBACK[results.code] ? CALLBACK[results.code]() : CALLBACK['default']();
            },
            countDownClose() {
                if (!this.noticeList.length) return;
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    if(this.countDown <= 0){
                        clearInterval(this.timer);
                        this.noticeModalToggle = false;
                    }
                    this.countDown --;
                }, 1000);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .notice-group {
        min-height: 50px;
        background-color: rgba(255, 248, 231, 1);
        position: relative;
        z-index: 2000;
        .count-down{
            width: 44px;
            height: 44px;
            background-color: rgba(0,0,0,0.5);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .el-icon-close {
            position: absolute;
            right:5px;
            top: 5px;
            cursor: pointer;
            font-size: 20px;
            width:20px !important;
            height:20px !important;
            line-height: 20px !important;
            text-align: center;
            color:#fff !important;
            background-color:#2d2d2d;
            opacity: .3;
            border-radius: 0 !important;
        }
        .notice-list {
            box-sizing: border-box;
            user-select: none;
            .notice-item {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                color: #333;
                &:last-child {
                    margin-bottom: 0;
                }
                img {
                    width: 100%;
                }
                .notice-content {
                    span {
                        font-weight: bold;
                        color: #e92312;
                    }
                    line-height: 20px;
                }
                .icon-gonggao-1 {
                    margin-right: 5px;
                }
                .icon-dianji- {
                    margin-left: 10px;
                    font-size: 20px;
                }
            }
        }
    }

</style>