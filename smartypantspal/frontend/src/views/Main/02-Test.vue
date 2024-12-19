// This page is the main interface of the test system, including a side menu (used for navigation) and a main content area (displaying content that changes based on routing). // Both the side menu and
the main content area support scrolling to reveal more content. Page functions include viewing questions and answers, displaying scores, etc.
<template>
    <div class="Main">
        <n-space vertical>
            <n-layout has-sider>
                <n-layout-sider bordered collapse-mode="transform" :collapsed-width="0" :width="240" show-trigger class="Content">
                    <SideMenu
                        v-model:QuestionObj="QuestionObj"
                        v-model:AnswerObj="AnswerObj"
                        v-model:totalScoreForChoiceQuestions="totalScoreForChoiceQuestions"
                        v-model:class_options="class_options"
                        v-model:type_options="type_options"
                        :NewPermissions="props.NewPermissions"
                    ></SideMenu>
                </n-layout-sider>
                <n-layout class="Content">
                    <n-scrollbar>
                        <RouterView
                            :NewPermissions="props.NewPermissions"
                            v-model:QuestionObj="QuestionObj"
                            v-model:AnswerObj="AnswerObj"
                            v-model:class_options="class_options"
                            v-model:type_options="type_options"
                            @update:totalScoreForChoiceQuestions="handleScoreUpdate"
                        ></RouterView>
                    </n-scrollbar>
                </n-layout>
            </n-layout>
        </n-space>
    </div>
</template>

<script setup>
import SideMenu from '@/components/test/SideMenu.vue';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const QuestionObj = ref([]);
const AnswerObj = ref([]);
const class_options = ref();
const type_options = ref();
import { useMessage } from 'naive-ui';
    const router = useRouter();
    const message = useMessage()
    const PermissionsRef = inject('PermissionsRef')
    if(!PermissionsRef.isboss.value){
        router.replace('/main/practice/record')
        message.warning('權限不足')
    }


let totalScoreForChoiceQuestions = ref('');
const handleScoreUpdate = (newScore) => {
    totalScoreForChoiceQuestions.value = newScore;
};
const props = defineProps(['NewPermissions']);
</script>
