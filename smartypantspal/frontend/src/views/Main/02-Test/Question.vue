// This page is to display (through the QuestionCard component) and process test questions, and allow users to answer questions. // Other functions include: collecting answers, grading, uploading data
(student records are uploaded to the server for storage), preventing cheating, navigation and feedback.

<template>
    <n-flex style="height: 95vh; display: flex; flex-direction: column">
        <!-- Scrollable container for the questions -->
        <n-scrollbar style="flex: 1; overflow-y: auto">
            <n-flex justify="space-around" size="large">
                <!-- Container for question cards -->
                <n-flex class="table" vertical justify="space-around" style="margin: 20px">
                    <!-- Iterate through items to display QuestionCard components -->
                    <QuestionCard v-for="(item, index) in items" :key="index" :item="item" :locked="inputsLocked" v-model:QuestionObj="QuestionObj" v-model:AnswerObj="answer_value" />
                    <div style="text-align: center">-End of test-</div>
                </n-flex>
            </n-flex>
        </n-scrollbar>
    </n-flex>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue';
import QuestionCard from '@/components/test/QuestionCard.vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { UploadGPTresAPI, UploadstdTableAPI } from '@/config/ApiRoutes';

const router = useRouter();
const route = useRoute();
const inputsLocked = ref(false); // Lock inputs after submission
const QuestionObj = defineModel('QuestionObj');
const props = defineProps({
    NewPermissions: Object, // Or other types as needed
    totalScoreForChoiceQuestions: Number, // Explicitly specified as Number type
});
const answer_value = defineModel('AnswerObj');
const class_option = defineModel('class_options');
const type_option = defineModel('type_options');
const message = useMessage();
var studentShortAnwser = []; // Short answer questions answered by students to send to the backend
var student_answer = [];
var question_ID = [];
let have_text_question = false;
let totalScoreForChoiceQuestions = defineModel('totalScoreForChoiceQuestions');
const emit = defineEmits(['update:totalScoreForChoiceQuestions']); // Event to update parent component value
const items = computed(() => transformData(QuestionObj.value));

// Validate route parameters and component data
const validateAccess = () => {
    const { id, class: className, sessionRange } = route.params;
    const idMatches = id === props.NewPermissions.name.value.toString();
    const classMatches = className === class_option.value;
    const sessionRangeMatches = sessionRange === type_option.value;
    if (!idMatches || !classMatches || !sessionRangeMatches) {
        router.replace('/403');
    } else {
        // message.info("作答開始，任何重載入、切分頁皆不允許，試試就逝世(◔౪◔)")
        message.info('作答開始，請勿進行重載入等行為');
    }
};
validateAccess();

function shuffleArray(array) {
    const arrayCopy = [...array]; // Create a copy of the array
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]; // Swap elements in the copy
    }
    return arrayCopy; // Return the shuffled copy
}

function transformData(QuestionObj) {
    if (!Array.isArray(QuestionObj)) {
        return [];
    }

    // Use the return value of shuffleArray instead of modifying the QuestionObj array in place
    const shuffledValue = shuffleArray(QuestionObj);

    return shuffledValue.map((item, index) => {
        const degreeMap = { 容易: 'easy', 中等: 'median', 困难: 'hard' };
        const typeMap = { 選擇題: 'radio', 簡答題: 'text' };
        let newItem = {
            original_id: item.question_id,
            id: index + 1, // ID may not reflect original order due to shuffling
            question_title: item.content,
            degree: degreeMap[item.degree],
            question_type: typeMap[item.question_type],
        };

        if (item.question_type === '選擇題') {
            const parts = item.content.split(',');
            newItem.question_title = parts[0]; // Use only the first part as the question title
            let options = item.content
                .split(',')
                .slice(1)
                .map((option, idx) => {
                    const [value, label] = option.trim().split('.'); // Trim and split option
                    return { value: label, label }; // Set value to the content itself
                });

            // Shuffle options before setting them
            options = shuffleArray(options);
            newItem.options = options;
        } else if (item.question_type === '簡答題') {
            have_text_question = true;
        }

        return newItem;
    });
}

const logUserInputs = () => {
    // Sort items by original_id and process inputs
    items.value
        .sort((a, b) => a.original_id - b.original_id)
        .forEach((item) => {
            question_ID.push(item.original_id);
            if (item.question_type === 'radio') {
                const selectedOption = item.options.find((option) => option.value === item.selectedOption);
                student_answer.push(selectedOption ? selectedOption.value : 'None selected');
            } else if (item.question_type === 'text') {
                studentShortAnwser.push(item.value ? item.value : 'Unfilled');
                student_answer.push(item.value ? item.value : 'Unfilled');
            }
        });
};

function ExtractAnswer() {
    // Extract question_id and answer for each question
    const answers = answer_value.value.map((question) => {
        return { question_id: question.question_id, question_type: question.question_type, answer: question.anwser }; // Note: "anwser" matches database name
    });

    // View the extracted value in the console
    return answers;
}

const uploadshortData = async (short_question_array) => {
    try {
        let user_name = props.NewPermissions.name.value;
        await axios({
            method: 'post',
            url: UploadGPTresAPI,
            data: {
                class: class_option.value,
                session: type_option.value,
                student: user_name,
                short_question_arr: short_question_array,
                short_anwser_request_array: studentShortAnwser,
            },
            withCredentials: true, // Support cross-origin cookies
        });
        // Handle responses here, such as updating UI or status
    } catch (error) {
        message.error('處理過程發生錯誤:上傳簡答題回答時失敗');
        // Handle errors, such as displaying error messages
        // Note: The error objects captured in axios are different. You may need to obtain specific information based on error.response or error.request, etc.
    }
};

const correctAnswers = () => {
    inputsLocked.value = !inputsLocked.value;
    let correctCount = 0; // Count of correct answers
    const totalQuestions = items.value.length; // Total number of questions
    const choiceQuestions = items.value.filter((item) => item.question_type === 'radio'); // Filter choice questions
    const correctAnswers = ExtractAnswer(); // Get correct answers

    // Calculate the contribution of choice questions to the total score
    // Assume the total score is 100 points
    const choiceQuestionsContribution = (choiceQuestions.length / totalQuestions) * 100;

    choiceQuestions.forEach((question) => {
        // Use the original ID to find the corresponding correct answer
        const correctAnswer = correctAnswers.find((ans) => ans.question_id === question.original_id);
        // Assume the user's choice is stored in some attribute, such as question.selectedOption
        const userAnswerValue = question.options.find((option) => option.value === question.selectedOption)?.label || 'None selected';
        // Check if the correct answer is selected
        if (correctAnswer && question.selectedOption && correctAnswer.answer === userAnswerValue) {
            correctCount++; // If the user chooses the correct answer
        }
    });

    // Calculate the number of correct short answer questions
    // Add short answer answer records to the database
    let short_question_array = []; // Short answer questions
    const choiceQuestionsText = items.value.filter((item) => item.question_type === 'text'); // Filter out all choice questions
    const shortQuestionLength = choiceQuestionsText.length;
    for (let i = 0; i < shortQuestionLength; i++) {
        short_question_array.push(choiceQuestionsText[i]['question_title']);
    }
    if (have_text_question) {
        uploadshortData(short_question_array);
    }
    router.push({ name: 'history' });

    // Calculate and round the total score for choice questions
    totalScoreForChoiceQuestions = (correctCount / choiceQuestions.length) * choiceQuestionsContribution;
    totalScoreForChoiceQuestions = totalScoreForChoiceQuestions.toFixed(2); // Round to two decimal places
};

const uploadstudentanswer = () => {
    try {
        let user_name = props.NewPermissions.name.value;
        let total_score = have_text_question ? null : totalScoreForChoiceQuestions;
        axios({
            method: 'post',
            url: UploadstdTableAPI,
            data: {
                class: class_option.value,
                session: type_option.value,
                degree: 0,
                student: user_name,
                student_anwser: student_answer,
                score: totalScoreForChoiceQuestions,
                question_id: question_ID,
                date: formatDateTime(new Date()),
                total_score: total_score,
            },
            withCredentials: true, // Support cross-origin cookies
        });
        // Handle responses here, such as updating UI or status
    } catch (error) {
        message.error('處理過程發生錯誤:上傳選擇題失敗');
        console.error(error);
        // Handle errors, such as displaying error messages
        // Note: The error objects captured in axios are different. You may need to obtain specific information based on error.response or error.request, etc.
    }
};

function formatDateTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hour = `0${d.getHours()}`.slice(-2);
    const minute = `0${d.getMinutes()}`.slice(-2);
    const second = `0${d.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Watch for changes in answer_value and trigger validation and data upload
watch(
    answer_value,
    (newValue) => {
        // Check whether newValue is not empty, and start correcting after getting the data
        if (newValue && newValue.length > 0) {
            logUserInputs();
            correctAnswers();
            uploadstudentanswer();
            emit('update:totalScoreForChoiceQuestions', totalScoreForChoiceQuestions);
        }
    },
    {
        immediate: false, // If you want to trigger even if the array is empty when mounting, you can set it to true
        deep: true, // Listening for internal changes in objects or arrays
    },
);

// Disable copy and paste actions
function disableCopyPaste(event) {
    event.preventDefault();
    message.warning('禁止使用複製貼上');
}

onMounted(() => {
    // Add event listeners for copy and paste actions
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('paste', disableCopyPaste);
});

onBeforeUnmount(() => {
    // Remove event listeners for copy and paste actions
    document.removeEventListener('copy', disableCopyPaste);
    document.removeEventListener('paste', disableCopyPaste);
});
</script>

<style>
@media (max-width: 1380px) {
}
/* Style for high-resolution screens */
@media screen and (min-resolution: 2dppx) {
}
</style>
