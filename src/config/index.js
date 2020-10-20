import { isRunBuild, isRunBuildOsType, isRunTestBuild, isRunDev } from "../utils/checkEnv";

let config = {};
//npm run build
if (isRunBuild()) {
    config = {
        serverUrl: 'https://api.jingdianbao.cn/',
        osType: 1,
        jkjsUrl: 'https://jkjs.jingdianbao.cn/#/',
        skbUrl: 'https://skb.jingdianbao.cn/#/',
        rqbUrl: 'https://rqb.jingdianbao.cn/#/',
        ggbUrl: 'https://ggb.jingdianbao.cn/#/',
        rzbUrl: 'https://rzb.jingdianbao.cn/#/',
        dxbUrl: 'https://dxb.jingdianbao.cn/#/',
        fwbUrl: 'https://fwb.jingdianbao.cn/#/',
        jdcmUrl: 'https://jdcm.jingdianbao.cn.cn/#/',
        ypkUrl: 'https://www.jdyoupinku.com/#/',
        jdbUrl: "http://www.jingdianbao.cn ",
        dzgjUrl: "https://jdcm.jingdianbao.cn/#/"
    }
}
//npm run test
else if (isRunTestBuild()) {
    config = {
        serverUrl: 'https://local.yushutec.com:18443/jdb_api/',
        osType: 1,
        jkjsUrl: 'https://local.yushutec.com:18443/jkjs/#/',
        skbUrl: 'https://skb.yushutec.xyz/#/',
        rqbUrl: 'https://local.yushutec.com:18443/rqb/#/',
        ggbUrl: 'https://local.yushutec.com:18443/ggb/#/',
        rzbUrl: 'https://rzb.yushutec.xyz/#/',
        dxbUrl: 'https://dxb.yushutec.xyz/#/',
        fwbUrl: 'https://fwb.yushutec.xyz/#/',
        jdcmUrl: 'http://t.api.jingdianbao.cn:9022/#/',
        ypkUrl: 'https://local.yushutec.com:18443/ypk/#/',
        jdbUrl: "https://local.yushutec.com:18443/jdb/#/",
        dzgjUrl: "https://local.yushutec.com:18443/jdcm/#/"
    }
}
//本地开发环境
else if (isRunDev()) {
    config = {
        serverUrl: 'https://local.yushutec.com:18443/jdb_api/',
        osType: 1,
        jkjsUrl: 'https://local.yushutec.com:18443/jkjs/#/',
        skbUrl: 'http://t.api.jingdianbao.cn:9027/#/',
        rqbUrl: 'https://local.yushutec.com:18443/rqb/#/',
        ggbUrl: 'https://local.yushutec.com:18443/ggb/#/',
        rzbUrl: 'https://rzb.yushutec.xyz/#/',
        dxbUrl: 'https://dxb.yushutec.xyz/#/',
        fwbUrl: 'http://t.api.jingdianbao.cn:9026/#/',
        jdcmUrl: 'http://t.api.jingdianbao.cn:9022/#/',
        ypkUrl: 'https://local.yushutec.com:18443/ypk/#/',
        jdbUrl: "https://local.yushutec.com:18443/jdb/#/home",
        dzgjUrl: "https://local.yushutec.com:18443/jdcm/#/"
    }
}
//npm run build -- (os-type)
else if (isRunBuildOsType()) {
    config = {
        serverUrl: 'https://t.api.jingdianbao.cn/',
        osType: isRunBuildOsType(),
        jkjsUrl: 'https://jkjs.yushutec.xyz/#',
        skbUrl: 'https://skb.yushutec.xyz/#/',
        rqbUrl: 'https://rqb.yushutec.xyz/#/',
        ggbUrl: 'https://ggb.yushutec.xyz/#/',
        rzbUrl: 'https://rzb.yushutec.xyz/#/',
        dxbUrl: 'https://dxb.yushutec.xyz/#/',
        fwbUrl: 'https://fwb.yushutec.xyz/#/',
        jdcmUrl: 'https://jdcm.yushutec.xyz/#/',
        ypkUrl: 'https://www.jdyoupinku.com/#/',
        jdbUrl: "http://www.jingdianbao.cn",
        dzgjUrl: "https://jdcm.jingdianbao.cn/#/"
    }
}

export default config;