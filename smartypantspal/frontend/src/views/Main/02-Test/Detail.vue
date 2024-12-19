// This page is used to display student test results. Includes scrolling area (displaying test questions and answers), prompt button, using QuestionCard component to display multiple choice and short
answer questions, data request (obtaining student answer records, questions, answers and GPT evaluation results through API), permission verification.

<template>
    <n-flex class="body" vertical>
        <!-- Scrollable container for the main content -->
        <n-scrollbar style="flex: 1; overflow-y: auto">
            <!-- Fixed button for displaying information message -->
            <div class="fixed-button">
                <n-button size="tiny" strong secondary circle type="info" @click="message.info('紅色框為作答錯誤的選項，綠色框為正確選項', { duration: 5e3 })">
                    <template #icon>
                        <n-icon><InfoIcon /></n-icon>
                    </template>
                </n-button>
            </div>
            <!-- Container for question cards -->
            <n-flex justify="space-around" size="large">
                <n-flex class="table" vertical justify="space-around" style="margin: 20px">
                    <!-- Loop through items and render QuestionCard for each item -->
                    <QuestionCard
                        v-for="(item, index) in items"
                        :key="index"
                        :item="item"
                        :locked="true"
                        v-model:QuestionObj="questionObj"
                        v-model:AnswerObj="answer_value"
                        v-model:StudentAnswer="StudentAnswer"
                        v-model:items="items"
                        v-model:gpt_judge="gpt_judge"
                    />
                    <div style="text-align: center">-End of test-</div>
                </n-flex>
            </n-flex>
        </n-scrollbar>
    </n-flex>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { InformationCircleOutline as InfoIcon } from '@vicons/ionicons5';
import { onMounted, onUnmounted } from 'vue';
import QuestionCard from '@/components/test/QuestionCard.vue';
import { NButton, useMessage } from 'naive-ui';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { CheckStudentTableAPI, GetQuestionAPI, GetAnswerAPI, GetGPTjudgeAPI } from '@/config/ApiRoutes';

const router = useRouter();
const route = useRoute();
const message = useMessage();
const questionObj = ref([]);
const answer_value = ref([]);
const StudentAnswer = ref([]);
const choice_question = ref([]);
const items = ref([]);
const gpt_judge = ref([]);
const totalScoreForChoiceQuestions = 100;

const props = defineProps({
    NewPermissions: Object, // Define the type of NewPermissions as Object
    totalScoreForChoiceQuestions: Number, // Define the type of totalScoreForChoiceQuestions as Number
});
const class_option = defineModel('class_options');
const type_option = defineModel('type_options');
const validateAccess = async () => {
    //驗證當前頁面路由參數與組件內資料是否匹配
    const { id, class: className, sessionRange, score } = route.params;
    let totalScore = inject('totalScore');
    const idMatches = id === props.NewPermissions.name.value.toString();
    if (!idMatches) {
        router.replace('/403');
    } else {
        try {
            const response = await axios.get(CheckStudentTableAPI, {
                params: {
                    class_option: className,
                    type_option: sessionRange,
                    student: id,
                },
                withCredentials: true,
            });

            if (response.data.length === 0) {
                router.replace({ name: '403' });
            } else {
                StudentAnswer.value = response.data;
                console.log(score);

                try {
                    // 並行發送其他 API 請求
                    const [questionResponse, answerResponse, gptJudgeResponse] = await Promise.all([
                        axios.get(GetQuestionAPI, {
                            params: {
                                class_option: className,
                                type_option: sessionRange,
                            },
                            withCredentials: true,
                        }),
                        axios.get(GetAnswerAPI, {
                            params: {
                                class_option: className,
                                type_option: sessionRange,
                            },
                            withCredentials: true,
                        }),
                        axios.get(GetGPTjudgeAPI, {
                            params: {
                                class_option: className,
                                type_option: sessionRange,
                                student: id,
                            },
                            withCredentials: true,
                        }),
                    ]);

                    questionObj.value = questionResponse.data;
                    totalScore.value = score;

                    answer_value.value = answerResponse.data;
                    updateItems();

                    gpt_judge.value = gptJudgeResponse.data;
                    console.log(gpt_judge.value);
                } catch (innerError) {
                    console.error('Error fetching additional data:', innerError);
                    if (innerError.response && innerError.response.status === 403) {
                        router.replace('/403');
                    } else {
                        message.error('處理過程發生錯誤:額外資料獲取失敗');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            message.error('處理過程發生錯誤:作答記錄獲取失敗');
            router.push({ name: 'history' });
        }
    }
};

// Call validateAccess to fetch and validate data
validateAccess();

// Define events to update the value of the parent component
const emit = defineEmits(['update:totalScoreForChoiceQuestions']); // Define event to update parent's value
const childRef = ref(null); // Reference for QuestionCard component

// Function to transform question data
function transformData(questionObj) {
    if (!Array.isArray(questionObj)) {
        message.error('處理過程發生錯誤：資料格式異常');
        return [];
    }

    return questionObj.map((item, index) => {
        const degreeMap = { 容易: 'easy', 中等: 'medium', 困难: 'hard' };
        const typeMap = { 選擇題: 'radio', 簡答題: 'text' };
        let newItem = {
            original_id: item.question_id,
            id: index + 1,
            question_title: item.content,
            degree: degreeMap[item.degree],
            question_type: typeMap[item.question_type],
        };

        if (item.question_type === '選擇題') {
            const parts = item.content.split(',');
            newItem.question_title = parts[0]; // Only take the first part as the question title
            let options = parts.slice(1).map((option, idx) => {
                const [value, label] = option.trim().split('.'); // Trim unnecessary spaces
                return { value: label, label }; // Set value to the option content itself
            });
            newItem.options = options;

            // Add the original_id of choice question to choice_question
            choice_question.value.push(item.question_id);
        }

        return newItem;
    });
}

// Function to update items
function updateItems() {
    items.value = transformData(questionObj.value); // Use transformData function to transform data
}
</script>

<style scoped>
.body {
    height: 95vh;
    display: flex;
    flex-direction: column;
}

@media (max-width: 1380px) {
    .body {
        height: 93vh;
        display: flex;
        flex-direction: column;
    }
}

/* Styles for the fixed button */
.fixed-button {
    position: absolute;
    z-index: 1000; /* Ensure the button is at the top layer */
}
</style>
