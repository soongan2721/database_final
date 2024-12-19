// This page is to display (through the QuestionCard component) and process test questions, and allow users to answer questions. // Other functions include: collecting answers, grading, uploading data
(student records are uploaded to the server for storage), preventing cheating, navigation and feedback.

<template>
  <n-flex style="height: 93vh; display: flex; flex-direction: column; align-items: center; justify-content: center;" :style="{ fontSize: fontSize + 'px' }"> 
        <div style="padding: 0px;">
          <QuestionCard
            v-if="currentIndex < items.length"
            :item="items[currentIndex]"
            :locked="inputsLocked || answeredQuestions.has(items[currentIndex]?.original_id)"
            :isLocked="answeredQuestions.has(items[currentIndex]?.original_id)"
            v-model:QuestionObj="QuestionObj"
            v-model:AnswerObj="answer_value"
            
            :key="currentIndex"
          />
        </div>
        <div class="button" style="display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <n-button @click="prevQuestion" :disabled="currentIndex <= 0">上一題</n-button>
          <n-button @click="endPractice" :disabled="lock_commit_answer || !items[currentIndex] || answeredQuestions.has(items[currentIndex].original_id)"> 作答完畢 </n-button>  

          <n-button @click="nextQuestion" :disabled="currentIndex >= items.length-1">下一題</n-button>
        </div>
        <div style="margin-top: 5vh;" class="progress">
          <n-progress
            type="line"
            :percentage="progressPercentage"
            :show-indicator="false"
            processing
            style="width: 50vh;"
          />
          <div style="text-align: center; margin-top: 15px;">
            {{ displayProgress }}
          </div>
        </div>
  </n-flex>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch, provide, inject } from 'vue';
import QuestionCard from '@/components/practice/QuestionCard.vue';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import {
    UploadGPTresAPI,
    UploadstdTableAPI,
    GetAnswerAPI,
    UploadPracticeTableAPI
  } from'@/config/ApiRoutes';

const router = useRouter();
const route = useRoute();
const inputsLocked = ref(false); // 交卷後鎖定
const QuestionObj= defineModel("QuestionObj")
const props = defineProps({
    NewPermissions: Object,
    totalScoreForChoiceQuestions: Number, // Total score for choice questions
});
let answer_value = defineModel('AnswerObj');
const class_option = defineModel('class_options');
const type_option = defineModel('type_options');
const message = useMessage();
const lock_commit_answer = inject('lock_commit_answer');
const endLock = ref(true);
const fontSize = inject('fontSize');
const correctQuestion = inject('correctQuestion');

var studentShortAnwser = []//學生回答的簡答題 要傳給後端的
var student_answer = [];
var question_ID = [];

// const currentIndex = ref(0); // Index of the currently displayed question
const currentIndex = inject('currentIndex');
const progressPercentage = computed(() => {
    return ((currentIndex.value + 1) / items.value.length) * 100; // Calculate progress percentage
});

const displayProgress = computed(() => {
    return `${currentIndex.value + 1} / ${items.value.length}`; // Display progress
});
let have_text_question = false; // Check if there are short answer questions

const items = computed(() => transformData(QuestionObj.value));
//const showExplain = ref(false);

// const validateAccess = () => {  //驗證當前頁面路由參數與組件內資料是否匹配
//   const { id, class: className, sessionRange } = route.params;
//   console.log('Route Params:', route.params);
//     console.log('NewPermissions:', props.NewPermissions);
//     console.log('Class Option:', class_option.value);
//     console.log('Session Range Option:', type_option.value);
//   const idMatches = id === props.NewPermissions.name.value.toString();
//   const classMatches = className === class_option.value;
//   const sessionRangeMatches = sessionRange === type_option.value;
//   if (!idMatches || !classMatches || !sessionRangeMatches) {
//     router.replace('/record');
//   }else{
//     // message.info("作答開始，任何重載入、切分頁皆不允許，試試就逝世(◔౪◔)")
//   }
// };
// validateAccess();


// Shuffle array function
function shuffleArray(array) {
    const arrayCopy = [...array]; // Create a copy of the array
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]; // Swap elements
    }
    return arrayCopy; // Return shuffled copy
}

// Transform question data
function transformData(QuestionObj) {
    if (!Array.isArray(QuestionObj)) {
        return [];
    }

    const shuffledValue = shuffleArray(QuestionObj);

    return shuffledValue.map((item, index) => {
      // console.log(item);
      const degreeMap = { 簡單: 'easy', 普通: 'median', 困難: 'hard' };
      const typeMap = { 選擇題: 'radio', 簡答題: 'text' };
      let newItem = {
          original_id: item.question_id,
          id: index + 1, // ID may not reflect original order due to shuffling
          question_title: item.content,
          //degree: degreeMap[item.degree],
          explain: "",
          answer: "",
          question_type: typeMap[item.question_type],
      };

      if (item.question_type === '選擇題') {
          let options = [];
          for(let i = 0; i < 4; i++){
            let index = "option" + (i + 1);
            let question = Object();
            question.value = item[index];
            question.label = item[index];
            options.push(question);
          }
          // console.log(options);
          options = shuffleArray(options); // Shuffle options
          newItem.options = options;
      } else if (item.question_type === '簡答題') {
        have_text_question = true;
      }

      return newItem;
    });
}

let index = 0;    //紀錄現在答題順序
let textindex = 0;
const answeredQuestions = inject('answeredQuestions');

let startTime = inject('start_time');
let practice_id = inject('practice_id');
// console.log(practice_id.value);

const endPractice = async () => {
  let endTime = new Date();
  let practiceTime = parseInt(endTime - startTime.value) / 1000; 
  let questionId = logUserInputs();
  answeredQuestions.value.add(items.value[currentIndex.value].original_id);
  if(items.value[currentIndex.value].question_type === 'text'){
    uploadTextAnswer(questionId, studentShortAnwser[textindex], practiceTime, practice_id);
  }
  else{
    getAnswer(questionId, practiceTime);
  }
};


const getAnswer = (questionId, practiceTime) => {
  axios.get(GetAnswerAPI, {
    params: {
      question_id : questionId,
      practice_id: practice_id.value
    },
    withCredentials: true,
  }).then(response => {
    // console.log(response.data);
    let id = items.value.findIndex(function(item) {
      return item.original_id === questionId;
    });

    let isCorrect = checkAnswer(response.data[0].answer, id);
    // items.value[id].explain = response.data[0].explain;
    let answer = response.data[0].answer;
    items.value[id].answer = answer;
    answer_value.value = response.data;
    uploadRadioAnswer(questionId, student_answer[index], practiceTime, practice_id, isCorrect);
  }).catch(error => {
    console.log(error)
    message.error("處理過程發生錯誤:答案資訊獲取失敗");
  });
}


//檢查是否正確並計算答對題數
const checkAnswer = (answer, id) => {
  // console.log(answer);
  // console.log(items.value[id]);
  if((items.value[id].selectedOption === answer) || (answer === '完全正確')){
    correctQuestion.value += 1;
    return 1;
  }
  return 0;
}

const logUserInputs = () => {
    lock_commit_answer.value = true;
    if (items.value.length === 0) return;

    const currentItem = items.value[currentIndex.value]; // Get current question
    question_ID.push(currentItem.original_id); // Store question ID

    if (currentItem.question_type === 'radio') {
        // Find an option that matches the current selection in the currently selected options
        const selectedOption = currentItem.options.find((option) => option.value === currentItem.selectedOption);
        // Add the selected option value to the student answer array, if no option is selected add 'None selected'
        student_answer.push(selectedOption ? selectedOption.value : 'None selected');
        // console.log(student_answer); // Print student answer
    } else if (currentItem.question_type === 'text') {
        studentShortAnwser.push(currentItem.value ? currentItem.value : 'Unfilled');
        //student_answer.push(currentItem.value ? currentItem.value : 'Unfilled');
        // console.log(student_answer);
    }

  // 输出 question_ID 和 student_answer 数组
  // console.log(question_ID, student_answer);
  return currentItem.original_id;
};

// Extract the correct answer for each question
function ExtractAnswer() {
    const answers = answer_value.value.map((question) => {
        return { question_id: question.question_id, question_type: question.question_type, answer: question.answer }; // Note: "anwser" matches database name
    });
    // View the extracted values ​​in the console
    return answers;
}


// Upload short answer data
const uploadTextAnswer = async (question_id, student_answer, practiceTime, practice_id) => {
  textindex++;
  try{
    let textAnswer = await axios.post(UploadGPTresAPI, {
      params: {
        question_id: question_id, 
        student_answer: student_answer,
        answer_time: practiceTime,
        practice_id: practice_id.value
      },
      withCredentials: true
    });
    let id = items.value.findIndex(function(item) {
      return item.original_id === question_id;
    });
    let gpt_answer = textAnswer.data.gpt_answer;
    let gpt_explain = textAnswer.data.gpt_explain;
    let correct_answer = textAnswer.data.correct_answer;
    items.value[id].answer = correct_answer
    items.value[id].explain = gpt_explain
    answer_value.value = textAnswer
    checkAnswer(gpt_answer, id);
  }
  catch(error){
    console.log(error);
    message.error("儲存作答紀錄失敗");
  }
};

// Calculate and check answers
const correctAnswers = () => {
    inputsLocked.value = !inputsLocked.value;
    let correctCount = 0;
    const totalQuestions = items.value.length;
    const choiceQuestions = items.value.filter((item) => item.question_type === 'radio');
    const correctAnswers = ExtractAnswer(); // Get the correct answer

    const choiceQuestionsContribution = (choiceQuestions.length / totalQuestions) * 100; //Total score ratio of choice questions

    choiceQuestions.forEach((question) => {
        const correctAnswer = correctAnswers.find((ans) => ans.question_id === question.original_id);
        const userAnswerValue = question.options.find((option) => option.value === question.selectedOption)?.label || 'None selected';
        if (correctAnswer && question.selectedOption && correctAnswer.answer === userAnswerValue) {
            correctCount++; // Count correct answers
        }
    });

    let short_question_array = [];
    // Filter multiple choice questions
    const choiceQuestionsText = items.value.filter((item) => item.question_type === 'text');
    const shortQuestionLength = choiceQuestionsText.length;
    for (let i = 0; i < shortQuestionLength; i++) {
        short_question_array.push(choiceQuestionsText[i]['question_title']);
    }
    if (have_text_question) {
        uploadshortData(short_question_array);
    }
    router.push({ name: 'history' });

    totalScoreForChoiceQuestions = (correctCount / choiceQuestions.length) * choiceQuestionsContribution;
    totalScoreForChoiceQuestions = totalScoreForChoiceQuestions.toFixed(2); // Round to two decimal places
};

// Upload student answers
const uploadRadioAnswer = async (question_id, student_answer, practiceTime, practice_id, isCorrect) => {
  index++;
  await axios.post(UploadPracticeTableAPI, {
    params: {
      question_id: question_id, 
      student_answer: student_answer,
      answer_time: practiceTime,
      practice_id: practice_id.value,
      isCorrect: isCorrect
    },
    withCredentials: true
  }).then((response) => {
    if(currentIndex == items.length-1){
      endLock.value = false;
    }
    // console.log(response);
  }).catch(error => {
    console.log(error);
    message.error("儲存作答紀錄失敗");
  });
};

// Format date and time
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
            // logUserInputs();
            // correctAnswers();
            // uploadstudentanswer();
            // emit('update:totalScoreForChoiceQuestions', totalScoreForChoiceQuestions);
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

// Move to the previous question
const prevQuestion = () => {
  //showExplain.value = false;
  startTime.value = new Date();
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    lock_commit_answer.value = false;
  }
};

// Move to the next question
const nextQuestion = () => {
  //showExplain.value = false;
  startTime.value = new Date();
  if (currentIndex.value < items.value.length) {
    currentIndex.value += 1;
    lock_commit_answer.value = false;
  }
};
// provide('currentIndex', currentIndex);

watch(fontSize, (newSize) => {
    document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
});
// Set up event listeners and DOM manipulations on component mount
onMounted(() => {
    document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
});

</script>

<style scoped>
:root {
  --global-font-size: 16px;
}
.n-button{
  font-size: var(--global-font-size);
}
.n-flex{
  font-size: var(--global-font-size);
} 

</style>
