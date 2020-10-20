<template>
    <div class="service" @click.self="closeServiceModal">
        <div class="service-content">
            <div>
                <div class="iconfont icon-guanbi service-close-btn" @click="closeServiceModal"></div>
                <div class="service-title">软件许可协议</div>
                <div class="service-explain">
                    在订购使用京店宝服务之前，请您仔细阅读下述许可协议条款。一旦您点击确认本协议，即表示您已接受了以下所述的条款和条件，同意受本协议约束。如果您不同意接受全部的条款和条件，那么您将无法订购使用京店宝服务。
                </div>
                <div class="service-row-title">一、概述</div>
                <div class="service-row-content">
                    本许可协议的缔约方为京店宝和用户（“您”），本许可协议具有合同效力。本协议是缔约方就用户购买使用京店宝开发的服务软件和相关服务（本协议中统称“服务”）的协议。
                </div>
                <div class="service-row-title">二、服务订购方式</div>
                <div class="service-row-content">
                    2.1 用户需凭其根据京东网注册流程合法注册并取得的京东网用户名和密码访问京店宝，并订购使用服务。对于用户通过其他手段登录、使用所造成的后果，京店宝将不承担任何责任。
                </div>
                <div class="service-row-content">
                    2.2 京店宝根据用户登录名和密码来确认使用京店宝服务的用户身份。用户应妥善保管用户登录名及密码，并对其使用及其遗失自行承担责任。
                </div>
                <div class="service-row-content">
                    2.3 用户使用京店宝服务，授权京东网用户名和密码给京店宝及授权京店宝使用用户店铺相关数据，提供给用户使用。
                </div>
                <div class="service-row-content">
                    2.4 京店宝需对用户提供的京东网密码进行加密。
                </div>
                <div class="service-row-title">三、软件许可费</div>
                <div class="service-row-content">
                    3.1 用户订购京店宝服务，应当按约向京店宝支付软件许可费。
                </div>
                <div class="service-row-content">
                    3.2 京店宝可向用户免费提供应用服务的使用许可。提供免费的应用服务不应视为京店宝放弃收费的权利。
                </div>
                <div class="service-row-content">
                    3.3 用户向京店宝支付的费用是不含税的，用户需自行承担税费。
                </div>
                <div class="service-row-content">
                    3.4 本产品为虚拟服务产品，网站充值仅用于平台产品消耗，不支持退款和提现。
                </div>
                <div class="service-row-title">四、用户的权利和义务</div>
                <div class="service-row-content">
                    4.1 用户保证其使用京店宝服务的各项行为均符合国家法律法规的规定，其通过服务所从事的一切活动都是合法的、真实的，不侵害京店宝和任何第三方的合法权益，包括但不限于：
                </div>
                <div class="service-row-content text-intent-4">
                    （1）禁止出售、转售或复制、开发京店宝授予的使用权限；
                </div>
                <div class="service-row-content text-intent-4">
                    （2）禁止复制和模仿京店宝的设计理念、界面、功能和图表；
                </div>
                <div class="service-row-content text-intent-4">
                    （3）禁止未经京店宝许可基于京店宝服务或其内容进行修改或制造派生其他产品；
                </div>
                <div class="service-row-content">
                    4.2 用户不得对京店宝服务和/或京店宝服务任何部分（软件产品、页面标识、服务品牌、资讯、信息）进行复制、翻译、修改、适应、增强、反编译、反汇编、反向工程、分解拆卸、出售、转租或作任何商业目的的使用。用户同意约束其有必要使用京店宝服务的员工、代理、咨询者或顾问遵守前述之义务，并就其违反前述规定的行为对京店宝负责就如同用户自身违反一样。
                </div>
                <div class="service-row-content">
                    4.3 用户应按时足额向京店宝支付软件许可费用，否则京店宝保留随时终止用户关于京店宝服务使用许可的权利，并对因终止协议而可能造成的损害不承担任何责任。
                </div>
                <div class="service-row-content">
                    4.4用户承诺通过京店宝服务进行的活动所引发的一切法律后果，由用户承担全部责任。如因用户使用京店宝服务的行为，导致京店宝或任何第三方为此承担了相关的责任，则用户需全额赔偿京店宝或任何第三方的相关支出及损失，包括合理的律师费用。
                </div>
                <div class="service-row-content">
                    4.5 用户同意在使用京店宝服务的同时，接受京店宝提供的各类信息服务。
                </div>
                <div class="service-row-content">
                    4.6 用户理解并同意，京店宝服务因现有技术限制，可能存在瑕疵，因使用京店宝服务所致的任何损害，用户同意责任人的最高赔偿限额不应超过用户向京店宝支付的许可费用。如因网络问题或产品瑕疵导致京店宝服务无法按指定的时间正常使用的，则用户了解并同意，京店宝或其它责任人所需承担的唯一责任就是延长用户对京店宝服务的使用期限，延长的时间应相当于用户无法正常使用京店宝服务的时间。
                </div>
                <div class="service-row-content">
                    4.7 用户同意将京店宝服务用于其功能所指向的合法的目的和用途，并不进行任何竞争性、破坏性或非法的使用。
                </div>
                <div class="service-row-content">
                    4.8 用户理解并同意，京店宝服务的唯一责任人为京店宝。
                </div>
                <div class="service-row-title">五、京店宝的权利和义务</div>
                <div class="service-row-content">
                    5.1 京店宝保证其有合法权利向用户提供京店宝服务的使用许可，并保证与京店宝服务运行相关的软件产品版权的合法性。
                </div>
            </div>
            <div class="service-row-content">
                5.2 京店宝不保存店铺的账号密码信息，账号密码只传给京东作为店铺验证。
            </div>
            <div class="service-row-content">
                5.3 京店宝保证服务的稳定可靠，负责服务的系统调试、开通、优化、升级和扩容工作，并保证前述工作不影响用户的正常使用。如因京店宝服务质量问题导致用户损失的，京店宝应承担全额的赔偿责任。
            </div>
            <div class="service-row-content">
                5.4 京店宝负责及时对服务进行更新、维护和管理，并向用户提供免费的7×24小时技术支持服务。
            </div>
            <div class="service-row-content">
                5.5 如因京店宝的原因（包括但不限于因京店宝违反与京东达成的有关协议而导致京东终止提供相关服务的），导致用户对于京店宝服务的使用许可需提前终止的，京店宝应对用户履行相应的退款义务和数据下载服务。
            </div>
            <div class="service-row-title">六、用户数据的保存、销毁与下载</div>
            <div class="service-row-content">
                6.1 京店宝应在其网络系统内建立合理的安全体系，包括身份识别体系、内部安全防范体系，以使用户数据完整，并且保密。严禁京店宝向任何人出售、出借或无偿传播用户数据，除非事先得到用户的许可。本协议项下用户数据尤其指用户基于京店宝服务功能的使用而自行导入的与京店宝服务功能相关的用户业务数据。
            </div>
            <div class="service-row-content">
                6.2 为服务用户的目的，京店宝可能通过使用用户数据，向用户提供服务，包括但不限于向用户发出产品和服务信息。
            </div>
            <div class="service-row-content">
                6.3 用户数据将在下述情况下部分或全部被披露：
            </div>
            <div class="service-row-content text-intent-4">
                (1) 经用户同意，向第三方披露；
            </div>
            <div class="service-row-content text-intent-4">
                (2) 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构 披露；
            </div>
            <div class="service-row-content text-intent-4">
                (3) 如果用户出现违反中国有关法律法规的情况，需要向第三方披露；
            </div>
            <div class="service-row-content text-intent-4">
                (4) 为提供用户所要求的软件或服务，而必须和第三方分享用户数据。
            </div>
            <div class="service-row-content">
                6.4 除京店宝和用户另行约定外，自用户软件许可期满或因任何原因导致本协议提前终止（以下简称“许可终止”）之日起最少90日内，京店宝应继续免费存储用户数据，逾期京店宝将不再存储用户数据，届时用户需自行承担其数据被销毁后引发的一切后果。
            </div>
            <div class="service-row-content">
                6.5 除京店宝和用户另行约定外，在以下期限内京店宝承诺向用户提供免费数据下载服务，用户可自行至京店宝指定的服务器下载其数据：
            </div>
            <div class="service-row-content">
                (1) 用户软件许可期限内；
            </div>
            <div class="service-row-content">
                (2) 自用户软件许可期满或因任何原因导致本协议提前终止之日起30日内。
            </div>
            <div class="service-row-title">
                七、服务产品在线交易须知
            </div>
            <div class="service-row-content">
                7.1 用户理解并同意，京东仅提供互联网交易平台，对于服务产品和交易对象的选择和交易的内容，应由用户自行判断，且审慎交易。用户需自行了解服务的适用性、功能、收费标准、退款规则、服务有效期等情况并注意交易风险。
            </div>
            <div class="service-row-content">
                7.3为保障交易安全，用户支付的软件许可费用将直接打入京店宝账户。 用户支付费用后如需开具相应金额的发票，应由用户自行向京店宝提出申请并由京店宝负责开具。因交易而产生的税费应由用户自行承担。
            </div>
            <div class="service-row-title"> 八、终止</div>
            <div class="service-row-content">
                8.1 出现下列情况之一的，京店宝有权在提前三个工作日通知用户的情况下，终止用户使用京店宝服务的权利，而无需承担任何责任：
            </div>
            <div class="service-row-content text-intent-4">
                (1) 用户在服务软件许可期限届满后未继续付费购买后续期间的软件许可的；
            </div>
            <div class="service-row-content text-intent-4">
                (2) 用户违反本协议有关保证、同意、承诺条款的约定，且自京店宝通知其纠正后仍未纠正的；
            </div>
            <div class="service-row-title"> 九、协议修改</div>
            <div class="service-row-content">
                9.1 如本许可协议的任何内容发生变动，京店宝应通过适当方式向用户提示修改内容。
            </div>
            <div class="service-row-content text-intent-4">
                9.2 如用户不同意京店宝对本许可协议相关条款所做的修改，用户有权停止使用京店宝服务。此等情况下，京店宝应向用户退回剩余许可费用（如有），并向用户提供其业务数据的下载服务。如用户继续使用京店宝服务，则视为用户接受京店宝对本许可协议相关条款所做的修改。
            </div>
            <div class="service-row-title"> 十、不可抗力</div>
            <div class="service-row-content">
                10.1 如果由于黑客攻击或政府管制或网络通讯瘫痪等对其发生和后果不能预见的事件，京店宝和用户均确认此属不可抗力；在不可抗力下，用户同意京店宝及第三方无须对合同的延期履行、不能履行承担任何责任。
            </div>
            <div class="service-row-title"> 十一、法律及争议解决</div>
            <div class="service-row-content"> 11.1 本协议适用中华人民共和国法律。</div>
            <div class="service-row-content">11.2 因双方就本协议的签订、履行或解释发生争议，双方应努力友好协商解决。如协商不成，任何一方均应向被告所在地人民法院起诉。</div>
            <div class="service-row-title"> 十二、其他</div>
            <div class="service-row-content">12.1 本协议构成用户和京店宝间就购买、使用京店宝服务的完整的协议，并取代双方就有关本协议所载任何事项于先前以口头及书面达成的共识。</div>
            <div class="service-row-content">12.2 如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部分则仍具有法律效力。</div>
            <div class="service-row-content">12.4 京店宝可根据其自身运营状况，在提前三个工作日通知用户的前提下，将其在本协议项下的权利义务全部转让给第三方，而无需获得用户的事先同意。京店宝之受让人受本协议约束，京店宝与其受让人对本协议的履行承担连带责任。</div>

        </div>
    </div>
</template>
<script>
    export default {
        methods:{
            closeServiceModal(){
                this.$store.commit('SERVICE_MODAL_TOGGLE',false);
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
    .service{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100000;
        // -moz-user-select: none;
        // -khtml-user-select: none;
        // user-select: none;   
        overflow: auto;
        .service-close-btn{
            position: absolute;
            right: 10px;
            top: 5px;
            font-size:30px;
            color: #ccc;
            cursor: pointer;
        }
        .service-content{
            width: 720px;
            background: #fff;
            position: relative;
            left: 50%;
            top: 20px;
            transform: translateX(-50%) ;
            box-shadow: 2px 2px 30px #ccc;
            padding: 20px 30px;
            box-sizing: border-box;
            .service-title{
                font-size: 30px;
                font-weight: bold;
            }
            .service-explain{
                font-size: 18px;
                font-weight: 600;
                line-height: normal;
                text-align: left;
            }
            .service-row-title{
                font-size: 22px;
                font-weight: bold;
                text-align: left;
            }
            .service-row-content{
                text-indent: 2em;
                line-height: normal;
                text-align: left;
            }
            .text-intent-4{
                text-indent: 2.5em;
            }
        }
    }

</style>