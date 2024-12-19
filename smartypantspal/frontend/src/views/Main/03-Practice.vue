// This page is the main interface of the practice system, including a side menu (used for navigation) and a main content area (displaying different content based on routing). // The side menu and
main content area support scrolling to reveal more content. Page functions include viewing questions and answers, displaying scores, etc.

<template>
    <div class="Main">
        <!-- Vertical spacing for layout -->
        <n-space vertical>
            <n-layout has-sider>
                <n-layout-sider bordered collapse-mode="transform" :collapsed-width="0" :width="250" show-trigger class="Content">
                    <!-- SideMenu component for navigation -->
                    <SideMenu
                        v-model:QuestionObj="QuestionObj"
                        v-model:AnswerObj="AnswerObj"
                        v-model:totalScoreForChoiceQuestions="totalScoreForChoiceQuestions"
                        v-model:class_options="class_options"
                        v-model:type_options="type_options"
                        :NewPermissions="props.NewPermissions"
                    ></SideMenu>
                </n-layout-sider>
                <n-layout content-class="Content">
                    <!-- <n-scrollbar> -->
                        <!-- RouterView for dynamic content based on routing -->
                        <RouterView
                            :NewPermissions="props.NewPermissions"
                            v-model:QuestionObj="QuestionObj"
                            v-model:AnswerObj="AnswerObj"
                            v-model:class_options="class_options"
                            v-model:type_options="type_options"
                            @update:totalScoreForChoiceQuestions="handleScoreUpdate"
                        ></RouterView>
                    <!-- </n-scrollbar> -->
                </n-layout>
            </n-layout>
        </n-space>
    </div>
</template>

<script setup>
import SideMenu from '@/components/practice/SideMenu.vue';
import { ref, onBeforeUnmount, onMounted } from 'vue';

const QuestionObj = ref([]);
const AnswerObj = ref([]);
const class_options = ref();
const type_options = ref();
const currentIndex = ref(0); // Index of the currently displayed question
provide('currentIndex', currentIndex);
const answeredQuestions = ref(new Set());
provide('answeredQuestions', answeredQuestions);
let totalScoreForChoiceQuestions = ref('');

// Function to handle score updates from child components
const handleScoreUpdate = (newScore) => {
    totalScoreForChoiceQuestions.value = newScore;
};

// Define props to receive NewPermissions from parent component
const props = defineProps(['NewPermissions']);
</script>

<style scoped>
.Main{
    height: calc(100vh - 52.8px);
    
}
</style>
