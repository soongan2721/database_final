// This Vue component is a 500 error page used to handle internal server errors.

<template>
    <n-card class="content" :bordered="false">
        <n-flex vertical justify="center" style="height: 100dvh">
            <n-result status="500" title="500" description="這肯定不是我的問題 ¯\_(ツ)_/¯" size="huge">
                <template #footer> </template>
            </n-result>
        </n-flex>
    </n-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useMessage, useLoadingBar } from 'naive-ui';
const message = useMessage();

// Display error message after component is mounted
onMounted(() => {
    message.error('伺服器異常，請稍後再重啟');
});
</script>
<style scoped>
.content {
    padding: 0; /* Remove padding from content */
}
</style>
