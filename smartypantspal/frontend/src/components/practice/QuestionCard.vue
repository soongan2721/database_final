<template>
    <n-card class="cards" :style="{ fontSize: fontSize + 'px' }">
        <template #header>
            <span class="card_head">{{ item.id + '. ' + item.question_title }}</span>
        </template>
        <!-- If the question type is choice question -->
        <n-radio-group v-if="item.question_type === 'radio'" v-model:value="item.selectedOption" :name="`radiobuttongroup${item.id}`" :disabled="locked">
            <n-grid :cols="2" style="gap: 10px" :style="{ fontSize: fontSize + 'px' }">
                <n-grid-item v-for="(option, i) in item.options" :key="i" :style="{ display: option.label ? 'block' : 'none' }">
                    <div v-if="option.label">
                        <n-card class="card_body" :bordered="true" :style="getButtonStyle(option.value, item.original_id, item.selectedOption, item.answer)">
                            <n-radio :value="option.value" :disabled="option.disabled" :label="option.label" />
                        </n-card>
                    </div>
                </n-grid-item>
            </n-grid>
        </n-radio-group>
        <!-- If the question type is short answer -->
        <n-input class="card_body" v-else-if="item.question_type === 'text'" v-model:value="item.value" type="textarea" :disabled="locked" />
        <!-- <n-input class="card_body" v-else-if="item.question_type === 'text'" v-model:value="item.value" type="textarea" :disabled="locked" :style="getTextareaStyle(item)"/> -->
        <!-- 其他类型的题目可以再加入其他的v-else-if或v-else -->
        <template #footer>
            <div>
                <!-- <span class="card_footer">degree: {{ item.degree }}</span> -->
                <div>
                    <div v-if="item.question_type === 'radio' && item.explain">
                        <span>解析： {{ item.explain }}</span>
                    </div>
                    <div v-if="item.question_type === 'text' && item.explain">
                        <span>解析：{{ item.explain }}</span>
                    </div>
                </div>
                <n-collapse>
                    <div v-if="item.question_type === 'text' && item.answer">
                        <n-collapse-item title="正確答案" name="1">
                            <div>{{ item.answer }}</div>
                        </n-collapse-item>
                    </div>
                </n-collapse>
            </div>
        </template>
    </n-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { NCard, NRadioGroup, NRadio, NGrid, NGridItem } from 'naive-ui';
import { onMounted } from 'vue';
import { defineExpose } from 'vue';
const emit = defineEmits();
const choice_question_answer = ref([]); // For detail
const choice_question = ref([]); // For detail
const text_question_answer = ref([]); // For detail
const text_question = ref([]); // For detail
const items = defineModel('items');
const isDetailRoute = computed(() => route.path.includes('/detail')); //// Determine the current route is detail
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    locked: {
        type: Boolean,
    },
    islocked: {
        type: Boolean,
    },
});
const route = useRoute();
const item = defineModel('item');
const question = defineModel('QuestionObj');
const answer_value = defineModel('AnswerObj');
const StudentAnswer = defineModel('StudentAnswer'); //From detail
const gpt_judge = defineModel('gpt_judge'); //From detail
function record() {
    // console.log(answer_value.value)
    // console.log(item.value)
}
const findAnswer = (questionId) => {
    const answerObj = answer_value.value.find((answer) => answer.question_id === questionId);
    return answerObj ? answerObj.anwser : null; // Note that 'anwser' is used here instead of answer
};
watch(
    answer_value,
    (newValue, oldValue) => {
        // Check whether newValue is not empty, and start correcting after getting the data
        if (newValue && newValue.length > 0) {
            record();
        }
    },
    {
        immediate: false, // If you want to trigger even if the array is empty when mounting, you can set it to true
        deep: true, // Listening for internal changes in objects or arrays
    },
);

const getButtonStyle = (optionValue, questionId, selectedOption, correctAnswer) => {
    //用來判斷正確答案顯示綠框,學生選錯的顯示紅框

    // console.log(correctAnswer);          //該題的正確答案
    // console.log(optionValue);            //該次輪到哪個選項
    // console.log(selectedOption);         //該次選到的選項
    // console.log(gpt_results.value);
    let style = 'background-color: hsla(50, 0%, 70%, 0.15); border-width: 2px;';
    // console.log(route.path);
    
    //&& route.path.includes('/detail')
    if (correctAnswer && selectedOption !== 'None selected' && selectedOption) {
        // console.log("enter");
        // If the current option is the correct answer
        if (correctAnswer === optionValue) {
            return 'background-color: hsla(50, 0%, 70%, 0.15);border-color: #90ee90; border-width: 2px;'; // Green border
        }
        // If the current option is the one selected by the user, but not the correct answer
        else if (selectedOption === optionValue && correctAnswer !== selectedOption) {
            return 'background-color: hsla(50, 0%, 70%, 0.15);border-color: #ff6347; border-width: 2px;'; // Red border
        }
        // Check whether contains the current optionValue and is not the correct answer
    }

    // If there is no match or no selection, no special styles are applied
    return style;
};

const textIndices = computed(() => {
    let indices = [];
    if (route.fullPath.includes('detail')) {
        let count = 0;
        for (let item of items.value) {
            if (item.question_type === 'text') {
                indices[item.id] = count++;
            }
        }
    }
    return indices;
});

const getTextareaStyle = (answerInfo) => {
    if(answerInfo.answer === '完全正確'){
        return { 'border-color': '#90ee90', 'border-width': '2px', 'border-style': 'solid' };
    }
    else if(answerInfo.answer === '無作答' || answerInfo.answer === '部分正確'){
        return { 'border-color': '#ff6347', 'border-width': '2px', 'border-style': 'solid' };
    }
    // If the result does not exist or has no answer status, return the default style
    return;
};

function assignAnswersToItems(items, choice_question_answers) {
    // console.log(choice_question.value);

    let answerIndex = 0;
    // Traverse the items.value array and assign the answer corresponding to the selectedOption attribute of each item
    items.value.forEach((item) => {
        if (item.question_type === 'radio' && answerIndex < choice_question_answers.value.length) {
            item.selectedOption = choice_question_answers.value[answerIndex]; // Assign corresponding answers to questions
            // console.log('Assigned:', item.selectedOption, 'to text question ID:', item.id);
            answerIndex++; // Move to next answer
        }
    });
}

// For detail to remember the question number of the multiple choice question
function extractQuestionIds() {
    // Filter choice questions and extract question numbers
    choice_question.value = question.value.filter((q) => q.question_type === '選擇題').map((q) => q.question_id);

    // Filter short answer questions and extract question numbers
    text_question.value = question.value.filter((q) => q.question_type === '簡答題').map((q) => q.question_id);
}

// For detail to put answers to choice questions and short-answer questions into their respective arrays
function extractChoiceQuestionAnswers() {
    // Split question_id_csv and student_answer into arrays
    const questionIds = StudentAnswer.value[0].question_id_csv.split(', ').map(Number);
    const answers = StudentAnswer.value[0].student_anwser.split(', ');

    // Iterate through all question numbers to see if they are multiple choice questions or short answer questions, and store the corresponding answers
    questionIds.forEach((id, index) => {
        if (index < answers.length) {
            if (choice_question.value.includes(id)) {
                choice_question_answer.value.push(answers[index]);
            } else if (text_question.value.includes(id)) {
                text_question_answer.value.push(answers[index]);
            }
        }
    });
}

// For detail to put student short answer question records into textarea for display
function updateTextAnswers(items, text_question_answer) {
    // Index used to track the current answer
    let answerIndex = 0;
    items.value.forEach((item) => {
        if (item.question_type === 'text') {
            if (answerIndex < text_question_answer.value.length) {
                item.value = text_question_answer.value[answerIndex]; // Assign the answer to item.value
                answerIndex++; // Move to next answer
            } else {
                // If no more answers are available, you can choose to assign an empty string or keep the original value
                // Or can leave it unchanged and choose as needed
                item.value = '';
            }
        }
    });
}

onMounted(() => {
    // console.log(item.value);
    // Check if the route contains 'detail' and call the function
    if (route.fullPath.includes('detail')) {
        //extractQuestionIds();
        //extractChoiceQuestionAnswers();
        //updateTextAnswers(items, text_question_answer);
        //assignAnswersToItems(items, choice_question_answer);
    }
});

// For detail to put choice explanations into choice_explains
const choice_explains = computed(() => {
    // Output the current value of answer_value in the console for debugging

    // Check if the current route is '/detail'
    if (route.path.includes('/detail')) {
        return answer_value.value.filter((answer) => choice_question.value.includes(answer.question_id)).map((answer) => answer.explain || 'No explanation');
    } else {
        return []; // If not in the '/detail' path, return an empty array or other default value
    }
});

// For detail to put short answer explanations into gpt_explains
const gpt_explains = computed(() => {
    // Check if the current route is '/detail'
    if (route.path.includes('/detail')) {
        return gpt_judge.value.flatMap((gpt_judge) => (gpt_judge.anwser_explain ? gpt_judge.anwser_explain.split(',') : ['No gpt explanation']));
    } else {
        return []; // If not in the '/detail' path, return an empty array or other default value
    }
});

// For detail to put short answer explanations into gpt_explains
const gpt_results = computed(() => {
    // Check if the current route is '/detail'
    if (route.path.includes('/detail')) {
        return gpt_judge.value.flatMap((gpt_judge) => (gpt_judge.gpt_response ? gpt_judge.gpt_response.split(',') : ['No gpt results']));
    } else {
        return []; // If not in the '/detail' path, return an empty array or other default value
    }
});

watch(gpt_explains, (newVal, oldVal) => {
    // You can add additional conditional judgments here
    updateTextExplanations();
    updateRadioExplanations();
});

// Put gpt_explains into item.explain
const updateTextExplanations = () => {
    if (!items.value || !gpt_explains.value) return;
    // Used to track the current index in gpt_explains.value
    let explainIndex = 0;
    items.value.forEach((item) => {
        if (item.question_type === 'text') {
            if (explainIndex < gpt_explains.value.length) {
                item.explain = gpt_explains.value[explainIndex];
                // Update the index to facilitate the assignment of the next item of type 'text'
                explainIndex++;
            }
        }
    });
};

// Put choice_explains into item.explain of the multiple-choice question
const updateRadioExplanations = () => {
    if (!items.value || !choice_explains.value) return;
    // Used to track the current index in choice_explains.value
    let explainIndex = 0;
    items.value.forEach((item) => {
        if (item.question_type === 'radio') {
            if (explainIndex < choice_explains.value.length) {
                item.explain = choice_explains.value[explainIndex];
                // Update the index to facilitate the assignment of the next item of type 'text'
                explainIndex++;
            }
        }
    });
};

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
.cards {
    width: 93vh;
    background-color: hsla(194, 100%, 75%, 0.1);
}

.card_head, .card_body, .card_footer {
    font-size: 1.2rem;
}

.card_body {
    display: flex;
    justify-content: center;
    /* height: 150px; */ 
}

.n-radio :deep() .n-radio__label {
    font-size: 1.2rem;
}

@media (max-width: 1380px) {
    .cards {
        width: 90%;
        margin: auto;
    }
    .card_head, .card_body {
        font-size: 1rem;
    }
}

@media (max-width: 768px) {
    .cards {
        width: 90vw;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .cards {
        width: 95vw;
        font-size: 0.9rem;
    }
}
:root {
    --global-font-size: 16px;
}
.n-card, .n-radio-group, .n-grid {
    font-size: var(--global-font-size);
}

</style>
