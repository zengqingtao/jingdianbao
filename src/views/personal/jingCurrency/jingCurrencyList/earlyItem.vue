<template>
    <div class="rank-list-page">
        <div class="rank-list-title">{{nowDate}}</div>
        <div class="rank-content">
            <el-row>
                <el-col :span="8" class="rank-content-col">
                    <div class="rank-table-title">早到排行</div>
                    <div class="rank-table-item" v-for="(item,index) in tableData" :key="index">
                        <img v-if="index === 0" src="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/1.png" alt="">
                        <img v-else-if="index === 1" src="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/2.png"
                             alt="">
                        <img v-else-if="index === 2" src="https://yushukeji.oss-cn-shenzhen.aliyuncs.com/3.png"
                             alt="">
                        <span v-else>{{index + 1}}</span>
                    </div>
                </el-col>
                <el-col :span="8" class="rank-content-col">
                    <div class="rank-table-title">手机号</div>
                    <div class="rank-table-item" v-for="(item,index) in tableData" :key="index">{{item.phone}}</div>
                </el-col>
                <el-col :span="8" class="rank-content-col">
                    <div class="rank-table-title">今日幸运</div>
                    <div class="rank-table-item" v-for="(item,index) in tableData" :key="index">{{item.prize}}</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import {copyUrl2,getNowDate} from "../../../../utils/common";
    import {getUserShareUrl} from "../../../../api/gold";
    import {getTop10EarliestUser} from "../../../../api/signIn";

    export default {
        data() {
            return {
                tableData: [],
                getGoldGroupToggle: false,
                clickCopyBtn: false,
                nowDate:getNowDate(),
            }
        },
        created(){
            this.getRankList();
        },
        methods: {
            async getRankList(){
                let {data:results} = await getTop10EarliestUser();
                const CALLBACK = {
                    200:()=>{
                        this.tableData = results.data;
                    },
                    "default":()=>{

                    }
                };
                CALLBACK[results.code]?CALLBACK[results.code]():CALLBACK['default']();
            },
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .rank-list-page {
        .rank-list-title {
            color: #333;
            margin-top: 20px;
        }
        .rank-content {
            margin-top: 10px;
            height: 408px;
            border: 1px solid #eee;
            color: #333;
            text-align: center;
            font-size: 14px;
            /deep/ .el-row, .rank-content-col {
                height: 100%;
            }
            .rank-table-title {
                margin-top: 19px;
                margin-bottom: 10px;
            }
            .rank-table-item {
                height: 36px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>