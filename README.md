# 京店宝v3

## 运行命令

``` bash
# 依赖安装
npm install

# 运行开发环境
npm run dev

# 打包正式环境
npm run build

# 打包测试环境
npm run build -- test

# 打包分站
npm run build -- (os-type)

```

## 命名规范
js
项目中采用let取代var声明变量
普通变量名使用驼峰式命名
常量采用全字母大写
类使用首字母大写
vue文件使用首字母大写

css
使用-作为连接符

vue文件属性编写顺序

export default {
  mixins:[],
  data(){},
  computed:{},
  created () {},
  mounted () {},
  beforeDestroy () {},
  destroy () {},
  methods: {},
  components:{},
}