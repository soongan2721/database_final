<template>

    <!-- 新增題目表格 -->
    <n-modal v-model:show="show_quesForm">
        <n-card style="width: 400px;" :style="{ fontSize: fontSize + 'px' }">

            <h2 style="text-align: center; margin-top: 0px">{{ quesForm_eventType }}題目</h2>

            <n-form
                ref="quesForm_ref"
                label-placement="left"
                :label-width="80"
                :model="quesForm_value"
                :rules="quesForm_rules"
                class="form_style"
            >
                <n-scrollbar style="max-height: 80vh;" >
                    <n-form-item label="題目類型" path="question_type" v-if="show_quesFormQuesType">
                        <n-select
                            :options="questionType_options"
                            v-model:value="quesForm_value.question_type"
                            @update:value="questionType_updateAction"
                            class="selectStyle"
                            placeholder="請選擇題目類型"
                        />
                    </n-form-item>

                    <n-form-item label="題目內容" path="content">
                        <n-input
                            v-model:value="quesForm_value.content"
                            type="textarea"
                            placeholder="請輸入題目內容"
                            :autosize="{minRows: 2}"
                            style="width: calc(100% - 30px);"
                        />
                    </n-form-item>
                    
                    <n-form-item label="選項A" path="option1" v-if="show_quesFormOptions">
                        <n-input-group>
                            <n-input
                                v-model:value="quesForm_value.option1"
                                type="textarea"
                                placeholder="請輸入選項內容"
                                :autosize="{minRows: 1}"
                                :disabled="quesForm_option1_input_isDisable"
                                style="width: calc(100% - 100px); margin-right: 5px;"
                            />
                        </n-input-group>
                        
                    </n-form-item>

                    <n-form-item label="選項B" path="option2" v-if="show_quesFormOptions">
                        <n-input-group>
                            <n-input
                                v-model:value="quesForm_value.option2"
                                type="textarea"
                                placeholder="請輸入選項內容"
                                :autosize="{minRows: 1}"
                                :disabled="quesForm_option2_input_isDisable"
                                style="width: calc(100% - 100px); margin-right: 5px;"
                            />
                        </n-input-group>
                    </n-form-item>

                    <n-form-item label="選項C" path="option3" v-if="show_quesFormOptions">
                        <n-input-group>
                            <n-input
                                v-model:value="quesForm_value.option3"
                                type="textarea"
                                placeholder="請輸入選項內容"
                                :autosize="{minRows: 1}"
                                :disabled="quesForm_option3_input_isDisable"
                                style="width: calc(100% - 100px); margin-right: 5px;"
                            />
                        </n-input-group>
                        
                    </n-form-item>

                    <n-form-item label="選項D" path="option4" v-if="show_quesFormOptions">
                        <n-input-group>
                            <n-input
                                v-model:value="quesForm_value.option4"
                                type="textarea"
                                placeholder="請輸入選項內容"
                                :autosize="{minRows: 1}"
                                style="width: calc(100% - 100px); margin-right: 5px;"
                            />
                        </n-input-group>
                        
                    </n-form-item>

                    <n-form-item label="答案" path="answer" v-if="show_quesFormAns">
                        <n-select
                            :options="option_options"
                            v-model:value="quesForm_value.answer"
                            class="selectStyle"
                            placeholder="請選擇答案"
                        />
                    </n-form-item>

                    <n-form-item label="答案" path="answer_shortAns" v-if="show_quesFormAns_shortAns">
                        <n-input
                            v-model:value="quesForm_value.answer"
                            type="textarea"
                            placeholder="請輸入答案內容"
                            :autosize="{minRows: 2}"
                            style="width: calc(100% - 30px);"
                        />
                    </n-form-item>

                    <n-form-item label="解釋" path="explain" v-if="show_quesFormExplain">
                        <n-input
                            v-model:value="quesForm_value.explain"
                            type="textarea"
                            placeholder="請輸入選項內容"
                            :autosize="{minRows: 2 }"
                            style="width: calc(100% - 30px);"
                        />
                    </n-form-item>

                    <n-form-item style="justify-items: center; align-items: center; margin-top: 10px; height: 40px;">
                        <n-button @click="button_submitQuesForm">
                            {{ quesForm_eventType }}
                        </n-button>
                    </n-form-item>

                </n-scrollbar>
            </n-form>
        </n-card>
    </n-modal>

    <!-- for csv export -->
    <n-data-table
        ref="quesTableExportCSV_ref"
        :columns="quesTableExportCSV_columns"
        :data="quesTableExportCSV_data"
        v-show="show_quesTableExportCSV"
    />

    <n-modal v-model:show="show_quesFormImportCSV" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 800px;">
            <n-flex vertical>

                <h2 style="text-align: center; margin-top: 0px">題目匯入</h2>
            
                <n-data-table
                    :columns="quesFormImportCSV_columns"
                    :data="quesFormImportCSV_data"
                    :rowKey="row => row.key"
                    v-model:checked-row-keys="quesFormImportCSV_value.selectedQues"

                    :bordered="true"
                    :style="{ fontSize: fontSize + 'px', width: '100%' }"
                    :width=100
                    :max-height="250"
                    virtual-scroll
                    class="table_style"
                />

                <n-card style="justify-items: center; align-items: center; border: none;">
                    <n-button @click="button_submitQuesFormImportCSV">
                        匯入
                    </n-button>
                </n-card>

            </n-flex>
        </n-card>
    </n-modal>

    <!-- table上方功能區 -->
    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">

        <!-- 批次刪除按鈕 -->
        <n-button type="error" animated @click="button_batchRemoveStudent" v-if="show_batchRemoveButton">
            <n-icon>
                <Trash />
            </n-icon>
            &nbsp;一鍵刪除
        </n-button>
        <div>
            <n-button-group  v-if="show_quesTypeButtonGroup">
                <n-button round @click="button_showChoiceQuesTable">
                    顯示選擇題
                </n-button>
                <n-button round @click="button_showShortAnsQuesTable">
                    顯示簡答題
                </n-button>
            </n-button-group>



        </div>

        

        <n-button-group v-if="show_quesTypeButtonGroup">

            <!-- 上傳文件按鈕 -->
            <n-upload
                @change="handleUploadChange"
                style="margin-right: 5px;"
                :show-file-list="false"
                accept=".csv, .xlsx"
            >
                <n-button>上傳{{ quesForm_value.question_type }}(CSV/XLSX)</n-button>
            </n-upload>

            <!-- 導出文件按鈕 -->
            <div style="margin-right: 5px;">
                <n-dropdown trigger="click" :options="options_exportCSV" @select="selectAction_exportCSV">
                    <n-button>
                        導出{{ quesForm_value.question_type }}
                    </n-button>
                </n-dropdown>
            </div>
            
            <!-- 新增題目按鈕 -->
            <n-button type="primary" animated @click="button_addQues" v-if="show_buttonAddQues">
                新增題目
            </n-button>

        </n-button-group>

    </div>

    <!-- 選擇題table -->
    <n-data-table
        ref="choiceQuesTable_ref"
        :columns="choiceQuesTable_columns"
        :data="choiceQuesTable_data"
        :bordered="false"
        :rowKey="row => row.question_id"
        @update:checked-row-keys="choiceQues_checkHandler"
        v-model:checked-row-keys="quesTable_value.selectedQues"
        v-if="show_choiceQuesTable"
        class="table_style"
        :max-height="450"
        :single-line="false"
        :single-column="true"
    />

    <!-- 簡答題table -->
    <n-data-table
        ref="shortAnsQuesTable_ref"
        :columns="shortAnsQuesTable_columns"
        :data="shortAnsQuesTable_data"
        :bordered="false"
        :rowKey="row => row.question_id"
        @update:checked-row-keys="shortAnsQues_checkHandler"
        v-model:checked-row-keys="quesTable_value.selectedQues"
        v-if="show_shortAnsQuesTable"
        class="table_style"
        :max-height="450"
        :single-line="false"
        :single-column="true"
    />


</template>

<script setup>

    
    import { NButton, NEllipsis, useMessage, useDialog } from "naive-ui";
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { GetAllQuestionAPI, GetAllConceptAPI, addQuestionAPI, removeQuesAPI, modifyQuesAPI, GetConceptIdByNameAPI, addQuestionByCsvAPI, addConceptIfNotExistAPI, modifyQuesVerificationAPI } from'@/config/ApiRoutes';
    import { option_regenerate } from "./classAPI";
    import { Trash } from '@vicons/ionicons5'
    import * as XLSX from 'xlsx';
    import { NTag } from 'naive-ui';

    const message = useMessage();
    const dialog = useDialog();

    function create_choiceQuesTable_columns( {modify, remove, invalidate, verify} ) {
        return [
            { type: 'selection'},
            {
                title: "內容", key: "content", align: "center",
                render(row) {
                    return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.content);
                }
            },
            {
                title: "選項",
                key: "options",
                titleAlign: "center",
                children: [
                    {
                        title: "選項A", key: "option1", align: "center",
                        render(row) {
                            return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.option1);
                        }
                    },
                    {
                        title: "選項B", key: "option2", align: "center",
                        render(row) {
                            return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.option2);
                        }
                    },
                    {
                        title: "選項C", key: "option3", align: "center",
                        render(row) {
                            return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.option3);
                        }
                    },
                    {
                        title: "選項D", key: "option4", align: "center",
                        render(row) {
                            return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.option4);
                        }
                    },
                ]
            },

            { title: "答案", key: "answer", align: "center", width: 60},
            {
                title: "解釋", key: "answer_explain", align: "center",
                render(row) {
                    return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.answer_explain);
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
                                    disabled: modifyButton_isDisable.value,
                                    onClick: () => modify(row)
                                },
                                { default: () => "修改" }
                            ),
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
        ]
    }



    function create_shortAnsQuesTable_columns( {modify, remove, invalidate, verify} ) {
        return [
            { type: 'selection', align: "center"},
            // { title: "題目ID", key: "question_id", align: "center"},
            // { title: "測驗類型", key: "exam_type", align: "center"},
            {
                title: "內容", key: "content", align: "center",
                render(row) {
                    return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.content);
                }
            },
            {
                title: "答案", key: "answer", align: "center",
                render(row) {
                    return h(NEllipsis, { expandTrigger: 'click', lineClamp: 2 }, () => row.answer);
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
            },
        ]
    }

    const choiceQuesTable_columns = create_choiceQuesTable_columns(
        {
            modify(row) {
                button_modifyQues(row);
            },
            remove(row) {
                button_removeQues(row);
            },
            invalidate(row) {
                button_invalidateQues(row);
            },
            verify(row) {
                button_verifyQues(row);
            }

        }
    );

    const shortAnsQuesTable_columns = create_shortAnsQuesTable_columns(
        {
            modify(row) {
                button_modifyQues(row);
            },
            remove(row) {
                button_removeQues(row);
            },
            invalidate(row) {
                button_invalidateQues(row);
            },
            verify(row) {
                button_verifyQues(row);
            }
        }
    );

    const choiceQuesTable_data = ref([]);
    const shortAnsQuesTable_data = ref([]);
    const show_choiceQuesTable = ref(true); // 預設顯示選擇題
    const show_shortAnsQuesTable = ref(false);

    const choiceQuesTable_ref = ref(null);
    const shortAnsQuesTable_ref = ref(null);
    const currentTable = ref('choiceQues'); // 預設為選擇題(此變數用來判斷匯入/匯出CSV時table內容為選擇題還是簡答題)

    const button_showChoiceQuesTable = () => {

        show_shortAnsQuesTable.value = false;
        show_choiceQuesTable.value = true;
        // 按'顯示選擇題'時把表單類型改成選擇題
        quesForm_value.value.question_type = '選擇題'; 
        show_quesFormOptions.value = true;
        show_quesFormAns.value = true;
        show_quesFormAns_shortAns.value = false;
        show_quesFormExplain.value = true;
        quesForm_value.value.option1 = null;
        quesForm_value.value.option2 = null;
        quesForm_value.value.option3 = null;
        quesForm_value.value.option4 = null;
        quesForm_value.value.answer = null;
        quesForm_value.value.explain = null;

        currentTable.value = 'choiceQues'

    };

    const button_showShortAnsQuesTable = () => {

        show_choiceQuesTable.value = false;
        show_shortAnsQuesTable.value = true;
        // 按'顯示簡答題'時把表單類型改成簡答題
        quesForm_value.value.question_type = '簡答題'; 
        show_quesFormOptions.value = false;
        show_quesFormAns.value = false;
        show_quesFormAns_shortAns.value = true;
        show_quesFormExplain.value = false;
        quesForm_value.value.option1 = null;
        quesForm_value.value.option2 = null;
        quesForm_value.value.option3 = null;
        quesForm_value.value.option4 = null;
        quesForm_value.value.answer = null;
        quesForm_value.value.explain = null;

        currentTable.value = 'shortAnsQues'


    };

    const get_allQuestion = () => {
        axios.get(GetAllQuestionAPI,
            {
                params: {
                    isVerified: isVerified.value
                },
                withCredentials: true
            }
        )
            .then(
                response => {
                    choiceQuesTable_data.value = response.data.choiceQues_array;
                    shortAnsQuesTable_data.value = response.data.shortAnsQues_array;
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，題目獲取失敗");
                }
            );
    }

    const get_allConcept = () => {
        axios.get(GetAllConceptAPI)
            .then(
                response => {
                    // 過濾掉'default'概念
                    concept_options.value = response.data
                        .filter(concept => concept.concept_name !== 'default')
                            .map(
                                concept => (
                                    {
                                        value: concept.concept_id,
                                        label: concept.concept_name
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

    onMounted( () => {
        get_allQuestion()
        get_allConcept()
    });

    const button_addQues = () => {

        quesForm_eventType.value = '新增';
        show_quesForm.value = true;
        show_quesFormQuesType.value = true;
        // 按新增按紐時清空新增表單的全部欄位(除了題目類型)
        quesForm_value.value.degree = null
        quesForm_value.value.concept_ids = null
        quesForm_value.value.exam_type = null
        quesForm_value.value.content = null
        quesForm_value.value.option1 = null
        quesForm_value.value.option2 = null
        quesForm_value.value.option3 = null
        quesForm_value.value.option4 = null
        quesForm_value.value.answer = null
        quesForm_value.value.explain = null

    };

    const button_removeQues = (row) => {

        dialog.warning(
            {
                title: "確定要刪除題目嗎？",
                content: "此操作無法返回，確定要繼續嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    const selected_ques = ref([]);
                    selected_ques.value.push(row.question_id);
                    remove_ques(selected_ques.value);
                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );
    }

    const button_modifyQues = (row) => {

        quesForm_eventType.value = '修改';
        show_quesForm.value = true;
        show_quesFormQuesType.value = false; // 修改時關閉題目類型選擇
        
        quesForm_value.value.question_id = row.question_id;
        quesForm_value.value.degree = row.degree;
        quesForm_value.value.exam_type = row.exam_type
        quesForm_value.value.content = row.content
        quesForm_value.value.answer = row.answer
        
        row.concept_ids = row.concept_ids.map(id => parseInt(id, 10));
        quesForm_value.value.concept_ids = row.concept_ids

        // 當concept_ids裡只有一個值，且該值是 1 時，代表此題概念為default
        if (quesForm_value.value.concept_ids.length == 1 && quesForm_value.value.concept_ids[0] == 1) {
            quesForm_value.value.concept_ids = null;
        }
        
        if(row.question_type == '選擇題') {

            quesForm_value.value.explain = row.answer_explain
            quesForm_value.value.option1 = row.option1
            quesForm_value.value.option2 = row.option2
            quesForm_value.value.option3 = row.option3
            quesForm_value.value.option4 = row.option4

        }

    }


    const show_quesForm = ref(false);
    const quesForm_eventType = ref('');
    const quesForm_ref = ref(null);

    const quesForm_rules = {
        question_type: {
                required: true,
                message: "請輸入題目類型！",
                trigger: "blur"
        },
        exam_type: {
                required: true,
                message: "請輸入測驗類型！",
                trigger: "blur"
        },
        degree: {
                required: true,
                message: "請輸入難易度！",
                trigger: "blur"
        },
        content: {
                required: true,
                message: "請輸入題目內容！",
                trigger: "blur"
        },
        option1: {
                required: true,
                message: "請輸入選項內容！",
                trigger: "blur"
        },
        option2: {
                required: true,
                message: "請輸入選項內容！",
                trigger: "blur"
        },
        option3: {
                required: true,
                message: "請輸入選項內容！",
                trigger: "blur"
        },
        option4: {
                required: true,
                message: "請輸入選項內容！",
                trigger: "blur"
        },
        answer: {
                required: true,
                message: "請輸入答案！",
                trigger: "blur"
        }
    }

    const quesForm_value = ref(
        {
            question_id: null,
            concept_ids: null,
            concept_names: null,
            degree: null,
            question_type: '選擇題', // 表單預設類型為選擇題
            exam_type: null,
            content: null,
            option1: null,
            option2: null,
            option3: null,
            option4: null,
            answer: null,
            explain: null
        }
    );

    const questionType_options = [
        {
            label: '選擇題',
            value: '選擇題'
        },
        {
            label: '簡答題',
            value: '簡答題'
        }
    ];

    const examType_options = [
    {
            label: '測驗',
            value: '測驗'
        },
        {
            label: '練習',
            value: '練習'
        }
    ]

    const degree_options = [
        {
            label: '簡單',
            value: '簡單'
        },
        {
            label: '普通',
            value: '普通'
        },
        {
            label: '困難',
            value: '困難'
        }
    ];

    const option_options = [
        {
            label: 'A',
            value: 'A'
        },
        {
            label: 'B',
            value: 'B'
        },
        {
            label: 'C',
            value: 'C'
        },
        {
            label: 'D',
            value: 'D'
        }
    ]

    const concept_options = ref([]);

    // 預設為選擇題，所以表單中這三個欄位是開啟(顯示)的
    const show_quesFormOptions = ref(true); // A, B, C, D選項
    const show_quesFormAns = ref(true); // 答案
    const show_quesFormAns_shortAns = ref(false); // 答案(簡答題)
    const show_quesFormExplain = ref(true); // 解釋

    const show_quesFormQuesType = ref(true); // 新增時開啟/修改時關閉 題目類型選擇

    function questionType_updateAction(type) {
        if(type == "選擇題") {
            button_showChoiceQuesTable();
        }
        else if(type == "簡答題") {
            button_showShortAnsQuesTable();
        }
    }

    function button_submitQuesForm(event) {
        event.preventDefault();
        quesForm_ref.value.validate(
            (error) => {
                if(error) {
                    message.error("錯誤! 請確認輸入正確的格式");
                }
                else {
                    if(quesForm_eventType.value == '新增') {
                        
                        show_quesForm.value = false;
                        
                        axios.get(
                            addQuestionAPI, {
                                params: {
                                    question_type: quesForm_value.value.question_type,
                                    degree: quesForm_value.value.degree,
                                    concept_ids: quesForm_value.value.concept_ids,
                                    exam_type: quesForm_value.value.exam_type,
                                    content: quesForm_value.value.content,
                                    option1: quesForm_value.value.option1,
                                    option2: quesForm_value.value.option2,
                                    option3: quesForm_value.value.option3,
                                    option4: quesForm_value.value.option4,
                                    answer: quesForm_value.value.answer,
                                    explain: quesForm_value.value.explain
                                },
                                withCredentials: true,
                            }
                        )
                        .then(
                            response => {
                                get_allQuestion();   // 成功新增後重新獲取question_lib內容
                                message.success("題目新增成功！")
                            }
                        )
                        .catch(
                            error => {
                                message.error("錯誤！題目新增失敗");
                            }
                        )

                    }
                    else if(quesForm_eventType.value == '修改') {

                        show_quesForm.value = false;

                        axios.get(
                            modifyQuesAPI, {
                                params: {

                                    question_id: quesForm_value.value.question_id,
                                    concept_ids: quesForm_value.value.concept_ids,
                                    degree: quesForm_value.value.degree,
                                    question_type: quesForm_value.value.question_type,
                                    exam_type: quesForm_value.value.exam_type,
                                    content: quesForm_value.value.content,
                                    option1: quesForm_value.value.option1,
                                    option2: quesForm_value.value.option2,
                                    option3: quesForm_value.value.option3,
                                    option4: quesForm_value.value.option4,
                                    answer: quesForm_value.value.answer,
                                    explain: quesForm_value.value.explain
                                    
                                },
                                withCredentials: true,
                            }
                        )
                        .then(
                            response => {
                                get_allQuestion();   // 成功修改後重新獲取question_lib內容
                                message.success("題目修改成功！")
                            }
                        )
                        .catch(
                            error => {
                                message.error("錯誤!題目修改失敗");
                            }
                        )
                        
                    }
                }
            }
        )
    }

    const show_batchRemoveButton = ref(false);
    const show_quesTypeButtonGroup = ref(true);
    const show_buttonAddQues = ref(true);

    const modifyButton_isDisable = ref(false);
    const removeButton_isDisable = ref(false);
    const invalidateButton_isDisable = ref(false);
    const verifyButton_isDisable = ref(false);
    const buttonIsVerify_show = ref(true);

    function switch_normalOrBatch(mode) {
        if(mode == 'normal') {
            
            show_batchRemoveButton.value = false;

            // 開啟table上方功能按鈕
            show_quesTypeButtonGroup.value = true;
            show_buttonAddQues.value = true;
            // 開啟table中修改、刪除、驗證、取消驗證按鈕
            modifyButton_isDisable.value = false;
            removeButton_isDisable.value = false;
            invalidateButton_isDisable.value = false;
            verifyButton_isDisable.value = false;

            // 開啟切換驗證/未驗證按鈕
            buttonIsVerify_show.value = true;

        }
        else if(mode == 'batch') {
            
            show_batchRemoveButton.value = true;

            // 關閉table上方功能按鈕
            show_quesTypeButtonGroup.value = false;
            show_buttonAddQues.value = false;
            // 關閉table中修改、刪除、驗證、取消驗證按鈕
            modifyButton_isDisable.value = true;
            removeButton_isDisable.value = true;
            invalidateButton_isDisable.value = true;
            verifyButton_isDisable.value = true;
            verifyButton_isDisable.value = true;

            // 關閉切換驗證/未驗證按鈕
            buttonIsVerify_show.value = false;

        }
    }

    const quesTable_value = ref(
        {
            selectedQues: []
        }
    )

    const choiceQues_checkHandler = (rowKeys) => {

        if(rowKeys.length != 0) {
            switch_normalOrBatch('batch');
        }
        else {
            switch_normalOrBatch('normal');
        }

    };

    const shortAnsQues_checkHandler = (rowKeys) => {

        if(rowKeys.length != 0) {
            switch_normalOrBatch('batch');
        }
        else {
            switch_normalOrBatch('normal');
        }

    };

    function button_batchRemoveStudent() {
        dialog.warning(
            {
                title: "確定要刪除所選題目嗎？",
                content: "此操作無法返回，確定要繼續嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    remove_ques(quesTable_value.value.selectedQues);
                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );
    }

    function remove_ques(selected_ques) {
        axios.get(
            removeQuesAPI, {
                params: {
                    selected_ques: selected_ques
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                quesTable_value.value.selectedQues = [];
                switch_normalOrBatch('normal');
                get_allQuestion(); // 刪除成功後重新獲取題目
                message.success("題目刪除成功！")
            }
        )
        .catch(
            error => {
                message.success("錯誤！題目刪除失敗")
            }
        )
    }



    

    








    const show_quesTableExportCSV = ref(false);
    const quesTableExportCSV_ref = ref(null);
    const quesTableExportCSV_columns = ref();
    const quesTableExportCSV_data = ref();

    function downloadCSV() {

        function create_quesTableExportCSV_choiceQues_columns() {
            return [
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_name"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"}, 
                { title: "選項A", key: "option1"},
                { title: "選項B", key: "option2"},
                { title: "選項C", key: "option3"},
                { title: "選項D", key: "option4"},
                { title: "答案", key: "answer"},
                { title: "解釋", key: "answer_explain"},
            ]
        }
        function create_quesTableExportCSV_shortAnsQues_columns() {
            return [
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_name"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"},
                { title: "答案", key: "answer"},
            ]
        }

        // 過濾原data的question_id欄位
        const processData = (data) => {
            return data.map( ({ question_id, ...rest }) => rest );
        };

        if(currentTable.value == 'choiceQues') {

            quesTableExportCSV_columns.value = create_quesTableExportCSV_choiceQues_columns();
            quesTableExportCSV_data.value = processData(choiceQuesTable_data.value);
            
            // 確保執行完上面兩行才能匯出CSV
            nextTick(
                () => {
                    quesTableExportCSV_ref.value.downloadCsv(
                        { 
                            fileName: "choice-questions.csv",
                        }
                    );
                }
            );

        }
        else if(currentTable.value == 'shortAnsQues') {

            quesTableExportCSV_columns.value = create_quesTableExportCSV_shortAnsQues_columns();
            quesTableExportCSV_data.value = processData(shortAnsQuesTable_data.value);

            // 確保執行完上面兩行才能匯出CSV
            nextTick(
                () => {
                    quesTableExportCSV_ref.value.downloadCsv(
                        {
                            fileName: "short-answer-questions.csv",
                        }
                    )
                }
            );

        }

    }

    // 上傳按鈕handler
    const handleUploadChange = ( { file, fileList } ) => {

        const fileType = file.name.split('.').pop(); // 取得文件副檔名
        const reader = new FileReader();

        // 若匯入檔案為.csv
        if(fileType == 'csv') {

            reader.readAsText(file.file); // 讀取為字串形式

            reader.onload = (event) => {
                const content = event.target.result;
                importCSV(content); // 檔案讀取完後呼叫importCSV匯入CSV檔
            };

        }
        // 若匯入檔案為.xlsx
        else if(fileType === 'xlsx') {

            reader.readAsArrayBuffer(file.file); // 讀取為陣列形式

            reader.onload = (event) => {

                const content = event.target.result;
                const workbook = XLSX.read(content, { type: 'array' });
                
                importXLSX(workbook) // 檔案讀取完後呼叫importXLSX匯入XLSX檔
            };

        }
        else {
            message.error('錯誤！請上傳正確的檔案類型')
        }

        fileList.splice(0, fileList.length); // 清空fileList


    };



    const show_quesFormImportCSV = ref(false);
    const quesFormImportCSV_columns = ref();
    const quesFormImportCSV_data = ref();
    const quesFormImportCSV_value = ref(
        {
            selectedQues: []
        }
    );
    const quesFormImportCSV_quesType = ref();

    function importCSV(content) {

        // show_quesFormImportCSV.value = true;

        function create_quesFormImportCSV_choiceQues_columns() {
            return [
                { type: 'selection'},
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_name"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"}, 
                { title: "選項A", key: "option1"},
                { title: "選項B", key: "option2"},
                { title: "選項C", key: "option3"},
                { title: "選項D", key: "option4"},
                { title: "答案", key: "answer"},
                { title: "解釋", key: "answer_explain"},
            ]
        }
        function create_quesFormImportCSV_shortAnsQues_columns() {
            return [
                { type: 'selection'},
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_name"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"}, 
                { title: "答案", key: "answer"}
            ]
        }



        if(currentTable.value == 'choiceQues') {

            // 將 CSV 字串按行分割並移除空白行
            const rows = content.trim().split('\n').filter(row => row.trim() !== '');

            // 取得標題行
            const headers = rows[0].split(',').map(header => header.trim());

            // 定義映射
            const columnMap = {
                '測驗類型': 'exam_type',
                '概念': 'concept_name',
                '難易度': 'degree',
                '內容': 'content',
                '選項A': 'option1',
                '選項B': 'option2',
                '選項C': 'option3',
                '選項D': 'option4',
                '答案': 'answer',
                '解釋': 'answer_explain'
            };

            // 轉換數據，並加上自動增量的 key
            const matrix = rows.slice(1).map(
                (row, index) => {

                    // 題目內容
                    const values = row.split(',').map( value => value.trim() );
                    
                    let mappedObject = {
                        key: index + 1 // 每個題目給一個key 從1起算
                    };

                    headers.forEach(
                        (header, index) => {
                            const mappedKey = columnMap[header];
                            
                            if (mappedKey) {
                                mappedObject[mappedKey] = values[index];
                            }
                        }
                    );
                    
                    return mappedObject; // 每個row都return一個object
                }
            );

            quesFormImportCSV_columns.value = create_quesFormImportCSV_choiceQues_columns();
            quesFormImportCSV_data.value = matrix;
            show_quesFormImportCSV.value = true;
            
            // 預設為全部勾選
            quesFormImportCSV_value.value.selectedQues = matrix.map(item => item.key);
            // 設定題目類型，add_questionByCsv中用於判斷
            quesFormImportCSV_quesType.value = '選擇題'
            
        }
        else if(currentTable.value == 'shortAnsQues') {

            // 將 CSV 字串按行分割並移除空白行
            const rows = content.trim().split('\n').filter(row => row.trim() !== '');

            // 取得標題行
            const headers = rows[0].split(',').map(header => header.trim());

            // 定義映射
            const columnMap = {
                '測驗類型': 'exam_type',
                '概念': 'concept_name',
                '難易度': 'degree',
                '內容': 'content',
                '答案': 'answer'
            };

            // 轉換數據，並加上自動增量的 key
            const matrix = rows.slice(1).map(
                (row, index) => {

                    // 題目內容
                    const values = row.split(',').map( value => value.trim() );
                    
                    let mappedObject = {
                        key: index + 1 // 每個題目給一個key 從1起算
                    };

                    headers.forEach(
                        (header, index) => {
                            const mappedKey = columnMap[header];
                            
                            if (mappedKey) {
                                mappedObject[mappedKey] = values[index];
                            }
                        }
                    );
                    
                    return mappedObject; // 每個row都return一個object
                }
            );

            quesFormImportCSV_columns.value = create_quesFormImportCSV_shortAnsQues_columns();
            quesFormImportCSV_data.value = matrix;
            show_quesFormImportCSV.value = true;

            // 預設為全部勾選
            quesFormImportCSV_value.value.selectedQues = matrix.map(item => item.key);
            // 設定題目類型，add_questionByCsv中用於判斷
            quesFormImportCSV_quesType.value = '簡答題'
            
        }

    }

    function importXLSX(workbook) {

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 將工作表轉為 JSON 格式
        let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });  // header: 1 表示資料的第一列作為標題列
        rows = rows.filter(row => row.some(cell => cell != null && cell != undefined && cell.toString().trim() != '')); // 過濾空白列
        
        function create_quesFormImportCSV_choiceQues_columns() {
            return [
                { type: 'selection'},
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_names"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"}, 
                { title: "選項A", key: "option1"},
                { title: "選項B", key: "option2"},
                { title: "選項C", key: "option3"},
                { title: "選項D", key: "option4"},
                { title: "答案", key: "answer"},
                { title: "解釋", key: "answer_explain"},
            ]
        }
        function create_quesFormImportCSV_shortAnsQues_columns() {
            return [
                { type: 'selection'},
                { title: "測驗類型", key: "exam_type"},
                { title: "概念", key: "concept_names"},
                { title: "難易度", key: "degree"},
                { title: "內容", key: "content"}, 
                { title: "答案", key: "answer"}
            ]
        }

        if(currentTable.value == 'choiceQues') {

            // 處理資料
            const formattedData = rows.slice(1).map(    // slice(1)的意思是去掉標題列，只返回後面的資料
                (row, index) => (
                    {
                        key: index + 1,             // 自增 key
                        exam_type: row[0],          // 測驗類型
                        concept_names: row[1],      // 概念
                        degree: row[2],             // 難易度
                        content: row[3],            // 題目內容
                        option1: row[4],            // 選項 A
                        option2: row[5],            // 選項 B
                        option3: row[6],            // 選項 C
                        option4: row[7],            // 選項 D
                        answer: row[8],             // 答案
                        answer_explain: row[9]      // 解釋
                    }
                )
            );
            
            quesFormImportCSV_columns.value = create_quesFormImportCSV_choiceQues_columns();
            quesFormImportCSV_data.value = formattedData;
            show_quesFormImportCSV.value = true;

            // 預設為全部勾選
            quesFormImportCSV_value.value.selectedQues = formattedData.map(item => item.key);
            // 設定題目類型，add_questionByCsv中用於判斷
            quesFormImportCSV_quesType.value = '選擇題'

        }
        else if(currentTable.value == 'shortAnsQues') {

            // 處理資料
            const formattedData = rows.slice(1).map(
                (row, index) => (
                    {
                        key: index + 1,             // 自增 key
                        exam_type: row[0],          // 測驗類型
                        concept_names: row[1],      // 概念
                        degree: row[2],             // 難易度
                        content: row[3],            // 題目內容
                        answer: row[4],             // 答案
                    }
                )
            );
            
            quesFormImportCSV_columns.value = create_quesFormImportCSV_shortAnsQues_columns();
            quesFormImportCSV_data.value = formattedData;
            show_quesFormImportCSV.value = true;

            // 預設為全部勾選
            quesFormImportCSV_value.value.selectedQues = formattedData.map(item => item.key);
            // 設定題目類型，add_questionByCsv中用於判斷
            quesFormImportCSV_quesType.value = '簡答題'

        }






    }

    function button_submitQuesFormImportCSV() {

        // 過濾勾選題目
        // 並且把過濾結果先轉為JSON格式再回傳，避免修改到quesFormImportCSV_value(因為javascript是call by reference)
        let selected_questions = JSON.parse(
            JSON.stringify(
                quesFormImportCSV_data.value.filter(
                    item => quesFormImportCSV_value.value.selectedQues.includes(item.key)
                )
            ) 
        );

        selected_questions = selected_questions.map(
            ( { concept_names, ...rest } ) => (
                {
                    ...rest,
                    concept_names: concept_names.split(',').map(name => name.trim()) // 將字串轉換為陣列
                }
            )
        );

        if(quesFormImportCSV_quesType.value == '選擇題') {
            add_questionByCsv('選擇題', selected_questions);
        }
        else if(quesFormImportCSV_quesType.value == '簡答題') {
            add_questionByCsv('簡答題', selected_questions);
        }

    }

    function add_questionByCsv(question_type, selected_questions) {

        let concept_sets = new Set();

        selected_questions.map(
            question => {
                question.concept_names.map(
                    concept_name => {
                        concept_sets.add(concept_name)
                    }
                )
            }
        )

        concept_sets = Array.from(concept_sets); // 把concept_sets從set轉成array

        axios.post(
            addConceptIfNotExistAPI, {
                params: {
                    concept_sets: concept_sets
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                add_questions()
            }
        )
        .catch(
            error => {
                message.error("錯誤！");
            }
        )



        function add_questions() {

            const promises = selected_questions.map(
                question => {

                    return axios.post(
                        GetConceptIdByNameAPI, {
                            params: {
                                concept_names: question.concept_names
                            },
                            withCredentials: true
                        }
                    )
                    .then(
                        response => {
                            question.concept_ids = response.data;
                        }
                    )
                    .catch(
                        error => {
                            console.error("錯誤！概念獲取失敗", error);
                        }
                    );

                }
            );

            // 等待所有 Promise 均完成後再執行後續邏輯
            Promise.all(promises)
                .then(
                    () => {

                        
                        
                        // 呼叫addQuestionAPI寫入處理完的題目資料
                        axios.post(
                            addQuestionByCsvAPI, {
                                params: {
                                
                                    question_type: question_type,
                                    selected_questions: selected_questions
                                
                                },
                                withCredentials: true,
                            }
                        )
                        .then(
                            response => {
                                get_allQuestion();  // 成功新增後重新獲取question_lib內容
                                get_allConcept();   // 成功新增後重新獲取concept_lib內容
                                show_quesFormImportCSV.value = false;
                                message.success("CSV匯入成功！")

                                // 匯入成功後切回顯示未驗證題目
                                isVerified.value = false;
                                isVerified_handleChange();
                            }
                        )
                        .catch(
                            error => {
                                message.error("錯誤！CSV匯入失敗");
                            }
                        )
                        
                    }
                )
                .catch(
                    error => {
                        console.error("錯誤！處理過程中發生問題", error);
                    }
                );

        }

    }

    const options_exportCSV = ref(
        [
            {
                label: ".csv檔",
                key: "csv"
            },
            {
                label: ".xlsx檔",
                key: "xlsx"
            }
        ]
    );
    
    const selectAction_exportCSV = (key) => {
        if(key == 'csv') {
            downloadCSV();
        }
        else if(key == 'xlsx') {
            downloadXLSX();
        }
    }

    function downloadXLSX() {

        let worksheet;
        let data;
        
        if(currentTable.value === 'choiceQues') {

            data = choiceQuesTable_data.value.map(
                ( { question_id, concept_names, concept_ids, ...rest} ) => (
                    {
                        ...rest,
                        concept_names: concept_names.join(',') // 使用逗號連接concept_names陣列中的值
                    }
                )
            );

            // 創建選擇題的工作表
            worksheet = XLSX.utils.json_to_sheet(
                data,
                {
                    header: [
                        "exam_type",
                        "concept_names",
                        "degree", "content",
                        "option1", "option2",
                        "option3", "option4",
                        "answer",
                        "answer_explain"
                    ]
                }
            );

        }
        else if(currentTable.value === 'shortAnsQues') {
            
            data = shortAnsQuesTable_data.value.map(
                ( { question_id, concept_names, concept_ids, ...rest} ) => (
                    {
                        ...rest,
                        concept_names: concept_names.join(',') // 使用逗號連接concept_names陣列中的值
                    }
                )
            );
            
            // 創建簡答題的工作表
            worksheet = XLSX.utils.json_to_sheet(
                data,
                {
                    header: [
                        "exam_type",
                        "concept_names",
                        "degree",
                        "content",
                        "answer"
                    ]
                }
            );
        }

        const workbook = XLSX.utils.book_new();    // 創建一個新的工作簿
        const sheetName = currentTable.value === 'choiceQues' ? '選擇題' : '簡答題'; // 根據當前table決定工作表名稱

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // 把工作表加入到這個工作簿中

        // 將工作簿導出為 .xlsx
        XLSX.writeFile(workbook, `${sheetName}.xlsx`);

    }

    const isVerified = ref(true);
    
    function isVerified_handleChange() {
        get_allQuestion();
    }

    function button_invalidateQues(row) {
        // console.log('invalidate: ', row.question_id);
        modify_quesVerification(0, row.question_id);
    }

    function button_verifyQues(row) {
        // console.log('verify: ', row.question_id);
        modify_quesVerification(1, row.question_id);
    }

    function modify_quesVerification(is_verified, question_id) {
        axios.post(
            modifyQuesVerificationAPI, {
                params: {
                    isVerified: is_verified,
                    question_id: question_id
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                get_allQuestion();
            }
        )
        .catch(
            error => {
                message.error("錯誤！");
            }
        )
    }

    const quesForm_option1_input_isDisable = ref(false);
    const quesForm_option1_button_isDisable = ref(false);

    const quesForm_option2_input_isDisable = ref(false);
    const quesForm_option2_button_isDisable = ref(false);

    const quesForm_option3_input_isDisable = ref(false);
    const quesForm_option3_button_isDisable = ref(false);

    const quesForm_option4_input_isDisable = ref(false);
    const quesForm_option4_button_isDisable = ref(false);

    async function button_optionRegenerate(option) {

        const messageInstance = message.loading("載入中，請稍候...");

        if(option == 'A') {
            quesForm_option1_input_isDisable.value = true;
            quesForm_option1_button_isDisable.value = true;
        }
        else if(option == 'B') {
            quesForm_option2_input_isDisable.value = true;
            quesForm_option2_button_isDisable.value = true;
        }
        else if(option == 'C') {
            quesForm_option3_input_isDisable.value = true;
            quesForm_option3_button_isDisable.value = true;
        }
        else if(option == 'D') {
            quesForm_option4_input_isDisable.value = true;
            quesForm_option4_button_isDisable.value = true;
        }

        setTimeout(
            async() => {
                
                const result = await option_regenerate(quesForm_value.value, option)
                console.log(result);

                if(option == 'A') {
                    quesForm_option1_input_isDisable.value = false;
                    quesForm_option1_button_isDisable.value = false;
                    quesForm_value.value.option1 = result.revised_option
                }
                else if(option == 'B') {
                    quesForm_option2_input_isDisable.value = false;
                    quesForm_option2_button_isDisable.value = false;
                    quesForm_value.value.option2 = result.revised_option
                }
                else if(option == 'C') {
                    quesForm_option3_input_isDisable.value = false;
                    quesForm_option3_button_isDisable.value = false;
                    quesForm_value.value.option3 = result.revised_option
                }
                else if(option == 'D') {
                    quesForm_option4_input_isDisable.value = false;
                    quesForm_option4_button_isDisable.value = false;
                    quesForm_value.value.option4 = result.revised_option
                }
                
                quesForm_value.value.answer = result.revised_answer
                
                messageInstance.destroy(); // 掛載完成後關閉 loading
            },
            1e3 // 至少1000毫秒(1秒)
        );



    }










    
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
        /* border: 2px solid yellow; */
        display: flex;
        margin: 10px;
        width: 90%;
        justify-content: space-between;
    }
    .selectStyle {
        margin-right: 5px; 
        width: 200px;   
        max-width: 90%;
    }
    .table_style {
        align-items: center;
        width: 90%;
    }
    





    :root {
        --global-font-size: 16px;
    }
    .n-button, .n-data-table, .n-card, .n-form-item {
        font-size: var(--global-font-size);
    }
</style>