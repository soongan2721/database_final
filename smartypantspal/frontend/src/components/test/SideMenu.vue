<template>
    <div style="padding: 10px; flex-grow: 1; flex-direction: column; display: flex">
        <n-flex vertical>
            <!-- Dropdown for selecting a subject -->
            <n-select class="side_content" v-model:value="class_options" :options="options1" placeholder="Select Subject" />

            <!-- Dropdown for selecting a session -->
            <n-select class="side_content" v-model:value="type_options" :options="options2" placeholder="Select Session" />

            <!-- Button component that starts and stops the countdown -->
            <Button
                ref="countdown_finished"
                @start-countdown="active = true"
                @stop-countdown="active = false"
                class="side_content"
                :class_option="class_options"
                :type_option="type_options"
                v-model:QuestionObj="QuestionObj"
                v-model:AnswerObj="AnswerObj"
                :NewPermissions="props.NewPermissions"
            ></Button>

            <!-- Timer component that is shown when 'showTimer' is true -->
            <Timer v-if="showTimer" @countdown-finished="handleCountdownFinished" :active="active" class="side_content" style="justify-content: center"></Timer>

            <!-- Score component that is shown when 'showScore' is true -->
            <Score v-if="showScore" class="side_content" v-model:totalScoreForChoiceQuestions="totalScoreForChoiceQuestions"></Score>
        </n-flex>
    </div>
</template>

<script setup>
import Button from '@/components/test/SideMenu/Button.vue';
import Timer from '@/components/test/SideMenu/Timer.vue';
import Score from '@/components/test/SideMenu/Score.vue';
import { h, computed, ref, onBeforeUnmount, onMounted } from 'vue';
import { NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';

// Access route information
const route = useRoute();

// Define models for data binding
const QuestionObj = defineModel('QuestionObj');
const totalScoreForChoiceQuestions = defineModel('totalScoreForChoiceQuestions');
const AnswerObj = defineModel('AnswerObj');
const class_options = defineModel('class_options');
const type_options = defineModel('type_options');

// Reactive variables
const active = ref(false);

// Compute whether to show the timer based on the current route
const showTimer = computed(() => {
    return route.name === 'question';
});

// Access props passed to the component
const props = defineProps(['NewPermissions']);

// Injected dependency for module status
const ModStatus = inject('ModStatus');

// Options for subject selection
const options1 = [
    { label: 'Computer Vision', value: 'CV' },
    { label: 'Natural Language Processing', value: 'NLP' },
];

// Options for session selection
const options2 = [
    { label: 'Week1', value: 'session1' },
    { label: 'Week2', value: 'session2' },
];

// Flag to track inverted state
const inverted = ref(false);

// Reference for countdown finished component
const countdown_finished = ref(null);

// Handle countdown finished event
const handleCountdownFinished = () => {
    if (ModStatus.value == 'test') {
        // Exit if module status is "test"
        return;
    } else if (countdown_finished.value) {
        // Trigger method on countdown finished component
        countdown_finished.value.handleClick2();
    }
};

// Compute whether to show the score based on the current route
const showScore = computed(() => route.path.includes('/detail'));
</script>

<style>
/* Style for centering side content */
.side_content {
    display: flex;
    justify-content: center; /* Horizontally center content */
    width: 100%; /* Make element take full width of its container */
    margin-bottom: 2.5rem; /* Add bottom margin */
}
</style>
