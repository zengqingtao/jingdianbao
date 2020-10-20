<template>
    <el-progress class="progress" :text-inside="true" :stroke-width="22" :percentage="progress"></el-progress>
</template>
<script>
    export default {
        props: ['progress']
    }
</script>
<style  lang="scss" type="text/scss">
    .progress{
        width: 238px;
    }
</style>