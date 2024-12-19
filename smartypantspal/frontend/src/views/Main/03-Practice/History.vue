<template>
    <n-flex class="body" vertical>
    <!-- Scrollable container for the main content -->
    <n-scrollbar style="flex: 1; overflow-y: auto;">
        <n-flex justify="space-around" size="large">
            <n-flex vertical >
                <!-- Data Table to display records --> 
                <n-data-table
                    class="table"
                    :columns="columns"
                    :data="sortedRecords"
                    size="large"
                    striped
                    style="table-layout:fixed"
                    max-height="500px"
                /> 
            </n-flex>
        </n-flex>
    </n-scrollbar> 
    </n-flex>
 
</template>

<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { EnterOutline as EnterOutlineIcon } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { GetPracticeRecordAPI, addRecordAPI } from '@/config/ApiRoutes';

const router = useRouter();
const props = defineProps(['NewPermissions']);
let records = ref([]);
let sortType = ref('score');  // Default sorting by 'score'
let isReverse = ref(false);

// Function to record student activity
function add_record(action) {
    axios.get(addRecordAPI, {
        params: { action: action },
        withCredentials: true,
    }).then(() => {
        // console.log("紀錄成功");
    }).catch(() => {
        console.log("紀錄錯誤");
    });
}

const fontSize = inject('fontSize');
watch(fontSize, (newSize) => {
    document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
});

// Fetch records when the component is mounted
onMounted(() => {
    add_record('進入練習系統');
    axios.get(GetPracticeRecordAPI, {
        params: { student: props.NewPermissions.name.value },
    }).then((response) => {
        records.value = response.data;
    }).catch(() => {
        message.error('處理過程發生錯誤:作答紀錄獲取失敗');
    });
});

// Sorting logic
function changeType(type) {
    if (sortType.value === type) {
        isReverse.value = !isReverse.value;
    } else {
        sortType.value = type;
        isReverse.value = false;
    }
}
const sortedRecords = computed(() => {
    return [...records.value].sort((a, b) => {
        if (sortType.value === 'weeks') {
            // Convert the 'weeks' value to a number for correct numerical sorting
            const aWeeks = parseFloat(a.weeks) || 0;
            const bWeeks = parseFloat(b.weeks) || 0;
            return isReverse.value ? bWeeks - aWeeks : aWeeks - bWeeks;
        } else if (sortType.value === 'score') {
            // Convert the 'score' value to a number for correct numerical sorting
            const aScore = parseFloat(a.score) || 0;
            const bScore = parseFloat(b.score) || 0;
            return isReverse.value ? bScore - aScore : aScore - bScore;
        }
        return 0; // 如果有其他排序类型可以在此处理
    });
});

// Format the date
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

// Navigate to the detail page
function todetail(record) {
    router.push({
        name: 'Detail',
        params: {
            id: props.NewPermissions.name.value,
            practice_id: record.practice_id,
        },
    });
}

// Define the columns for the n-data-table
const columns = [
    {
        title: '#',
        key: 'index',
        render(row, index) {
            return index + 1;
        }
    },
    {
        title: '課程名稱',
        key: 'class_name',
        render(row) {
            return row.class_name;
        }
    },
    {
        title: '範圍',
        key: 'weeks',
        sorter: 'default', // Enable sorting
        render(row) {
            return row.weeks;
        }
    },
    {
        title: '答對題數',
        key: 'score',
        sorter: 'default', // Enable sorting
        render(row) {
            return row.score;
        }
    },
    {
        title: '日期',
        key: 'practice_date',
        render(row) {
            return row.practice_date
        }
    },
    {
        title: '答題記錄',
        key: 'anwser_id',
        render(row) {
            return h(NIcon, {
                onClick: () => todetail(row),
                style: { cursor: 'pointer' },
            }, { default: () => h(EnterOutlineIcon, { style: { fontSize: '23px' } }) });
        },
        align: 'center',
    }

];
</script>

<style scoped>
.body {
    height: 93vh;
    display: flex;
    flex-direction: column;
}
.table {
    width: 75vw;
    margin-top: 50px;
    margin-bottom: 50px;
    max-height: 1000px; /* Adjust the height as needed */
    overflow-y: auto; 
}
.no-data {
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
}
:deep().table td, .table th {
    height: 80px; /* Adjust the row height as per your needs */
    line-height: 80px; /* Center content vertically */
}
</style>
