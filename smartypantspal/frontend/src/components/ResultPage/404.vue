// This page is a 404 error page used to handle situations when a user accesses a page that does not exist.

<template>
    <n-card class="content" :bordered="false">
        <n-flex vertical justify="center" style="height: 100dvh">
            <n-result status="404" title="404" description="頁面不存在，你個小王八蛋別想亂來(#`皿´)" size="huge">
                <template #footer>
                    <n-flex vertical>
                        <!-- Countdown component, automatically calls the gohome method after the countdown ends -->
                        <n-countdown :render="renderCountdown" :precision="3" :duration="5000" :active="true" @finish="gohome" />
                    </n-flex>
                    <n-card :bordered="false" style="width: 50%; margin: auto">
                        <!-- Added margin auto for horizontal centering -->
                        <!-- The progress bar shows the countdown progress -->
                        <n-progress type="line" status="warning" :percentage="progress" :show-indicator="false" processing />
                        <!-- <div
              ref="loadingBarTargetRef"
              style="
                position: absolute;
                inset: 0;
                border-radius: var(--n-border-radius);
                overflow: hidden;
                pointer-events: none;
              "
            /> -->
                    </n-card>
                    <!-- Return to homepage button -->
                    <n-button strong secondary type="error" @click="gohome">回首頁</n-button>
                </template>
            </n-result>
        </n-flex>
    </n-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useMessage, useLoadingBar } from 'naive-ui';
import { useRouter } from 'vue-router';
const router = useRouter();
const message = useMessage();
const loadingBar = useLoadingBar();
const loadingBarTargetRef = inject('loadingBarTargetRef');
const progress = ref(0); // Percentage of progress bar

// Method to jump to the homepage
const gohome = () => {
    loadingBar.finish(); // End loading bar
    router.replace('/main/practice/record');
};

// Countdown display
const renderCountdown = ({ seconds, milliseconds }) => {
    if (seconds === 0 && milliseconds < 300) {
        progress.value = 100; // When the countdown ends, the progress bar displays 100%
        loadingBar.finish(); // End loading bar
    } else {
        progress.value = ((5 - (seconds + milliseconds / 1000)) / 5) * 100;
    }
    return `${String(seconds).padStart(1, '0')}秒後自動跳轉...`;
};

onMounted(() => {
    message.error('頁面不存在');
    loadingBar.start(); // Start loading bar
});
</script>

<style scoped>
.content {
    padding: 0; /* Remove padding from content */
}
</style>
