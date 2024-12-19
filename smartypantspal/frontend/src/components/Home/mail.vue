<!-- src/components/Home/SummaryReport.vue -->
<template>
    <n-modal v-model:show="showMail" preset="card" title="信件" show-icon style="width: 500px; height: 500px">
        <n-card> 内容。 </n-card>
    </n-modal>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
    show: Boolean,
});

const showMail = ref(props.show);

watch(
    () => props.show,
    (newVal) => {
        showMail.value = newVal;
    },
);
</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>
