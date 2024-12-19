<template>
    <div class="Main" style="height: 93vh;" :style="{ fontSize: fontSize + 'px' }">
        <n-tabs type="line" class="tab_style">

            <n-tab-pane name="registry_management" tab="註冊表管理" class="tabPane_style">
                <registry_management />
            </n-tab-pane>

            <n-tab-pane name="student_management" tab="學生管理" class="tabPane_style">
                <student_management />
            </n-tab-pane>

            <n-tab-pane name="concept_management" tab="概念管理" class="tabPane_style">
                <concept_management />
            </n-tab-pane>

            <n-tab-pane name="ques_management" tab="題目管理" class="tabPane_style">
                <ques_management />
            </n-tab-pane>

            <!-- <n-tab-pane name="test_management" tab="測驗管理" class="tabPane_style ">
                <test_management />
            </n-tab-pane> -->

            <!-- <n-tab-pane name="materials_upload" tab="教材上傳" class="tabPane_style">
                <materials_upload />
            </n-tab-pane> -->

            <n-tab-pane name="records" tab="使用紀錄" class="tabPane_style">
                <records />
            </n-tab-pane>

        </n-tabs>

    </div>  
</template>

<script setup>
    import { inject, watch, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import records from './06-Class/records.vue'
    import student_management from './06-Class/student_management.vue'
    import ques_management from './06-Class/ques_management.vue'
    import materials_upload from './06-Class/materials_upload.vue'
    import test_management from './06-Class/test_management.vue'
    import concept_management from './06-Class/concept_management.vue'
    import registry_management from './06-Class/registry_management.vue'
    import { useMessage } from 'naive-ui';

    const router = useRouter();
    const message = useMessage()
    const PermissionsRef = inject('PermissionsRef')

    if(!PermissionsRef.isboss.value){
        router.replace('/main/practice/record')
        message.warning('權限不足')
    }
    const fontSize = inject('fontSize');
    watch(fontSize, (newSize) => {
        document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
    });
    // Set up event listeners and DOM manipulations on component mount
    onMounted(() => {
        document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
    });

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
    .test {
        border: 5px solid blue;
        
    }



    .Main {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .n-tabs {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .tabPane_style {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    :root {
        --global-font-size: 16px;
    }
    .n-button, :deep().n-tabs-tab, .n-tab-pane {
        font-size: var(--global-font-size);
    }
    
</style>