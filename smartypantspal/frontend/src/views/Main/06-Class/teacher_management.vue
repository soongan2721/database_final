<template>

    <n-modal v-model:show="show_teacherForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">

            <h2 style="text-align: center; margin-top: 0px">新增老師</h2>

            <n-form
                ref="teacherForm_ref"
                inline
                :label-width="80"
                :model="teacherForm_value"
                :rules="teacherForm_rules"
                class="form_style"
            >
            
                <n-form-item label="老師名稱" path="teacher_name">
                    <n-input v-model:value="teacherForm_value.teacher_name" placeholder="請輸入老師名稱" />
                </n-form-item>

                <n-form-item>
                    <n-button @click="submit_teacherForm">
                        新增
                    </n-button>
                </n-form-item>

            </n-form>
        </n-card>
    </n-modal>







    

    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">
        <n-button type="primary" animated @click="button_addTeacher">
            新增老師
        </n-button>
    </div>
    
    <n-data-table
        :columns="teacherTable_columns"
        :data="teacherTable_data"
        :bordered="false"
        :style="{ fontSize: fontSize + 'px' }"
        class="table_style"
        :max-height="500"
    />
</template>

<script setup>

    import axios from 'axios';
    import { useMessage, NButton } from "naive-ui";
    import db_APIs from'@/config/db_ApiRoutes';

    const message = useMessage();

    function create_teacherTable_columns( { remove } ) {
        return [
            { title: "教師編號", key: "teacher_id", align: "center"},
            { title: "教師名稱", key: "teacher_name", align: "center"},
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
                                    onClick: () => remove(row)
                                },
                                { default: () => "刪除" }
                            )
                        ]
                    );
                }
            }
        ]
    }

    const teacherTable_columns = create_teacherTable_columns(
        {
            remove(row) {
                button_removeTeacher(row);
            }
        }
    );
    const teacherTable_data = ref([]);

    function get_allTeacher() {
        axios.get(db_APIs.db_getAllTeacherAPI)
            .then(
                response => {
                    


                    teacherTable_data.value = response.data;
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，紀錄獲取失敗");
                }
            );
    }

    function button_removeTeacher(row) {

        axios.post(
            db_APIs.removeTeacherAPI, {
                params: {
                    teacher_id: row.teacher_id
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                message.success("刪除老師成功！");
                get_allTeacher()
            }
        )
        .catch(
            error => {
                message.error("刪除老師錯誤！");
            }
        )

    }


    const show_teacherForm = ref(false);

    function button_addTeacher() {
        show_teacherForm.value = true;
    }

    const teacherForm_value = ref(
        {
            teacher_id: null,
            teacher_name: null
        }
    );

    const teacherForm_ref = ref();

    function submit_teacherForm(event) {
        

        event.preventDefault();
        teacherForm_ref.value.validate(
            (error) => {
                if(error) {
                    message.error("錯誤! 請確認輸入正確的格式");
                }
                else {
                    
                    axios.post(
                        db_APIs.addTeacherAPI, {
                            params: {
                                teacher_name: teacherForm_value.value.teacher_name
                            },
                            withCredentials: true,
                        }
                    )
                    .then(
                        response => {
                            message.success("新增老師成功！");
                            get_allTeacher()
                            show_teacherForm.value = false;
                            teacherForm_value.value.teacher_name = null;
                        }
                    )
                    .catch(
                        error => {
                            message.error("新增老師錯誤！");
                        }
                    )

                }
            }
        )







    }

    

    const teacherForm_rules = {
        teacher_name: [
            {
                required: true,
                message: "請輸入老師名稱！",
                trigger: "blur"
            },
            {
                validator: (rules, value) => {
                    const isDuplicate = teacherTable_data.value.some(
                        (teacher) => teacher.teacher_name == value
                    )
                    if(isDuplicate) {
                        return new Error("老師名稱重複！");
                    }
                    else {
                        return true;
                    }
                },
                trigger: "blur"
            }
        ]
    }

















    const fontSize = inject('fontSize');
    watch(fontSize, (newSize) => {
        document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
    });
    // Set up event listeners and DOM manipulations on component mount
    onMounted(() => {

        get_allTeacher();



        
        document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
    });

</script>

<style scoped>

    .actionContainer_style {
        /* border: 2px solid yellow; */
        display: flex;
        margin: 10px;
        width: 50%;
        justify-content: center;
    }
    .table_style {
        align-items: center;
        width: 50%;
    }
    .n-data-table{
        font-size: var(--global-font-size);
    }
    .form_style {
        align-items: center; /* 垂直置中 */
        justify-content: center; /* 水平置中 */
    }








    :root {
        --global-font-size: 16px;
    }
    
</style>