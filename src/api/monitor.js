import { ajaxGet, ajaxPost } from "../utils/ajax";
import config from '../config'

/**
 * 新增商品监控
 * @params saerchWord    搜索关键词
 * @params skuId
 * @params sortType  排序类型， 1综合排序 2销量排序 3评价排序 4新品排序 5价格排序
 * @params rankType  监控类型： 1 自有 2竞品
 */
export const addItemMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/addItemMonitor', params);
};

/**
 * 新增店铺监控
 * @params saerchWord    搜索关键词
 * @params shopName     店铺名称
 * @params sortType  排序类型， 1综合排序 2销量排序 3评价排序 4新品排序 5价格排序
 * @params rankType  监控类型： 1 自有 2竞品
 */
export const addShopMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/addShopMonitor', params);
};

/**
 * 新增类目监控
 * @params skuId
 * @params sortType  排序类型， 1综合排序 2销量排序 3评价排序 4新品排序 5价格排序
 * @params rankType  监控类型： 1 自有 2竞品
 */
export const addCatMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/addCatMonitor', params);
};

/**
 * 取消监控
 * @params id     取消监控维度时,传监控的ID
 * @params skuId
 */
export const cancelMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/cancelMonitor', params);
};
/**
 * 获取近三十天监控趋势数据(已废弃)
 * @params id     取消监控维度时,传监控的ID
 */
export const getMonitorData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-server/monitor/getMonitorData', params);
};
/**
 * 获取近监控趋势数据(可选7-15-30天数据)
 * @params monitorId     取消监控维度时,传监控的ID
 * @params num 天数
 */
export const searchTrendImageNew = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-data/data/monitor/searchTrendImageNew', params);
};


/**
 * 查看自有商品监控列表
 * @params page
 * @params skuId
 */
export const getListSelfItemMonitors = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/listSelfItemMonitors', params);
};


/**
 * 查看竞品商品监控列表
 * @params page
 * @params skuId
 */
export const getListCompetitorItemMonitors = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/listCompetitorItemMonitors', params);
};

/**
 * 关键词移动位置
 * @params page
 * @params skuId
 */
export const changePosition = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/changePosition', params);
};

/**
 * 刷新监控数据
 * @params skuId
 * @params monitorId 按监控维度刷新时传监控ID
 */
export const freshMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/freshMonitor', params);
};


/**
 * 置顶(取消)监控
 * @params top  1-置顶 0-取消置顶
 * @params skuId
 * @params monitorId 按监控维度刷新时传监控ID
 */
export const topMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/monitor/topMonitor', params);
};

/**
 * 查看监控标题变化趋势
 * @params id 监控ID
 */
export const getMonitorTitleData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorTitleData', params);
};

/**
 * 查看监控广告语变化趋势
 * @params id 监控ID
 */
export const getMonitorAdvertData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorAdvertData', params);
};

/**
 * 查看监控价格变化趋势
 * @params id 监控ID
 */
export const getMonitorPriceData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorPriceData', params);
};
/**
 * 查看监控优惠变化趋势
 * @params id 监控ID
 */
export const getMonitorPromotionsData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorPromotionsData', params);
};


/**
 * 查看总评价变化趋势
 * @params id 监控ID
 */
export const getMonitorCommentData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorCommentData', params);
};

/**
 * 查看忽略评价变化趋势
 * @params id 监控ID
 */
export const getMonitorIgnoreCommentData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorIgnoreCommentData', params);
};
/**
 * 查看好评变化趋势
 * @params id 监控ID
 */
export const getMonitorGoodCommentsData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorGoodCommentsData', params);
};
/**
 * 查看中评变化趋势
 * @params id 监控ID
 */
export const getMonitorNormalCommentsData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorNormalCommentsData', params);
};

/**
 * 查看差评变化趋势
 * @params id 监控ID
 */
export const getMonitorBadCommentsData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorBadCommentsData', params);
};
/**
 * 查看晒单变化趋势
 * @params id 监控ID
 */
export const getMonitorPicCommentsData = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/getMonitorPicCommentsData', params);
};

/**
 * 添加删评监控功能
 * @params skuId sku
 */
export const addDeleteCommentMonitor = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/addDeleteCommentMonitor', params);
};
/**
 * 根据用户userId查询所有的监控删评
 * @params userId 用户Id
 */
export const searchDeleteMonitor = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/searchDeleteMonitor', params);
};
/**
 * 根据用户SKU搜索监控删评
 * @params skuId skuId
 */
export const searchDeleteCommetAll = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/searchDeleteCommetAll', params);
};
/**
 * 取消指定skuId的删除评论监控
 * @params skuId skuId
 */
export const deleteCancel = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/deleteCancel', params);
};
/**
 *删除评论监控取消置顶
 * @params skuId skuId
 * @params top int	是否置顶，1是，0不是
 */
export const deleteTop = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-jdapi/api/deleteTop', params);
};
/**
 *排名监控分组列表
 */
export const listGroups = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/listGroups', params);
};
/**
 *排名监控新增/编辑分组（groupId为null时是新增，否则是编辑）
 *@params groupId Number   要编辑分组的编号（编辑时传）
 *@params groupName String 分组名称   
 */
export const addRankMonitorGroup = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/addRankMonitorGroup', params);
};
/**
 *排名监控-删除分组
 *@params groupId Number 对应分组的编号
 */
export const deleteRankGroup = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/deleteGroup', params);
};
/**
 *排名监控-移动监控到分组
 *@params sku Number 需要移动监控的对应sku
 *@params groupId Number 对应分组的编号
 */
export const moveGroupRank = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/moveToGroup', params);
};
/**
 *排名监控-将失效分组监控添加到默认分组
 *@params skuId Number skuId
 */
export const selfRankInvalidMoveToDefault = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/selfRankInvalidMoveToDefault', params);
};
/**
 *竞品监控-获取监控分组列表
 */
export const listCompetingGroups = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/listCompetingGroups', params);
};
/**
 *@description 竞品监控-新增分组
 *@params groupName : 分组名
 */
export const addCompetingMonitorGroup = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/addCompetingMonitorGroup', params);
};
/**
 *@description 竞品监控-删除分组
 *@params groupName : 分组名
 */
export const deleteCompetingGroup = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/deleteCompetingGroup', params);
};
/**
 *@description 竞品监控-移动分组
 *@params groupId String 分组Id
 *@params monitorId Number 监控Id
 *@params sku String 监控的sku
 */
export const moveCompetingMonitorToGroup = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/moveCompetingMonitorToGroup', params);
};
/**
 *@description 竞品监控-将已失效分组的数据移动到默认分组
 *@params monitorId String 监控Id
 */
export const invalidCompetingMoveToDefault = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/monitor/invalidCompetingMoveToDefault', params);
};
/**
 *@description 删除监控-将已失效分组的数据移动到默认分组
 *@params skuId String 监控的sku
 */
export const validDeleteCommentMonitor = (params = {}) => {
        return ajaxGet(config.serverUrl + 'yushu-jdapi/api/validDeleteCommentMonitor', params);
    }
    /*
    @description 直播监控 - 添加监控
    @params darenUrl String: 达人主页链接
    @params liveUrl String: 直播链接 
    */
export const addJdLiveMonitor = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/addJdLiveMonitor', params);
};
/**
 *@description 直播监控-获取直播监控信息
 */
export const getJdLiveMonitor = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/getJdLiveMonitor', params);
};
/**
 *@description 直播监控-获取直播场次列表
 *@params monitorId Number:监控Id
 *@params page Number:页码
 *@params size Number：每页最大条数
 */
export const listLiveMonitorByUserId = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/listLiveMonitorByUserId', params);
};
/**
 *@description 直播监控-删除监控
 @params monitorId Number:监控Id
 */
export const deleteMonitor = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/deleteMonitor', params);
};
/**
 *@description 直播监控-获取直播单个场次数据详情
 *@params monitorId Number:监控Id
 *@params liveId Number:直播Id
 */
export const getLiveDetail = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/getLiveDetail', params);
};
/**
 *@description 直播监控-获取直播单个场次汇总数据详情
 *@params monitorId Number:监控Id
 */
export const getLiveStatisticsDetail = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/jdLiveMonitor/getLiveStatisticsDetail', params);
};
/**
 *@description 流量监控-添加商品监控
 *@params sku: 监控的商品sku
 */
export const addFlowMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/flowMonitor/addFlowMonitor', params);
};
/**
 *@description 获取流量监控商品列表
 *@params sku: 监控的商品sku
 */
export const getFlowMonitorList = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/flowMonitor/getFlowMonitorList2', params);
};
/**
 *@description 流量监控-获取某个商品的监控详情
 *@params flowMonitorId: 流量监控编号
 */
export const getFlowMonitorDetail = (params = {}) => {
    return ajaxGet(config.serverUrl + 'yushu-composite/flowMonitor/getFlowMonitorDetail', params);
};
/**
 *@description 取消流量监控
 *@params flowMonitorId: 流量监控编号
 */
export const cancelFlowMonitor = (params = {}) => {
    return ajaxPost(config.serverUrl + 'yushu-composite/flowMonitor/cancelFlowMonitor', params, 'form-data');
};