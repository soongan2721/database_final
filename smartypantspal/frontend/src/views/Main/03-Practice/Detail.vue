// This page is used to display student test results. Includes scrolling area (displaying test questions and answers), prompt button, using QuestionCard component to display multiple choice and short
answer questions, data request (obtaining student answer records, questions, answers and GPT evaluation results through API), permission verification.

<template>
    <n-flex class="body" vertical>
        <!-- Scrollable container for the main content -->
        <n-scrollbar style="flex: 1; overflow-y: auto; height: 100%;">
            <!-- Fixed button for displaying information message -->
            <div class="fixed-button">
                <n-flex vertical>
                    <n-button size="tiny" strong secondary circle @click="message.info('紅色框為作答錯誤的選項，綠色框為正確選項', { duration: 5e3 })">
                        <template #icon>
                            <n-icon size="30px"><InfoIcon /></n-icon>
                        </template>
                    </n-button>
                    <!-- <n-button size="tiny" strong secondary circle @click="exit()"  >
                        
                        <template #icon>
                            <n-icon size="30px"><ExitIcon /></n-icon>
                        </template>
                        &nbsp;離開
                    </n-button> -->
                </n-flex>
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
                        style="margin-top: 30px;"
                        class="cards"
                    />
                    <div style="text-align: center; margin-top: 20px; font-size: 20px;">
                        <n-button   @click="exit()"  >
                        
                        <template #icon>
                            <n-icon size="30px"><ExitIcon /></n-icon>
                        </template>
                        &nbsp;返回
                    </n-button>
                    </div>
                </n-flex>
            </n-flex>
        </n-scrollbar>
    </n-flex>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { InformationCircleOutline as InfoIcon, ExitOutline as ExitIcon } from '@vicons/ionicons5';
import { onMounted, onUnmounted } from 'vue';
import QuestionCard from '@/components/practice/QuestionCard.vue';
import { NButton, useMessage } from 'naive-ui';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { CheckStudentTableAPI, GetQuestionAPI, GetAnswerAPI, GetGPTjudgeAPI, GetPracticeQuestionIdAPI, GetQuestionInformationAPI } from '@/config/ApiRoutes';

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
    const { id, practice_id } = route.params;
    const idMatches = id === props.NewPermissions.name.value.toString();
    // console.log(idMatches);
    if (!idMatches) {
        router.replace('/403');
    } else {
        try {
            // console.log('enter');
            let question; 
            await axios.get(GetPracticeQuestionIdAPI, {
                params: {
                    practice_id: practice_id
                },
                withCredentials: true
            }).then((response) => {
                question = response.data
            }).catch((error) => {
                console.log(error);
            });
            // console.log(question);
            let question_array = question.map(question => question.question_id);
            // console.log(question_array);
            let questionResponse = await axios.get(GetQuestionInformationAPI, {
                params: {
                    practice_id: practice_id,
                    question: question_array
                }
            });   
            questionObj.value = questionResponse.data;
            updateItems();

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
    // console.log(questionObj);
    return questionObj.map((item, index) => {
        // console.log(item);
        const typeMap = { 選擇題: 'radio', 簡答題: 'text' };
        let newItem = {
            original_id: item.question_id,
            id: index + 1, // ID may not reflect original order due to shuffling
            question_title: item.content,
            // explain: item.explain,
            answer: item.answer,
            selectedOption: item.student_answer,
            question_type: typeMap[item.question_type],
        };
        // console.log(item.explain);
        if (item.question_type === '選擇題') {
            let options = [];
            for(let i = 0; i < 4; i++){
                let index = 'option' + (i + 1);
                let question = Object();
                question.value = item[index];
                question.label = item[index];
                options.push(question);
            }
            // console.log(options);
            //options = shuffleArray(options); // Shuffle options
            newItem.options = options;
        } 
        else if (item.question_type === '簡答題') {
            newItem.explain = item.explain,
            newItem.value = item.student_answer;
            //have_text_question = true;
        }

        return newItem;
    });
}

// Function to update items
function updateItems() {
    items.value = transformData(questionObj.value); // Use transformData function to transform data
}

function exit() {
    router.push({ name: 'record' });
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
@media (max-width: 1380px) {
    .cards {
        width: 90%;
        margin: auto;
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
        width: 90vw;
        font-size: 0.9rem;
    }
}

/* Styles for the fixed button */
.fixed-button {
    margin-top: 15px;
    margin-left: 5px;
    position: absolute;
    z-index: 1000; /* Ensure the button is at the top layer */
}
/* .n-button{
    margin-left: 1300px;
    margin-top: 20px;
} */
.exit{
    margin-left: 930px;
    margin-top: 663px;
}

</style>
