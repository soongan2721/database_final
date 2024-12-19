<template>
    <div class="Main" :style="{ fontSize: fontSize + 'px' }">
        <div style="padding: 10px; flex-grow: 1; flex-direction: column; display: flex;">
            <n-flex vertical>
                <!-- Select component for choosing the subject -->
                <n-select class="side_content" v-model:value="class_options" :options="options1" placeholder="Select Subject" @update:value="classChange"/>

                <!-- Select component for choosing the session; allows multiple selections -->
                <n-select class="side_content" v-model:value="type_options" multiple :options="options2" placeholder="Select Session" @update:value="typeChange"/>

                <!-- Button component with events for starting and stopping the countdown -->
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

                <!-- Timer component that shows based on the showTimer condition -->
                <Timer v-if="showTimer" @countdown-finished="handleCountdownFinished" :active="active" class="side_content" style="justify-content: center"></Timer>

                <!-- Score component that shows based on the showScore condition -->
                <!-- <Score v-if="showScore" class="side_content" v-model:totalScoreForChoiceQuestions="totalScoreForChoiceQuestions"></Score> -->
            </n-flex>
        </div>
    </div>
</template>

<script setup>
import Button from '@/components/practice/SideMenu/Button.vue';
import Timer from '@/components/practice/SideMenu/Timer.vue';
import Score from '@/components/practice/SideMenu/Score.vue';
import { h, computed, ref, onBeforeUnmount, onMounted, inject, watch } from 'vue';
import { NIcon } from 'naive-ui';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getWeekAPI, getClassAPI} from'@/config/ApiRoutes';

// Get the current route
const route = useRoute();

// Define models for data binding
const QuestionObj = defineModel('QuestionObj');
const totalScoreForChoiceQuestions = defineModel('totalScoreForChoiceQuestions');
const AnswerObj = defineModel('AnswerObj');
const class_options = defineModel('class_options');
const type_options = defineModel('type_options');
const bothSelected = ref(false);
provide('bothSelected',bothSelected);

// Reactive state for managing timer and active status
const active = ref(false);

// Computed property to show timer based on route name
const showTimer = computed(() => {
    return route.name === 'question';
});

// Define properties passed to this component
const props = defineProps(['NewPermissions']);


const options1 = ref([]);

function get_class() {
    axios.get(getClassAPI).then(
        response => {
            // console.log(response.data);
            options1.value = response.data
        }
    ).catch(
        error => {
            console.log(error);
            message.success("錯誤！")
        }
    )
}

const options2 = ref([]);

watch(class_options, () => {
    get_week();
    type_options.value = [];
})


function get_week() {
    // console.log(class_options.value);
    axios.get(getWeekAPI,{
        params: {
            class_id: class_options.value,
            exam_type: "練習"
        }
    }).then(
        response => {
            // console.log(response.data);
            options2.value = response.data
        }
    ).catch(
        error => {
            console.log(error);
            message.success("錯誤！")
        }
    )
}


onMounted(
    () => {
        get_class();
    },
);




// Reactive flag for inversion state
const inverted = ref(false);

// Reference to manage countdown completion
const countdown_finished = ref(null);

// Function to handle countdown completion
const handleCountdownFinished = () => {
    if (countdown_finished.value) {
        countdown_finished.value.handleClick2(); // Call method in AnotherComponent
    }
};

const classChange = (value) => {
    classChange.value = true;
    if(classChange.value && typeChange.value){
        bothSelected.value = true;
    }
};

const typeChange = (value) => {
    typeChange.value = true;
    if(classChange.value && typeChange.value){
        bothSelected.value = true;
    }
};
// Computed property to show score based on route path
const showScore = computed(() => route.path.includes('/detail'));

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
/* General styling for side_content class */
.side_content {
    display: flex; 
    justify-content: center;
    width: 100%;
    margin-bottom: 2.5rem;
}
:root {
    --global-font-size: 16px;
}
:deep().n-button, :deep().n-base-selection, :deep().n-tag {
    font-size: var(--global-font-size);
}

</style>
