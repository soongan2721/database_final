<template>
    <n-data-table
        :columns="recordTable_columns"
        :data="recordTable_data"
        :bordered="false"
        :style="{ fontSize: fontSize + 'px' }"
        class="table_style"
        :max-height="500"
    />
</template>

<script setup>

    import { GetAllRecordAPI } from'@/config/ApiRoutes';
    import axios from 'axios';
    import { useMessage } from "naive-ui";

    const message = useMessage();

    function create_recordTable_columns() {
        return [
            { title: "日期", key: "record_date", align: "center"},
            { title: "時間", key: "record_time", align: "center"},
            { title: "使用者", key: "username", align: "center"},
            { title: "行為", key: "record_action", align: "center"}
        ]
    }

    const recordTable_columns = create_recordTable_columns();
    const recordTable_data = ref([]);

    // function add_record(action) {
    //     axios.get(
    //         addRecordAPI, {
    //             params: {
    //                 action: action
    //             },
    //             withCredentials: true,
    //         }
    //     )
    //     .then(
    //         response => {
    //             console.log("紀錄成功");
    //             get_allRecord();
    //         }
    //     )
    //     .catch(
    //         error => {
    //             console.log("紀錄錯誤");
    //         }
    //     )
    // }

    function get_allRecord() {
        axios.get(GetAllRecordAPI)
            .then(
                response => {
                    recordTable_data.value = response.data;
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，紀錄獲取失敗");
                }
            );
    }

    







    const fontSize = inject('fontSize');
    watch(fontSize, (newSize) => {
        document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
    });
    // Set up event listeners and DOM manipulations on component mount
    onMounted(() => {

        get_allRecord();



        
        document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
    });

</script>

<style scoped>
    .table_style {
        align-items: center;
        width: 70%;
    }
    :root {
        --global-font-size: 16px;
    }
    .n-data-table{
        font-size: var(--global-font-size);
    }
</style>