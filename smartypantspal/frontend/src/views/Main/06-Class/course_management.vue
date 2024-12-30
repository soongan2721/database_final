<template>

    <n-modal v-model:show="show_courseForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">

            <h2 style="text-align: center; margin-top: 0px">新增課程</h2>

            <n-form
                ref="courseForm_ref"
                inline
                :label-width="80"
                :model="courseForm_value"
                :rules="courseForm_rules"
                class="form_style"
            >

                <n-scrollbar style="max-height: 80vh;" >
                    <n-form-item label="課程名稱" path="course_name">
                        <n-input 
                            v-model:value="courseForm_value.course_name"
                            placeholder="請輸入課程名稱" 
                            style="width: calc(100% - 30px);"
                        />
                    </n-form-item>

                    <n-form-item label="授課老師" path="teacher_id">
                        <n-select
                            :options="teacher_options"
                            v-model:value="courseForm_value.teacher_id"
                            class="selectStyle"
                            placeholder="請選擇授課老師"
                            style="width: calc(100% - 30px);"
                        />
                    </n-form-item>

                    <n-form-item>
                        <n-button @click="submit_courseForm">
                            新增
                        </n-button>
                    </n-form-item>
                </n-scrollbar>

            
                

            </n-form>
        </n-card>
    </n-modal>







    

    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">
        <n-button type="primary" animated @click="button_addCourse">
            新增課程
        </n-button>
    </div>
    
    <n-data-table
        :columns="courseTable_columns"
        :data="courseTable_data"
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

    function create_courseTable_columns( { remove } ) {
        return [
            { title: "課程編號", key: "course_id", align: "center"},
            { title: "課程名稱", key: "course_name", align: "center"},
            { title: "授課老師", key: "teacher_name", align: "center"},
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

    const courseTable_columns = create_courseTable_columns(
        {
            remove(row) {
                button_removeCourse(row);
            }
        }
    );
    const courseTable_data = ref([]);

    function get_allCourse() {
        axios.get(db_APIs.db_getAllCourseAPI)
            .then(
                response => {
                    courseTable_data.value = response.data;
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，紀錄獲取失敗");
                }
            );
    }

    function button_removeCourse(row) {

        axios.post(
            db_APIs.removeCourseAPI, {
                params: {
                    course_id: row.course_id
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                message.success("刪除課程成功！");
                get_allCourse()
            }
        )
        .catch(
            error => {
                message.error("刪除課程錯誤！");
            }
        )

    }


    const show_courseForm = ref(false);

    function button_addCourse() {
        show_courseForm.value = true;
    }

    const courseForm_value = ref(
        {
            course_id: null,
            course_name: null,
            teacher_id: null
        }
    );

    const courseForm_ref = ref();

    function submit_courseForm(event) {

        event.preventDefault();
        courseForm_ref.value.validate(
            (error) => {
                if(error) {
                    message.error("錯誤! 請確認輸入正確的格式");
                }
                else {
                    
                    axios.post(
                        db_APIs.addCourseAPI, {
                            params: {
                                course_name: courseForm_value.value.course_name,
                                teacher_id: courseForm_value.value.teacher_id
                            },
                            withCredentials: true,
                        }
                    )
                    .then(
                        response => {
                            message.success("新增課程成功！");
                            get_allCourse()
                            show_courseForm.value = false;
                            courseForm_value.value.course_name = null;
                            courseForm_value.value.teacher_id = null;
                        }
                    )
                    .catch(
                        error => {
                            message.error("新增課程錯誤！");
                        }
                    )

                }
            }
        )

    }

    const courseForm_rules = {
        course_name: [
            {
                required: true,
                message: "請輸入課程名稱！",
                trigger: "blur"
            },
            {
                validator: (rules, value) => {
                    const isDuplicate = courseTable_data.value.some(
                        (teacher) => teacher.course_name == value
                    )
                    if(isDuplicate) {
                        return new Error("課程名稱重複！");
                    }
                    else {
                        return true;
                    }
                },
                trigger: "blur"
            }
        ],
        teacher_id: {
            required: true,
            validator(rule, value) {
                if (!value) {
                    return new Error("請選擇授課老師！");
                }
                return true;
            },
            trigger: "change"
        },
    }

    const teacher_options = ref([]);

    function get_allTeacher() {
        axios.get(db_APIs.db_getAllTeacherAPI)
            .then(
                response => {
                    teacher_options.value = response.data
                        .map(
                            teacher => (
                                {
                                    value: teacher.teacher_id,
                                    label: teacher.teacher_name
                                }
                            )
                        );
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，老師獲取失敗");
                }
            );
    }













    const fontSize = inject('fontSize');
    watch(fontSize, (newSize) => {
        document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
    });
    // Set up event listeners and DOM manipulations on component mount
    onMounted(() => {

        get_allCourse();
        get_allTeacher();
        console.log(teacher_options.value);
        

        
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
    .selectStyle {
        margin-right: 5px; 
        width: 200px;   
        max-width: 90%;
    }








    :root {
        --global-font-size: 16px;
    }
    
</style>