// 进度条
let timer = null;
export default {
    data() {
        return {
            progressNumber: 0,
            progressToggle: false
        }
    },
    methods: {
        progressStart() {
            //进度条开始跑
            this.progressToggle = true;
            this.progressNumber = 0;
            timer = setInterval(() => {
                this.progressNumber++;
                if (this.progressNumber >= 98) {
                    this.progressNumber = 98;
                }
            }, 200);
        },
        // progressEnd() {
        //     //结束进度条
        //     clearInterval(timer);
        //     this.progressToggle = false;
        //     timer = setInterval(() => {
        //         this.progressNumber++;
        //         if (this.progressNumber >= 100) {
        //             clearInterval(timer);
        //             this.progressNumber = 100;
        //             let closeProgressTimer = setTimeout(() => {
        //                 clearTimeout(closeProgressTimer);
        //                 this.progressNumber = 0;
        //             }, 1500);
        //         }
        //     }, 0);
        // },
        cancelProgress() {
            clearInterval(timer);
            this.progressToggle = false;
            this.progressNumber = 0;
        },
    }
}