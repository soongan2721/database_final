<template>

    <!-- 新增/修改概念表單 -->
    <n-modal v-model:show="show_conceptForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">

            <h2 style="text-align: center; margin-top: 0px">{{ conceptForm_eventType }}概念</h2>

            <n-form
                ref="conceptForm_ref"
                inline
                :label-width="80"
                :model="conceptForm_value"
                :rules="conceptForm_rules"
                class="form_style"
            >
            
                <n-form-item label="概念名稱" path="concept_name">
                    <n-input v-model:value="conceptForm_value.concept_name" placeholder="請輸入概念名稱" />
                </n-form-item>

                <n-form-item>
                    <n-button @click="submit_conceptForm">
                        {{ conceptForm_eventType }}
                    </n-button>
                </n-form-item>

            </n-form>
        </n-card>
    </n-modal>

    <!-- 修改週次概念表單 -->
    <n-modal v-model:show="show_modifyWeekConceptForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">

            <h2 style="text-align: center; margin-top: 0px">修改第 {{ modifyWeekConceptForm_value.week }} 週概念</h2>

            <n-form
                ref="modifyWeekConceptForm_ref"
                inline
                :label-width="80"
                :model="modifyWeekConceptForm_value"
                class="form_style"
            >
            
                <n-form-item label="概念" path="concepts">
                    <n-select
                        v-model:value="modifyWeekConceptForm_value.concepts"
                        multiple :options="modifyWeekConceptForm_options"
                        style="width: 200px;"
                        placeholder="請選擇概念"
                    />
                </n-form-item>

                <n-form-item>
                    <n-button @click="submit_modifyWeekConceptForm_value">
                        修改
                    </n-button>
                </n-form-item>

            </n-form>
        </n-card>
    </n-modal>



    <n-grid cols="1 600:3" :x-gap="10" :y-gap="10">

        <n-gi span="2">

            <n-card>

                <div class="actionContainer_style">
                    <n-select
                        v-model:value="modifyWeekConceptForm_value.class_id"
                        :options="class_options"
                        @update:value="classType_updateAction"
                        style="width: 200px;"
                    />
                </div>

                <n-data-table
                    :data="weekTable_data"
                    :bordered="true"
                    :columns="weekTable_columns"
                    class="table_style"
                    :min-height="400"
                    :max-height="400"
                    :single-line="false"
                />

            </n-card>
        </n-gi>

        <n-gi span="1">
            <n-card>

                <div class="actionContainer_style">
                    <n-button type="primary" animated @click="addConcept">
                        新增概念
                    </n-button>
                </div>

                <n-data-table
                    :data="conceptTable_data"
                    :bordered="true"
                    :columns="conceptTable_columns"
                    class="table_style"
                    :min-height="400"
                    :max-height="400"
                    :single-line="false"
                />
            </n-card>
        </n-gi>

    </n-grid>



</template>

<script setup>

    import { NButton, useMessage, useDialog } from "naive-ui";
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { GetAllConceptAPI, addConceptAPI, removeConceptAPI, modifyConceptAPI, removeConceptOnlyAPI, GetAllClassAPI, GetAllWeekConceptAPI, modifyWeekConceptAPI } from'@/config/ApiRoutes';
    import { NTag } from 'naive-ui';

    const message = useMessage();
    const dialog = useDialog();

    function create_weekTable_columns( {modify, clearAll} ) {
        return [
            { title: "周次", key: "week", align: "center"},
            {
                title: "概念",
                key: "concepts",
                align: "center",

                render(row) {
                    const concepts = row.concepts.map(
                        concept => {
                            return h(
                                NTag,
                                {
                                    style: { marginRight: "6px" },
                                    type: "info",
                                    bordered: false
                                },
                                {
                                    default: () => concept
                                }
                            );
                        }
                    );
                    return concepts;
                }


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
                                    onClick: () => modify(row)
                                },
                                { default: () => "修改概念" }
                            ),
                            h(
                                NButton, {
                                    style: { margin: '5px' },
                                    tertiary: true,
                                    onClick: () => clearAll(row)
                                },
                                { default: () => "清空概念" }
                            )
                        ]
                    );
                }
            }
        ];
    }

    function create_conceptTable_columns( {modify, remove} ) {
        return [
            { title: "概念名稱", key: "concept_name", align: "center"},
            { title: "題目數量", key: "ques_count", align: "center"},
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
                                    onClick: () => modify(row)
                                },
                                { default: () => "修改" }
                            ),
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
        ];
    }

    const weekTable_columns = create_weekTable_columns(
        {
            modify(row) {
                button_modifyWeekConcept(row);
            },
            clearAll(row) {
                button_clearAllWeekConcept(row);
            }
        }
    );

    const conceptTable_columns = create_conceptTable_columns(
        {
            modify(row) {
                conceptForm_value.value.concept_id = row.concept_id;
                conceptForm_value.value.concept_name = row.concept_name;
                modifyConcept();
            },
            remove(row) {

                dialog.warning(
                    {
                        title: "確定要刪除嗎？",
                        content: "刪除概念會連帶影響使用此概念的所有題目",
                        positiveText: "確認",
                        negativeText: "取消",
                        
                        onPositiveClick: () => {
                            
                            axios.get(
                                removeConceptAPI, {
                                    params: {
                                        concept_id: row.concept_id
                                    },
                                    withCredentials: true,
                                }
                            )
                            .then(
                                response => {
                                    get_allConcept(); // 刪除成功後重新獲取概念
                                    get_allWeekConcept(); // 刪除成功後重新獲取週次概念
                                    message.success("一併刪除成功！")
                                }
                            )
                            .catch(
                                error => {
                                    message.success("錯誤！概念刪除失敗")
                                }
                            )

                        },
                        onNegativeClick: () => {

                            // axios.get(
                            //     removeConceptOnlyAPI, {
                            //         params: {
                            //             concept_id: row.concept_id
                            //         },
                            //         withCredentials: true,
                            //     }
                            // )
                            // .then(
                            //     response => {
                            //         get_allConcept(); // 刪除成功後重新獲取概念
                            //         get_allWeekConcept(); // 刪除成功後重新獲取週次概念
                            //         message.success("概念刪除成功")
                            //     }
                            // )
                            // .catch(
                            //     error => {
                            //         message.error('錯誤！概念刪除失敗')
                            //     }
                            // )

                        }
                    }
                );
                
            }
        }
    );

    const weekTable_data = ref([]);

    const conceptTable_data = ref([]);
    
    function get_allConcept() {
        axios.get(GetAllConceptAPI)
            .then(
                response => {

                    // 過濾掉'default'概念
                    conceptTable_data.value = response.data.filter(concept => concept.concept_name !== 'default');

                    // 將conceptTable_data中的資料轉成select所需的格式
                    modifyWeekConceptForm_options.value = conceptTable_data.value
                        .map(
                            concept => (
                                {
                                    value: concept.concept_id,
                                    label: concept.concept_name
                                }
                            )
                        )
                    
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，概念獲取失敗");
                }
            )
    }

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
                    message.error("錯誤!!!!!，概念獲取失敗");
                }
            )

    }

    function get_allWeekConcept() {
        axios.get(GetAllWeekConceptAPI)
            .then(
                response => {
                    
                    allWeekConcept.value = response.data
                    classType_updateAction(modifyWeekConceptForm_value.value.class_id);
                    
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，概念獲取失敗");
                }
            )
    }

    onMounted(
        () => {

            get_allConcept();
            get_allClass();
            get_allWeekConcept();
            
        }
    );
    
    const show_conceptForm = ref(false);

    const addConcept = () => {
        conceptForm_eventType.value = '新增';
        conceptForm_value.value.concept_name = '';
        show_conceptForm.value = true;
    }

    const modifyConcept = () => {
        conceptForm_eventType.value = '修改';
        show_conceptForm.value = true;
    }

    const conceptForm_value = ref(
        {
            concept_id: 0,
            concept_name: ""
        }
    );

    const conceptForm_ref = ref(null);

    const conceptForm_rules = {
        concept_name: [
            {
                required: true,
                message: "請輸入概念名稱！",
                trigger: "blur"
            },
            {
                validator: (rules, value) => {
                    const isDuplicate = conceptTable_data.value.some(
                        (concept) => concept.concept_name == value
                    )
                    if(isDuplicate) {
                        return new Error("概念名稱重複！");
                    }
                    else {
                        return true;
                    }
                },
                trigger: "blur"
            }
        ]
    }

    const conceptForm_eventType = ref('');

    function submit_conceptForm(event) {
        event.preventDefault();
        conceptForm_ref.value.validate(
            (error) => {
                if(error) {
                    message.error("錯誤! 請確認輸入正確的格式");
                }
                else {

                    if(conceptForm_eventType.value == '新增') {
                        
                        show_conceptForm.value = false;
                        axios.get(
                            addConceptAPI, {
                                params: {
                                    concept_name: conceptForm_value.value.concept_name
                                },
                                withCredentials: true,
                            }
                        )
                        .then(
                            response => {
                                get_allConcept();   // 成功新增後重新獲取concept_lib內容
                                message.success("概念新增成功！")
                            }
                        )
                        .catch(
                            error => {
                                message.error("錯誤!概念新增失敗");
                            }
                        )
                        
                    }
                    else if(conceptForm_eventType.value == '修改') {
                        show_conceptForm.value = false;
                        axios.get(
                            modifyConceptAPI, {
                                params: {
                                    concept_id: conceptForm_value.value.concept_id,
                                    concept_name: conceptForm_value.value.concept_name
                                },
                                withCredentials: true,
                            }
                        )
                        .then(
                            response => {
                                get_allConcept();   // 成功修改後重新獲取concept_lib內容
                                get_allWeekConcept();
                                message.success("概念修改成功！")
                            }
                        )
                        .catch(
                            error => {
                                message.error("錯誤!概念修改失敗");
                            }
                        )
                        
                    }
                    
                }
            }
        );
    }

    const class_options = ref([]);
    const allWeekConcept = ref(null);

    const fontSize = inject('fontSize');
    watch(fontSize, (newSize) => {
        document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
    });
    // Set up event listeners and DOM manipulations on component mount
    onMounted(() => {
        document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
    });

    function classType_updateAction(class_id) {
        weekTable_data.value = allWeekConcept.value.find(item => item.class_id == class_id).weekTable_data;
        
    }

    function button_modifyWeekConcept(row) {

        // 將該row之週次寫入表單
        modifyWeekConceptForm_value.value.week = row.week;
        
        // 將該row的所有概念(string)轉成concept_id後寫入表單
        modifyWeekConceptForm_value.value.concepts = row.concepts.map(
            row_conceptName => {
                const concept = conceptTable_data.value.find(item => item.concept_name == row_conceptName);
                return concept.concept_id;
            }
        );

        // 顯示表單
        show_modifyWeekConceptForm.value = true;
        // console.log(modifyWeekConceptForm_value.value);

    }

    function button_clearAllWeekConcept(row) {

        dialog.warning(
            {
                title: "確定要清空概念嗎？",
                content: "清除後無法復原，確定要繼續嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    
                    axios.get(
                        modifyWeekConceptAPI, {
                            params: {

                                class_id: modifyWeekConceptForm_value.value.class_id,
                                week: row.week,
                                concepts: []

                            },
                            withCredentials: true,
                        }
                    )
                    .then(
                        response => {
                            get_allWeekConcept(); // 刪除成功後重新獲取題目
                            message.success("全部清空成功！")
                        }
                    )
                    .catch(
                        error => {
                            message.success("錯誤！清空失敗")
                        }
                    )

                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );
        
    }

    const show_modifyWeekConceptForm = ref(false);
    const modifyWeekConceptForm_ref = ref(null);

    const modifyWeekConceptForm_value = ref(
        {
            class_id: 1, // 週次概念表預設顯示class_id = 1的資料
            week: null,
            concepts: null
        }
    );

    function submit_modifyWeekConceptForm_value(event) {
        axios.get(
            modifyWeekConceptAPI, {
                params: {

                    class_id: modifyWeekConceptForm_value.value.class_id,
                    week: modifyWeekConceptForm_value.value.week,
                    concepts: modifyWeekConceptForm_value.value.concepts

                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                
                
                get_allWeekConcept(); // 修改成功後重新獲取週次概念
                show_modifyWeekConceptForm.value = false;
                
                message.success("週次概念修改成功！")
            }
        )
        .catch(
            error => {
                message.error("錯誤！修改失敗dd")
                console.log(error);
                
            }
        )
    }
    const modifyWeekConceptForm_options = ref([]);
</script>

<style scoped>
    .table_style {
        align-items: center;
        width: 100%;
    }
    .actionContainer_style {
        /* border: 2px solid yellow; */
        padding: 5px;
        display: flex;
        flex-direction: row;
        margin: 5px;
        align-items: center;
        justify-content: center;
    }
    .form_style {
        align-items: center; /* 垂直置中 */
        justify-content: center; /* 水平置中 */
    }
    .test1 {
        width: 90%;
        /* display: flex;
        align-items: center;
        justify-content: center; */
        border: 2px solid yellow;
    }
    .test2 {

        border: 5px solid red;
        
        
    }
    .popConfirm_cancelButton_style {
        background-color: rgb(0, 255, 119);
        color: rgb(255, 255, 255);
        border-color: rgb(0, 255, 119);
    }

    .popConfirm_confirmButtonstyle {
        background-color: rgb(255, 98, 0);
        color: rgb(255, 255, 255);
        border-color: rgb(255, 98, 0)
    }
    :root {
        --global-font-size: 16px;
    }
    .n-button,.n-base-selection, .n-data-table, .n-tag {
        font-size: var(--global-font-size);
    }

</style>