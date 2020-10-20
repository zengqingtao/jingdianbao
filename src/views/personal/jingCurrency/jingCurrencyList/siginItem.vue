<template>
    <div class="sign-in">
        <div class="now-date">{{nowDate}}</div>
        <div class="date-group">
            <div class="date-group-header">
                <div class="header-item">一</div>
                <div class="header-item">二</div>
                <div class="header-item">三</div>
                <div class="header-item">四</div>
                <div class="header-item">五</div>
                <div class="header-item">六</div>
                <div class="header-item">七</div>
            </div>
            <div class="date-group-content">
                <div class="date-item" @click="signInSuccess = true"
                     :class="[{'not-now-month':!item.isNowMonth}]"
                     v-for="(item,index) in tableData" :key="index">
                    {{item.day}}
                    <div class="is-sign" v-if="item.isSignIn && !item.prize">已签到</div>
                    <div class="add-gold" v-if="item.prize" :title="item.prize">{{item.prize}}</div>
                </div>
            </div>
        </div>
        <div v-if="canSignIn">
            <div class="btn-group">
                <el-button type="primary" onfocus="this.blur()"  class="--btn-primary" @click="clickSignIn">今日签到</el-button>
            </div>
            <div class="sign-success">
                <div>今天签到后，今天内可在“幸运100%”抽奖一次</div>
            </div>
        </div>
        <transition name="el-fade-in-linear">
            <div v-if="canDraw">
                <div class="btn-group" >
                    <el-button type="primary" onfocus="this.blur()" class="--btn-primary" @click="isSignInOver">去抽奖</el-button>
                </div>
                <div class="sign-success">
                    <i class="iconfont icon-dui"></i>
                    <div>签到成功，快去“幸运100%”抽奖吧！</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import {getNowDate, getDaysInOneMonth, getWeekDay} from "../../../../utils/common";
    import {listMonthCheckIn,userCheckIn} from "../../../../api/signIn";

    export default {
        data() {
            return {
                nowDate: getNowDate(),
                tableData: [],
                signInSuccess: false,
                canSignIn:false,
                canDraw:false,
            }
        },
        created() {
            this.initTableData();
            this.getListMonthCheckIn();
        },
        methods: {
            initTableData() {
                let tableData = [];
                let nowDate = new Date();
                let nowDay = getWeekDay(nowDate.getFullYear(), nowDate.getMonth() + 1);//当前月第一天周几

                let nowAllMonthDay = getDaysInOneMonth(nowDate.getFullYear(), nowDate.getMonth() + 1);
                let prevMonthDay = nowDay - 1; //第一列需要显示上个月的天数
                let prevAllMonthDay = getDaysInOneMonth(nowDate.getFullYear(), nowDate.getMonth() + 1);
                //先添加上个月的日期
                for (let i = 0; i < prevMonthDay; i++) {
                    tableData.push({isNowMonth: false, day: prevAllMonthDay++, isSignIn: false, prize: ''});
                }

                //添加当前月份的日期
                for (let i = 0; i < nowAllMonthDay; i++) {
                    tableData.push({isNowMonth: true, day: i + 1, isSignIn: false, prize: ''});
                }
                //添加下个月的日期
                let nextMonthDay = 7 - tableData.length % 7;//最后一列需要显示下个月的天数
                if (nextMonthDay === 7) nextMonthDay = 0;
                for (let i = 0; i < nextMonthDay; i++) {
                    tableData.push({isNowMonth: false, day: i + 1, isSignIn: false, prize: ''});
                }
                this.tableData = tableData;
            },
            isSignInOver() {
                this.$emit('onSigin');
            },
            async getListMonthCheckIn(){
                let {data:results} = await listMonthCheckIn();
                const CALLBACK = {
                    200:()=>{
                        let nowDateArr = results.data.checkIns;
                        this.canSignIn = results.data.canCheckIn;
                        this.$emit("canSignIn",this.canSignIn)
                        this.canDraw = results.data.canDraw;
                        this.tableData.map(item=>{
                            if(item.isNowMonth){
                                let nowDateItem = nowDateArr.shift();
                                if(nowDateItem){
                                    item.isSignIn = nowDateItem.checkIn;
                                    item.prize = nowDateItem.prize;
                                }
                            }
                        });
                    },
                    'default':()=>{

                    }
                };
                CALLBACK[results.code]?CALLBACK[results.code]():CALLBACK['default']();
            },
            async clickSignIn(){
                let {data:results} = await userCheckIn();
                const CALLBACK = {
                    200:()=>{
                        this.getListMonthCheckIn();
                    },
                    'default':()=>{
                        this.$message({type:"error",message:results.msg});
                    }
                };
                CALLBACK[results.code]?CALLBACK[results.code]():CALLBACK['default']();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .sign-in {
        user-select: none;
        .now-date {
            margin:50px;
            color: #333;
            font-size:16px;
            text-align: center;
        }
        .date-group {
            margin-top: 20px;
            .date-group-header {
                display: flex;
                align-items: center;
                color: #333;
                .header-item {
                    text-align: center;
                    box-sizing: border-box;
                    width: 56px;
                    height: 55px;
                }
            }
            .date-group-content {
                display: flex;
                flex-wrap: wrap;
                color: #333;
                text-align: center;
                min-height: 280px;
                .date-item {
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    &.not-now-month {
                        color: rgba(255, 255, 255, 0.3);
                    }
                    .is-sign {
                        width: 46px;
                        line-height: 20px;
                        background-color: var(--themeColor);
                        border-radius: 2px;
                        font-size: 12px;
                        margin: 5px auto 0;
                        color: #fff;
                    }
                    .add-gold {
                        font-size: 12px;
                        text-align: center;
                        background-color: var(--themeColor);
                        color:#fff;
                        width: 45px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 8px auto 0;
                        line-height: 18px;
                    }
                }
            }
        }
        .btn-group{
            text-align: center;
            /deep/ .el-button{
                width:153px;
                height:41px;
                padding:0
            }
        }
        .sign-success {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--themeColor);
            font-size: 14px;
            margin-top: 20px;
            .icon-dui{
                margin-right: 5px;
            }
        }
    }
</style>