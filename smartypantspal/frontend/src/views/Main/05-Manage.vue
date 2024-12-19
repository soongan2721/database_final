<template>
    <div class="Main" style="height: 93vh;" :style="{ fontSize: fontSize + 'px' }">
        <n-tabs type="line" class="tab_style">

            <n-tab-pane name="inquiry" tab="問題回覆" class="tabPane_style">
                <inquiry />
            </n-tab-pane>



        </n-tabs>

    </div> 
</template>

<script setup>

import inquiry from './05-Manage/inquiry_Management.vue'
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
const router = useRouter();
const message = useMessage()
const PermissionsRef = inject('PermissionsRef')
if(!PermissionsRef.isboss.value){
    router.replace('/main/practice/record')
    message.warning('權限不足')
}


</script>

<style scoped>

    .tab_style {
        align-items: center;
    }

    .tabPane_style {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 95%;
    }





</style>
