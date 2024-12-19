<template>

    <!-- 新增學生表單 -->
    <n-modal v-model:show="show_studentForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 400px;">
            <n-flex vertical>
                <h2 style="text-align: center; margin-top: 0px">{{  }}學生管理</h2>
            
                <n-data-table
                    :columns="studentForm_columns"
                    :data="studentForm_data"
                    v-model:checked-row-keys="studentForm_value.selectedStudent"
                    :rowKey="row => row.login_id"
                    :bordered="true"
                    :style="{ fontSize: fontSize + 'px', width: '100%' }"
                    :width=100
                    :max-height="250"
                    virtual-scroll
                    class="table_style"
                    @update:checked-row-keys="studentForm_checkHandler"
                />

                <n-card style="justify-items: center; align-items: center; border: none;">
                    <n-button @click="button_submitStudentForm">
                        修改
                    </n-button>
                </n-card>

            </n-flex>
        </n-card>
    </n-modal>

    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">

        <!-- 批次刪除按鈕 -->
        <n-button type="error" animated @click="button_batchRemoveStudent" v-if="show_batchRemoveButton">
            <n-icon>
                <Trash />
            </n-icon>
            &nbsp;一鍵刪除
        </n-button>

        <!-- 課程選擇 -->
        <n-select
            :options="class_options"
            v-model:value="studentForm_value.class_id"
            @update:value="classType_updateAction"
            class="selectStyle"
            v-if="show_classSelect"
        />

        <!-- 新增學生按鈕 -->
        <n-button type="primary" animated @click="addStudent" v-if="show_buttonAddStudent">
            學生管理
        </n-button>

    </div>

    <n-data-table
        :columns="studentTable_columns"
        :data="studentTable_data"
        v-model:checked-row-keys="studentTable_value.selectedStudents"
        :rowKey="row => row.login_id"
        :bordered="false"
        :style="{ fontSize: fontSize + 'px', width: '40%' }"
        :max-height="450"
        virtual-scroll
        class="table_style"
        @update:checked-row-keys="student_checkHandler"
        :single-line="false"
    />

</template>

<script setup>

    import { NButton, useMessage, useDialog } from "naive-ui";
    import { GetAllClassAPI, GetAllStudentAPI, GetAllClassStudentAPI, modifyClassStudentAPI, removeStudentByIdFromClassStudentAPI } from'@/config/ApiRoutes';
    import { onMounted, ref } from "vue";
    import axios from 'axios';
    import { Trash } from '@vicons/ionicons5'

    const message = useMessage();
    const dialog = useDialog();

    function create_studentTable_columns( { remove } ) {
        return [

            { type: 'selection'},
            {
                title: "學號",
                key: "username",
                sorter: 'default',
                align: "center"
            },
            {
                title: "功能",
                key: "actions",
                align: "center",

                render(row) {
                    return h(
                        'div', [
                            h(
                                NButton, {
                                    style: { margin: '5px' },
                                    tertiary: true,
                                    disabled: removeButton_isDisable.value,
                                    onClick: () => remove(row)
                                },
                                { default: () => "刪除" }
                            )
                        ]
                    );
                }
            }
        ];
    }

    function create_studentForm_columns() {
        return [
            { type: 'selection'},
            { title: "ID", key: "login_id"},
            { title: "名稱", key: "username"}
        ];
    }

    const studentTable_columns = create_studentTable_columns({
        remove(row) {

            dialog.warning(
                {
                    title: "確定要刪除嗎",
                    content: "此操作無法返回，確定要繼續嗎？",
                    positiveText: "確認",
                    negativeText: "取消",
                    
                    onPositiveClick: () => {
                        const selected_students = ref([]);
                        selected_students.value.push(row.login_id);
                        remove_Student_ById_FromClassStudent(selected_students.value);
                    },
                    onNegativeClick: () => {
                        // message.info("取消刪除");
                    }
                }
            );
            
        }
    });
    
    const studentForm_columns = create_studentForm_columns();

    const studentTable_data = ref([]);

    const studentForm_data = ref([]);

    const addStudent = () => {
        show_studentForm.value = true;
        get_allStudnet();
    };

    const student_checkHandler = (rowKeys) => {

        studentTable_value.value.selectedStudents = rowKeys;
        
        // 若student table有學生被選擇則顯示批次刪除按鈕
        if(rowKeys.length != 0) {
            switch_normalOrBatch('batch');
        }
        else {
            switch_normalOrBatch('normal');
        }

    };

    const class_options = ref([]);
    
    function get_allClass() {
        axios.get(GetAllClassAPI)
            .then(
                response => {
                    class_options.value = response.data
                        .map(
                            course => (
                                {
                                    value: course.class_id,
                                    label: course.class_name
                                }
                            )
                        );    
                        
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，課程獲取失敗");
                }
            )
    }

    function get_allStudnet() {
        axios.get(GetAllStudentAPI)
            .then(
                response => {
                    studentForm_data.value = response.data;
                    
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，概念獲取失敗");
                }
            )
    }

    const show_studentForm = ref(false);

    function classType_updateAction(class_id) {

        // 根據所選課程的class_id更新table data
        studentTable_data.value = allClassStudent.value.find(item => item.class_id == class_id).studentTable_data;

        // 根據所選課程的class_id更新student form中checked rows
        studentForm_value.value.selectedStudent = allClassStudent.value
            .find(item => item.class_id == class_id)
                .studentTable_data
                    .map(student => student.login_id);
        
    }

    function studentForm_checkHandler(rowKeys) {
        // if(rowKeys.length != 0) {
        //     const keyArray_to_string = rowKeys.join(", ");
        //     message.info(keyArray_to_string);
        // }
    }

    const allClassStudent = ref(null);

    function get_allClassStudent() {
        axios.get(GetAllClassStudentAPI)
            .then(
                response => {
                    
                    allClassStudent.value = response.data;
                    
                    
                    // 根據預設class_id抓取table data及checked rows
                    classType_updateAction(studentForm_value.value.class_id);

                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，概念獲取失敗");
                }
            )
    }

    function button_submitStudentForm() {

        axios.get(
            modifyClassStudentAPI, {
                params: {

                    class_id: studentForm_value.value.class_id,
                    selected_student: studentForm_value.value.selectedStudent

                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                
                get_allClassStudent(); // 修改成功後重新獲取課程學生
                show_studentForm.value = false;
                
                message.success("學生課程修改成功！")
            }
        )
        .catch(
            error => {
                message.error("錯誤！修改失敗dd")
                console.log(error);
                
            }
        )
        
    }

    const studentForm_value = ref (
        {
            class_id: 1, // 預設課程為class_id = 1的課程
            selectedStudent: []
        }
    );

    const studentTable_value = ref (
        {
            selectedStudents: []
        }
    )

    function remove_Student_ById_FromClassStudent(selected_students) {
        
        axios.get(
            removeStudentByIdFromClassStudentAPI, {
                params: {
                    class_id: studentForm_value.value.class_id,
                    selected_students: selected_students
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                studentTable_value.value.selectedStudents = []; // 清空student table中已勾選的項目
                switch_normalOrBatch('normal'); // 顯示模式切換回'normal'
                get_allClassStudent(); // 刪除成功後重新獲取課程學生
                show_studentForm.value = false;
                message.success("學生刪除成功！")
            }
        )
        .catch(
            error => {
                message.success("錯誤！學生刪除失敗")
            }
        )

    }
    

    const show_batchRemoveButton = ref(false);

    const show_classSelect = ref(true);

    const show_buttonAddStudent = ref(true);

    function switch_normalOrBatch(mode) {
        if(mode == 'normal') {
            show_batchRemoveButton.value = false;
            show_classSelect.value = true;
            show_buttonAddStudent.value = true;
            removeButton_isDisable.value = false;
        }
        else if(mode == 'batch') {
            show_batchRemoveButton.value = true;
            show_classSelect.value = false;
            show_buttonAddStudent.value = false;
            removeButton_isDisable.value = true;
        }
    }

    function button_batchRemoveStudent() {

        dialog.warning(
            {
                title: "批量刪除",
                content: "此操作無法返回，確定要刪除所選項目嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    remove_Student_ById_FromClassStudent(studentTable_value.value.selectedStudents);
                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );

    }

    const removeButton_isDisable = ref(false)







    onMounted(
        () => {

            get_allClass();
            get_allClassStudent();


        }
    )
    
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
    .actionContainer_style {
        padding: 5px;
        display: flex;
        margin: 5px;
        width: 40%;
        justify-content: space-between;
    }
    .selectStyle {
        margin-right: 5px; 
        width: 200px;   
        max-width: 90%;
    }
    .table_style {
        align-items: center;
    }

    






    :root {
        --global-font-size: 16px;
    }
    .n-button,.n-select, .n-data-table{
        font-size: var(--global-font-size);
    }
</style>