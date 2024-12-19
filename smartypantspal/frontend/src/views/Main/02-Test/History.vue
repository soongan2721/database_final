// This page is used to display students' answer records. When the page is loaded, the student's answer record data is obtained by calling the API.

<template>
    <div class="Main" style="height: 95vh">
        <n-flex style="height: 93vh" justify="space-around" size="large">
            <n-flex vertical justify="space-around">
                <!-- Table to display records -->
                <n-table class="table" striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>課程名稱</th>
                            <th>範圍</th>
                            <th>成績</th>
                            <th>日期</th>
                            <th>答題記錄</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Check if there are any records -->
                        <tr v-if="records.length > 0" v-for="(record, index) in records" :key="record.anwser_id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ record.class }}</td>
                            <td>{{ record.session_range }}</td>
                            <td>{{ record.total_score !== null && record.total_score !== undefined ? record.total_score : '批改中' }}</td>
                            <td>{{ new Date(record.anwser_date).toLocaleDateString() }}</td>
                            <td><EnterOutlineIcon style="width: 25px; cursor: pointer" @click="todetail(record)" /></td>
                            <!-- Icon that users can click to view the details of the record. -->
                        </tr>
                        <!-- Display a message when no records are available -->
                        <tr v-else>
                            <td colspan="6" class="no-data">尚無答題記錄</td>
                        </tr>
                    </tbody>
                </n-table>
            </n-flex>
        </n-flex>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { EnterOutline as EnterOutlineIcon } from '@vicons/ionicons5';
import { CatchStudentTableAPI } from '@/config/ApiRoutes';
const router = useRouter();
const props = defineProps(['NewPermissions']);
let records = ref([]);

// Fetch records when the component is mounted
onMounted(() => {
    axios
        .get(CatchStudentTableAPI, {
            params: {
                student: props.NewPermissions.name.value, // Assuming student is a reactive reference
            },
        })
        .then((response) => {
            records.value = response.data;
        })
        .catch((error) => {
            message.error('處理過程發生錯誤:作答紀錄獲取失敗');
        });
});

// Function to navigate to the detail page
function todetail(record) {
    // Check if total_score is null or undefined
    const score = record.total_score !== null && record.total_score !== undefined ? record.total_score : '批改中';

  router.push({
    name: 'Detail',
    params: {
      id: props.NewPermissions.name.value,
      class: record.class, // 科目
      sessionRange: record.week, // 範圍
      // score: score,  // 使用处理后的分数
    },
  });
}
</script>

<style scoped>
.table {
    height: 90%;
    width: 75vw;
}
.no-data {
    text-align: center;
    /* vertical center */
    vertical-align: middle;
    font-size: 20px;
}
@media (max-width: 1380px) {
}
/* For the case of amplification */
@media screen and (min-resolution: 2dppx) {
}
</style>
