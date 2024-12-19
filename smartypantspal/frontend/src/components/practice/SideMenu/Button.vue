<template>
    <n-button-group size="small">
        <!-- Button to start the quiz -->
        <n-button type="default" @click="practice()" :disabled="!bothSelected">
            <template #icon>
                <n-icon><log-in-icon /></n-icon>
            </template>
            出題
        </n-button>
        <n-button type="default" @click="exit()" :disabled="isDisabled">
            <template #icon>
                <n-icon><log-in-icon /></n-icon>
            </template>
            離開
        </n-button>
    </n-button-group>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { ExitOutline as LogInIcon} from '@vicons/ionicons5';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useMessage, useDialog } from 'naive-ui';
import { CheckStudentTableAPI, GetQuestionAPI, GetAnswerAPI, UpdatePracticeRecordAPI, UploadPracticeRecordAPI, UploadPracticeQuestionAPI } from '@/config/ApiRoutes';

// Initialize message and router utilities
const message = useMessage();
const router = useRouter();
const route = useRoute();
const dialog = useDialog();  

const lock_commit_answer = inject('lock_commit_answer');
const correctQuestion = inject('correctQuestion');
// Define properties passed to this component
const props = defineProps(['NewPermissions']);
// Define models for data binding
const class_option = defineModel('class_option');
const type_option = defineModel('type_option');
let Question = defineModel('QuestionObj');
const currentIndex = inject('currentIndex');
const answeredQuestions = inject('answeredQuestions');
const theme = inject('theme');
const bothSelected = inject('bothSelected');
const isDisabled = computed(() => route.path !== '/main/practice/question' );
let start_time = inject('start_time');
let practice_id = inject('practice_id');
// console.log(practice_id.value);   
let question_array;

onMounted(() => {
    if (route.path === '/main/practice/question') {
        router.push('/main/practice/record');
    }
});


let questionLength = 0;
// Handler for starting the quiz 
const practice = async() => {
    if(route.path.includes('/question')){
        updateRecord();
    }
    correctQuestion.value = 0;
    lock_commit_answer.value = false;
    let date = new Date();
    start_time.value = date;
    try {

        const getQuestionResponse = await axios.get(GetQuestionAPI, {
            params: {
                class_option: class_option.value,
                type_option: '練習', 
                class_range: type_option.value,
            },
            withCredentials: true,
        });
        // console.log(getQuestionResponse);
        if(getQuestionResponse.data.length === 0){
            // message.success('題目已做完')
            router.push({
                name: 'record', // Navigate to the 'quiz' route
            });
            message.success('題目已做完');
        }
        else{
            const uploadPracticeRecord = axios.post(UploadPracticeRecordAPI, {
                params: {
                    class_option: class_option.value,
                    class_range: type_option.value,
                    date: formatDateTime(date),
                },
                withCredentials: true,
            });

            const [uploadPracticeRecordResponse] = await Promise.all([
                uploadPracticeRecord,
            ]);
            
            // console.log(uploadPracticeRecordResponse.data.insertId);
            practice_id.value = uploadPracticeRecordResponse.data.insertId;

            // 处理 getQuestionResponse
            questionLength = getQuestionResponse.data.length;
            question_array = getQuestionResponse.data;

            // 上傳 practice questions
            axios.post(UploadPracticeQuestionAPI, {
                params: {
                    practice_id: practice_id.value,
                    question_array: getQuestionResponse.data,
                },
                withCredentials: true,
            });

            // console.log(question_array);
            Question.value = getQuestionResponse.data; // Update Question object with response data

            if (currentIndex) {
                // console.log('currentIndex:', currentIndex);
                currentIndex.value = 0; // Set currentIndex to 0
                answeredQuestions.value.clear();
            }

            button1Clicked.value = true;
            router.push({
                name: 'quiz', // Navigate to the 'quiz' route
            });
        }

    } catch (error) {
        console.error(error); // Log error to the console
        message.error('處理過程發生錯誤: 題目資訊獲取失敗');
    }
};

const exit = () => {
    // dark theme -> yellow
    if (!theme.value) {
        dialog.warning({
            title: '確認',
            content: '確定要離開練習頁面嗎？',
            negativeText: '是',
            positiveText: '否',
            onPositiveClick: () => message.warning('已取消'),
            onNegativeClick: () => {
                message.success('已離開');
                updateRecord();
            },
        });
    } 
    // light theme -> green
    else {
        dialog.success({
            title: '確認',
            content: '確定要離開練習頁面嗎？',
            negativeText: '是',
            positiveText: '否',
            onPositiveClick: () => message.warning('已取消'),
            onNegativeClick: () => {
                message.success('已離開');
                updateRecord();
            },
        });
    }
};

function updateRecord(){
    // console.log(question_array);
    axios.post(UpdatePracticeRecordAPI, {
        params: {
            score: correctQuestion.value + "/" + questionLength,
            practice_id: practice_id.value,
        },
        withCredentials: true,
    }).then((response) => {
        // console.log(response);
        router.push({
            name: 'record', 
        });
    }).catch((error) => {
        console.log(error);
    });
}

function formatDateTime(date) {
    const d = new Date(date);
    const taipeiTime = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const year = taipeiTime.getFullYear();
    const month = `0${taipeiTime.getMonth() + 1}`.slice(-2);
    const day = `0${taipeiTime.getDate()}`.slice(-2);
    const hour = `0${taipeiTime.getHours()}`.slice(-2);
    const minute = `0${taipeiTime.getMinutes()}`.slice(-2);
    const second = `0${taipeiTime.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Reactive flag for button click
const button1Clicked = ref(false);
const button2Clicked = ref(false);
defineExpose({ handleClick2: exit });

</script>

<style scoped></style>
