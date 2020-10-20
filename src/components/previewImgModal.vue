<template>
    <div class="preview-img-modal" @click="closeModal">
        <div class="modal-content">
            <img :src="imgSrc" alt="">
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            imgSrc: {
                type: String,
                default: ""
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../assets/css/mixin";

    .preview-img-modal {
        @include modalStyle;
        .modal-content {
            @include modalContentStyle;
            img{
                display: block;
                margin: 0 auto;
            }
        }
    }
</style>