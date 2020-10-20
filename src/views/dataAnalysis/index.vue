<template>
    <div class="data-query">
        <router-view />
        <function-desc class="function-desc"/>
    </div>
</template>
<script>
import functionDesc from '@/components/functionDesc.vue'
export default {
    components: { functionDesc }
}
</script>
<style lang="scss" scoped>
.data-query{
    height:100%;
    display: flex;
    flex-direction: column;
    .function-desc{
        flex:1;
    }
}
</style>