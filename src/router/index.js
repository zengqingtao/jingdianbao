import Vue from 'vue'
import Router from 'vue-router'
import { isRunBuild } from '../utils/checkEnv'

Vue.use(Router)
const router = new Router({
    routes: [
        //主页
        {
            path: '/home',
            component: () =>
                import ('@/layout/home/index'),
            children: [{
                    path: '/home',
                    component: () =>
                        import ('@/views/home/index')
                },
                { //数据查询
                    path: '/dataQuery',
                    component: () =>
                        import ('@/views/dataQuery/index'),
                    children: [{ //查排名
                            path: '/dataQuery/ranking',
                            component: () =>
                                import ('@/views/dataQuery/ranking/index')
                        },
                        { //京东国际
                            path: '/dataQuery/JDInternational',
                            component: () =>
                                import ('@/views/dataQuery/jdInternational/index')
                        },
                        { //查销量
                            path: '/dataQuery/salesVolume',
                            component: () =>
                                import ('@/views/dataQuery/salesVolume/index')
                        },
                        { //查权重
                            path: '/dataQuery/weight',
                            component: () =>
                                import ('@/views/dataQuery/weight/index')
                        },
                        { //cps查询
                            path: '/dataQuery/cps',
                            component: () =>
                                import ('@/views/dataQuery/cps/index')
                        },
                        { //查快车
                            path: '/dataQuery/express',
                            component: () =>
                                import ('@/views/dataQuery/express/index')
                        },
                        { //查行业
                            path: '/dataQuery/industry',
                            component: () =>
                                import ('@/views/dataQuery/industry/index')
                        },
                        { //查店铺
                            path: '/dataQuery/shop',
                            component: () =>
                                import ('@/views/dataQuery/shop/index')
                        },
                        { //查单品
                            path: '/dataQuery/singleProduct',
                            component: () =>
                                import ('@/views/dataQuery/singleProduct/index')
                        },
                        { //查流量
                            path: '/dataQuery/flow',
                            component: () =>
                                import ('@/views/dataQuery/flow/index')
                        },
                        { //查评价
                            path: '/dataQuery/evaluate',
                            component: () =>
                                import ('@/views/dataQuery/evaluate/index')
                        },
                        { //关键词查询
                            path: '/dataQuery/keywords',
                            component: () =>
                                import ('@/views/dataQuery/keywords/index')
                        },
                        { //行业大盘查询
                            path: '/dataQuery/industryMarket',
                            component: () =>
                                import ('@/views/dataQuery/industryMarket/index')
                        }
                    ]
                },
                { //数据分析
                    path: '/dataAnalysis',
                    component: () =>
                        import ('@/views/dataAnalysis/index'),
                    children: [{ //秒杀分析
                            path: '/dataAnalysis/secKill',
                            component: () =>
                                import ('@/views/dataAnalysis/secKill/index')
                        },
                        { //搜索分析
                            path: '/dataAnalysis/search',
                            component: () =>
                                import ('@/views/dataAnalysis/search/index')
                        },
                        { //竞品关键词
                            path: '/dataAnalysis/keywords',
                            component: () =>
                                import ('@/views/dataAnalysis/keywords/index')
                        }
                    ]
                },
                { //数据监控
                    path: '/dataMonitoring',
                    component: () =>
                        import ('@/views/dataMonitoring/index'),
                    children: [{ //排名监控
                            path: '/dataMonitoring/rankingMonitoring',
                            component: () =>
                                import ('@/views/dataMonitoring/rankingMonitoring/index')
                        },
                        { //竞品监控
                            path: '/dataMonitoring/competitiveMonitoring',
                            component: () =>
                                import ('@/views/dataMonitoring/competitiveMonitoring/index')
                        },
                        { //删评监控
                            path: '/dataMonitoring/delCommentMonitoring',
                            component: () =>
                                import ('@/views/dataMonitoring/delCommentMonitoring/index'),
                            meta: {
                                level: 1
                            }
                        },
                        { //直播监控
                            path: '/dataMonitoring/liveMonitoring',
                            component: () =>
                                import ('@/views/dataMonitoring/liveMonitoring/index'),
                            meta: {
                                level: 1
                            }
                        },
                        { //流量监控
                            path: '/dataMonitoring/flowMonitoring',
                            component: () =>
                                import ('@/views/dataMonitoring/flowMonitoring/index'),
                            meta: {
                                level: 1
                            }
                        }
                    ]
                },
                { //资讯
                    path: '/information',
                    component: () =>
                        import ('@/views/information/index'),
                    children: [{ //搜索指数榜单
                            path: '/information/searchIndexList',
                            component: () =>
                                import ('@/views/information/searchIndexList/index')
                        },
                        { //带货榜单
                            path: '/information/bringGoodsList',
                            component: () =>
                                import ('@/views/information/bringGoodsList/index')
                        },
                        { //运营攻略
                            path: '/information/operationStrategy',
                            component: () =>
                                import ('@/views/information/operationStrategy/index')
                        },
                        { //搜索书生
                            path: '/information/searchScholars',
                            component: () =>
                                import ('@/views/information/searchScholars/index')
                        },
                    ]
                },
                { //实用工具
                    path: '/utilityTool',
                    component: () =>
                        import ('@/views/utilityTool/utilityTool'),
                }
            ]
        },
        // 个人中心
        {
            path: '/personal',
            component: () =>
                import ('@/layout/personal/index'),
            children: [
                // 个人资料
                {
                    path: '/personal',
                    component: () =>
                        import ('@/views/personal/material/index')
                },
                {
                    path: '/mine',
                    redirect: '/personal'
                },
                // 账户余额
                {
                    path: '/personal/accountBalance',
                    component: () =>
                        import ('@/views/personal/accountBalance/index')
                },
                //京币余额
                {
                    path: '/personal/jingCurrency',
                    component: () =>
                        import ('@/views/personal/jingCurrency/index')
                },
                //消息通知
                {
                    path: '/personal/message',
                    component: () =>
                        import ('@/views/personal/message/index')
                },
            ]
        },
        // 会员中心
        {
            path: '/member',
            component: () =>
                import ('@/layout/member/index'),
            children: [
                // 会员介绍
                {
                    path: '/member',
                    component: () =>
                        import ('@/views/member/introduction')
                },
                // 我的特权
                {
                    path: '/member/privilege',
                    component: () =>
                        import ('@/views/member/privilege/privilege')
                },
                // 邀请兑换
                {
                    path: '/member/memberExchange',
                    component: () =>
                        import ('@/views/member/invitRegister/memberExchange')
                },
                {
                    path: '/member/invitationDetails',
                    component: () =>
                        import ('@/views/member/invitRegister/invitationDetails')
                }
            ]
        },
        // 监控趋势
        {
            path: '/trend',
            component: () =>
                import ('@/views/dataMonitoring/trend/index'),
            children: [{ //排名走势
                    path: '/trend/rankingTrend',
                    component: () =>
                        import ('@/views/dataMonitoring/trend/rankingTrend')
                },
                { //竞品走势
                    path: '/trend/competitiveTrend',
                    component: () =>
                        import ('@/views/dataMonitoring/trend/competitiveTrend')
                },
                { //删评走势
                    path: '/trend/delCommentTrend',
                    component: () =>
                        import ('@/views/dataMonitoring/trend/delCommentTrend')
                },
                { //直播详情/汇总数据
                    path: '/trend/liveDetails',
                    component: () =>
                        import ('@/views/dataMonitoring/liveMonitoring/liveDetails')
                },
                { //流量详情
                    path: '/trend/flowTrend',
                    component: () =>
                        import ('@/views/dataMonitoring/trend/flowTrend')
                }
            ],
        },
        {
            path: '/login',
            component: () =>
                import ('@/views/login/index'),
            children: [{ //登录
                    name: 'login',
                    path: '/login',
                    component: () =>
                        import ('@/views/login/loginPage')
                },
                { //注册
                    path: '/register',
                    component: () =>
                        import ('@/views/login/registerPage')
                },
                { //登录对话框
                    path: '/loginDialog',
                    component: () =>
                        import ('@/views/login/loginDialog')
                }
            ],

        },
        {
            path: '/resetpwd',
            component: () =>
                import ('@/views/login/retrievePassword')
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (isRunBuild()) {
        _hmt.push(['_trackPageview', `/#${to.path}`]);
    }
    next()
})
export default router