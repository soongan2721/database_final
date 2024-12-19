<template>
    <n-button-group size="small">
        <!-- Button to start the quiz -->
        <n-button :disabled="!canClickButton1" type="default" @click="handleClick1()">
            <template #icon>
                <n-icon><log-in-icon /></n-icon>
            </template>
            出題
        </n-button>
        <!-- Button to submit the quiz -->
        <n-button :disabled="!canClickButton2" type="default" @click="handleClick2()">
            <template #icon>
                <n-icon><log-in-icon /></n-icon>
            </template>
            交卷
        </n-button>
    </n-button-group>
</template>

<script setup>
import { ref, computed } from 'vue';
import { LogInOutline as LogInIcon } from '@vicons/ionicons5';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useMessage, useDialog } from 'naive-ui';
import { CheckStudentTableAPI, GetQuestionAPI, GetAnswerAPI } from '@/config/ApiRoutes';
// Initialize message and router utilities
const message = useMessage();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(['start-countdown', 'stop-countdown']);
const props = defineProps(['NewPermissions']);
const ModStatus = inject('ModStatus');
const class_option = defineModel('class_option');
const type_option = defineModel('type_option');
const timeData = inject('timeData');
let Question = defineModel('QuestionObj');
let answer_value = defineModel('AnswerObj');

// Function to check the student's status for the quiz
const questionState = async (class_option, type_option, id) => {
    try {
        const response = await axios.get(CheckStudentTableAPI, {
            params: {
                class_option: class_option,
                type_option: type_option,
                student: id,
            },
            withCredentials: true,
        });
        return response.data.length === 0; // Returns true if no records found
    } catch (error) {
        message.error('處理過程發生錯誤:作答記錄檢查失敗');
        throw error; // Allow the calling function to handle the error.
    }
};

// Handler for starting the quiz
const handleClick1 = async () => {
    let flag = await questionState(class_option.value, type_option.value, props.NewPermissions.name.value);
    if (ModStatus.value == 'test') {
        flag = true;
        console.log({
            flag: flag,
            ModStatus: ModStatus.value,
        });
    }

    if (class_option.value == undefined || type_option.value == undefined) {
        message.warning('請選擇課程名稱及範圍');
    }
    if (flag && class_option.value !== undefined && type_option.value !== undefined) {
        emit('start-countdown');
        axios
            .get(GetQuestionAPI, {
                params: {
                    class_option: class_option.value,
                    type_option: type_option.value,
                },
                withCredentials: true,
            })
            .then((response) => {
                Question.value = response.data;
                if (response.data.length > 0) {
                    const item = response.data[0]; // Focus on the first question
                    const now = new Date(); // Get current local time
                    const startTime = new Date(item.start_time); // Convert start_time to Date object
                    const endTime = new Date(item.end_time); // Convert end_time to Date object

                    // Check whether the current time is between start_time and end_time of the first question
                    if (now <= startTime || now >= endTime) {
                        message.error('非本次測驗時間!!!');
                    } else if (now >= startTime && now <= endTime) {
                        emit('start-countdown'); // Emit event to start countdown
                        Question.value = response.data; // Update Question object with response data
                        button1Clicked.value = true;
                        addTimeObject();
                        router.push({
                            name: 'question',
                            params: {
                                id: props.NewPermissions.name.value,
                                class: class_option.value, // Subject
                                sessionRange: type_option.value, // Session range
                            },
                        });
                    }
                } else {
                    message.error('没有題目');
                }
            })
            .catch((error) => {
                message.error('處理過程發生錯誤:題目資訊獲取失敗');
            });
    } else if (class_option.value !== undefined && type_option.value !== undefined) {
        message.error('已作答過');
        // message.error("導航守衛已拒絕此操作")
    }
};

// Function to submit the answers
const getAnswer = () => {
    axios
        .get(GetAnswerAPI, {
            params: {
                class_option: class_option.value,
                type_option: type_option.value,
            },
            withCredentials: true,
        })
        .then((response) => {
            answer_value.value = response.data;
            message.info('已交卷 d(`･∀･)b ');
        })
        .catch((error) => {
            message.error('處理過程發生錯誤:資料獲取失敗');
        });
};
function addTimeObject() {
    const newTimeIndex = class_option.value + type_option.value;
    const found = timeData.value.find((item) => item.index === newTimeIndex);
    if (!found) {
        timeData.value.push({
            index: newTimeIndex,
            time: timeData.value[0].time, // Default time value
            class: class_option.value,
            session: type_option.value,
        });
    }
}
function killTimeObject() {
    const { id, class: className, sessionRange } = route.params;
    const newTimeIndex = className + sessionRange;
    const index = timeData.value.findIndex((item) => item.index === newTimeIndex);
    timeData.value[index].time = -1;
}
const handleClick2 = () => {
    killTimeObject(); // Remove time object
    emit('stop-countdown'); // Emit event to stop countdown
    button2Clicked.value = true;
    alert('將排入批改排程', getAnswer());

    // dialog.info({
    //   title: "通知",
    //   content: "排入批改排程?",
    //   positiveText: "確定",
    //   maskClosable: false,
    //   closable: false,
    //   onPositiveClick: () => {
    //     getAnswer();
    //   },
    // });
};

// Reactive flags for button clicks
const button1Clicked = ref(false);
const button2Clicked = ref(false);

// Computed properties to determine button clickability
const canClickButton1 = computed(() => {
    return route.name !== 'question';
});
const canClickButton2 = computed(() => {
    return route.name === 'question';
});

// Expose handleClick2 method to parent components
defineExpose({ handleClick2 }); // Make the method callable by the parent component through expose, and let the countdown end to trigger the handover
</script>
