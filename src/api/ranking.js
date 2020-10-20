import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'
/**
 * 排名查询--pc指定商品
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankPcProduct = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankPcProduct', params)
};
/**
 * 排名查询--pc指定店铺
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankPcShopName = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankPcShopName', params);
};


/**
 * 排名查询--pc类目查询
 * @params String skuId
 * @params String sortType
 */
export const rankPcCat = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankPcCat', params);
};


/**
 * 排名查询--h5指定商品
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankH5Product = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankH5Product', params);
};


/**
 * 排名查询--h5指定店铺
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankH5ShopName = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankH5ShopName', params);
};

/**
 * 排名查询--h5指定类目
 * @params String skuId
 * @params String sortType
 */
export const rankH5Cat = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankH5Cat', params);
};

/**
 * 排名查询--微信指定商品
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankWxProduct = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankWxProduct', params);
};


/**
 * 排名查询--微信指定店铺
 * @params String skuId
 * @params String sortType
 * @params String shopName
 */
export const rankWxShopName = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankWxShopName', params);
};

/**
 * 排名查询--京喜指定商品
 * @params String skuId
 * @params String sortType
 * @params String searchKeyword
 */
export const rankJXProduct = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/jxPageRank', params);
};
// yushu-jdapi-v1/rank/

/**
 * 排名查询--京喜指定店铺
 * @params String skuId
 * @params String sortType
 * @params String shopName
 */
export const rankJXShopName = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/jxShopRank', params);
};
/**
 * 排名查询--微信指定类目
 * @params String skuId
 * @params String sortType
 */
export const rankWxCat = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/rankWxCat', params);
};

/**
 * 排名查询--M端指定店铺
 * @params String skuId
 * @params String sortType
 */
export const rankMShopName = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/wxShopRank', params);
};

/**
 * 排名查询--M端指定商品
 * @params String skuId
 * @params String sortType
 */
export const rankMProduct = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/wxPageRank', params);
};


/**
 * 搜索SKU在三级类目下排名
 * @params String skuId
 */
export const skuSalesValues = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/p/salesValues', params);
};
/**
 * 搜索SPU在三级类目下排名
 * @params String skuId
 */
export const spuSalesValues = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/p/spuSalesValues', params);
};
/**
 * 查快车
 * @params String equipment   终端类型，1：PC, 2:手机
 * @params String area   地区，1：当前地区，2：自定义地区
 * @params String areaValue  自定义地区编码
 * @params String pageNo   页码，从1开始，PC端起作用，终端类型为手机时仅返回第一页
 * @params String searchWord   搜索词
 * @params String position   position：位置，终端类型为PC时： 1： 商品精选（京东左侧） 2：商品精选（京东底部） 3：信息流原生 4：商家精选 终端类型为手机时： 1： APP搜索页 2：微信搜索页 3：手Q搜索页 4：京东M端搜索页
 */
export const searchKuaiche = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/p/searchKuaiche', params);
};

/**
 * 单独查看忽略评价数
 * @params String skuId
 */
export const searchIgnoreReview = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/ignoreReview', params);
};

/**
 * 单独查看30天销量
 * @params String skuId
 */
export const searchSales = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/p/search30Sales', params);
};

/**
 * 单独查看总评价数
 * @params String skuId
 */
export const searchTotalReview = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/totalReview', params);
};


/**
 * 查留评率
 * @params String skuId
 */
export const assessAnalysis = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/searchComment', params);
};
/**
 * 获取忽略查留评率
 * @params String skuId
 */
export const getIgnoreComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getIgnoreComment', params);
};

/**
 * 购买忽略查留评率
 * @params String skuId
 */
export const checkIgnoreComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/checkIgnoreComment', params);
};


/**
 * 查看历史记录
 * @params int type 1 销量 2 评价
 * @params int page 页码
 */
export const getSearchHistoryList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/gerenal/getSearchHistoryList', params);
};


/**
 * 增加历史记录
 * @params star    int    加星 0不加 1加
 * @params title    int    流量类型：1Wifi 24G
 * @params type    int    1 销量 2评价
 * @params imgUrl    String    图片链接
 * @params skuId    String    sku
 */
export const addSearchHistory = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/gerenal/addSearchHistory', params);
};

/**
 * 删除历史记录
 * @params id	int	id (列表返回)
 */
export const deleteById = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/gerenal/deleteById', params);
};

/**
 * 加星
 * @params id	int	id (列表返回)
 */
export const clickStar = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/gerenal/clickStar', params);
};

/**
 * 取消加星
 * @params id	int	id (列表返回)
 */
export const cancelStar = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/gerenal/cancelStar', params);
};


/**
 * 判断是否是全球购
 * @params skuId
 */
export const checkIsGlobal = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/gerenal/checkIsGlobal', params);
};

/**
 * 查询单个评论信息
 * @params skuId int
 * @params startDate string
 * @params edndDate string
 */
export const searchDeteleComment = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/searchDeteleComment', params);
};
/**
 * 根据条件查询监控后的删除评价数
 * @params skuId int
 * @params startDate string
 * @params edndDate string
 */
export const searchDeleteCount = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/searchDeleteCount', params);
};
/**
 * 根据条件查询监控后的删除评价数
 * @params skuId int
 * @params startDate string
 * @params edndDate string
 */
export const getIgnoreCommentCount = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi-v1/rank/getIgnoreCommentCount', params);
};
/**
 * 京喜类目查排名
 * @params skuId int
 * @params keywords string
 * @params sortType int
 */
export const jxCategory = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/jxCategory', params);
};
/**
 * 京东国际查排名-PC端指定商品
 */
export const hkRankPcProduct = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/hkRankPcProduct', params);
};
/**
 * 京东国际查排名-APP端指定商品
 */
export const jxPageRank = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/jxPageRank', params);
};
/**
 * 查排名历史记录列表
 */
export const rankRecordList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/rank/rankRecordList', params);
};
/**
 * 收藏查排名历史记录
 */
export const collectRankRecord = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/rank/collectRankRecord', params);
};
/**
 * 删除查排名历史记录
 */
export const deleterankRecord = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/rank/deleterankRecord', params);
}
export const hkRankH5Product = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/hkRankH5Product', params);
};
/**
 * 查排名-历史查询排名
 */
export const listRankHistoryData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/rank/listRankHistoryData', params);
};
/**
 *  cps查询
 * @param skuOrSkuUrl	String 商品sku
 * @param type	Number 统计维度 1:sku 2:spu 
 */
export const cpsSearchBySkuOrSpu = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/cps/cpsSearchBySkuOrSpu', params);
};
/**
 * 行业大盘查询-获取一级目录
 */
export const getFirstCategoroy = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/analyze/getFirstCategoroy', params);
};
/**
 * 行业大盘查询-获取二级目录
 */
export const getSecondCategoroy = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/analyze/getSecondCategoroy', params);
};
/**
 * 行业大盘查询-获取三级目录
 */
export const getThirdCategoroy = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/analyze/getThirdCategoroy', params);
};
/**
 * 行业大盘查询
 */
export const getBigBoardAnalyzeResult = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/analyze/getBigBoardAnalyzeResult', params);
};