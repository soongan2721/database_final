<template>

    <!-- XLSX匯入表單 -->
    <n-modal v-model:show="show_registryForm_importXLSX" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">
            <n-flex vertical>

                <h2 style="text-align: center; margin-top: 0px">註冊表匯入</h2>
            
                <n-data-table
                    :columns="registryForm_importXLSX_columns"
                    :data="registryForm_importXLSX_data"
                    :rowKey="row => row.key"
                    v-model:checked-row-keys="registryForm_importXLSX_value.selectedUser"

                    :bordered="true"
                    :style="{ fontSize: fontSize + 'px', width: '100%' }"
                    :width=100
                    :max-height="250"
                    virtual-scroll
                    class="table_style"
                />

                <n-card style="justify-items: center; align-items: center; border: none;">
                    <n-button @click="button_submit_registryForm_importXLSX">
                        匯入
                    </n-button>
                </n-card>

            </n-flex>
        </n-card>
    </n-modal>

    <!-- 單筆匯入表單 -->
    <n-modal v-model:show="show_addUserForm" :style="{ fontSize: fontSize + 'px' }">
        <n-card style="width: 300px;">

            <h2 style="text-align: center; margin-top: 0px">新增學號</h2>

            <n-form
                ref="addUserForm_ref"
                inline
                :label-width="80"
                :model="addUserForm_value"
                :rules="addUserForm_rules"
                class="form_style"
            >
            
                <n-form-item label="學號" path="username">
                    <n-input v-model:value="addUserForm_value.username" placeholder="請輸入概念名稱" />
                </n-form-item>

                <n-form-item>
                    <n-button @click="submit_addUserForm">
                        新增
                    </n-button>
                </n-form-item>

            </n-form>
        </n-card>
    </n-modal>

    <!-- 上方功能區 -->
    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">

        <!-- 批次刪除按鈕 -->
        <n-button type="error" animated @click="button_batchRemoveUser" v-if="show_batchRemoveButton">
            <n-icon>
                <Trash />
            </n-icon>
            &nbsp;一鍵刪除
        </n-button>

        <n-button-group v-if="show_buttonGroup">

            <!-- 上傳按鈕 -->
            <n-upload
                @change="handleUploadChange"
                style="margin-right: 5px;"
                :show-file-list="false"
                accept=".xlsx"
            >
                <n-button>上傳註冊表</n-button>
            </n-upload>

            <!-- 匯出按鈕 -->
            <n-button animated @click="button_exportXLSX">
                匯出註冊表
            </n-button>

        </n-button-group>

        <!-- 新增按鈕 -->
        <n-button type="primary" animated @click="button_addQues" v-if="show_addUserButton">
            新增學號
        </n-button>

    </div>
    
    <n-data-table
        :columns="registryTable_columns"
        :data="registryTable_data"
        @update:checked-row-keys="registryTable_checkHandler"
        v-model:checked-row-keys="registryTable_value.selected_user"
        :rowKey="row => row.registry_id"

        :bordered="false"
        :style="{ fontSize: fontSize + 'px' }"
        class="table_style"
        :max-height="500"
    />
    
</template>

<script setup>

    import { GetAllRegistryAPI, addUserToRegistry, removeUserFromRegistryAPI } from '@/config/ApiRoutes';
    import axios from 'axios';
    import { useMessage, NButton, useDialog } from "naive-ui";
    import * as XLSX from 'xlsx';
    import { Trash } from '@vicons/ionicons5'

    const message = useMessage();
    const dialog = useDialog();

    function create_registryTable_columns( {remove} ) {
        return [
            { type: 'selection'},
            { title: "學號", key: "username", align: "center", sorter: 'default',},
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
        ]
    }

    const registryTable_columns = create_registryTable_columns(
        {
            remove(row) {
                button_removeUser(row);
            }
        }
    );

    const registryTable_data = ref();

    function get_allRegistry() {
        axios.get(GetAllRegistryAPI)
            .then(
                response => {
                    registryTable_data.value = response.data;
                }
            )
            .catch(
                error => {
                    message.error("錯誤!!!!!，註冊表獲取失敗");
                }
            );
    }

    // 上傳按鈕handler
    const handleUploadChange = ( { file, fileList } ) => {

        const fileType = file.name.split('.').pop(); // 取得文件副檔名
        const reader = new FileReader();

        // 若匯入檔案為.xlsx
        if(fileType === 'xlsx') {

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

    const show_registryForm_importXLSX = ref(false);
    const registryForm_importXLSX_columns = ref();
    const registryForm_importXLSX_data = ref();
    const registryForm_importXLSX_value = ref(
        {
            selectedUser: []
        }
    );

    function importXLSX(workbook) {

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 將工作表轉為 JSON 格式
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });  // header: 1 表示資料的第一列作為標題列

        function create_registryForm_importXLSX() {
            return [
                { type: 'selection'},
                { title: "學號", key: "username", align: "center"},
            ]
        }

        // 處理資料
        const seenUsernames = new Set(); // 學號集合
        const formattedData = rows.slice(1)
            .map(
                (row, index) => (
                    {
                        key: index + 1,
                        username: String( row[0] ), // 統一轉成字串來判斷，以避免同學號但型態不同的問題
                    }
                )
            )
            .filter(
                item => {
                    if ( seenUsernames.has(item.username) ) {
                        return false; // 重複的學號，不加入
                    }
                    seenUsernames.add(item.username); // 加入新學號進集合中
                    return true; // 不重複的學號，保持在資料中
                }
            );
        
        registryForm_importXLSX_columns.value = create_registryForm_importXLSX();
        registryForm_importXLSX_data.value = formattedData;
        show_registryForm_importXLSX.value = true;
        
        // 預設為全部勾選
        registryForm_importXLSX_value.value.selectedUser = formattedData.map(item => item.key);
        
    }

    function button_submit_registryForm_importXLSX() {

        // 過濾勾選之使用者
        // 並且把過濾結果先轉為JSON格式再回傳
        const selected_user = JSON.parse(
            JSON.stringify(
                registryForm_importXLSX_data.value.filter(
                    item => registryForm_importXLSX_value.value.selectedUser.includes(item.key)
                )
            ) 
        );

        add_user_toRegistry(selected_user);

    }

    function add_user_toRegistry(selected_user) {
        
        // 呼叫addUserToRegistry寫入所選帳號
        axios.post(
            addUserToRegistry, {
                params: {

                    selected_user: selected_user,
                    registryTable_data: registryTable_data.value // 給後端判斷是否重複

                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                get_allRegistry();   // 成功新增後重新獲取registry_lib內容
                show_registryForm_importXLSX.value = false; // 關閉表單

                const successCount = response.data.successCount;
                const failureCount = response.data.failureCount;
                const dialogMessage = "匯入完成！ " + successCount + " 筆成功， " + failureCount + " 筆失敗"
                message.success(dialogMessage);
            }
        )
        .catch(
            error => { 
                message.error("錯誤！匯入失敗");
            }
        )
        
    }

    const show_addUserForm = ref(false);

    const addUserForm_rules = {
        username: {
            required: true,
            trigger: ['blur'],
            validator(rule, value) {
                if (!value) {
                    return new Error('請輸入帳號！');
                }
                else if ( ! /^\d{10}$/.test(value) ) {
                    return new Error('格式不符！');
                }
                else {
                    const isDuplicate = registryTable_data.value.some(
                        (user) => user.username == value
                    )
                    if(isDuplicate) {
                        return new Error("名稱重複！");
                    }
                    else {
                        return true;
                    }
                }
            }
        }
    }

    const addUserForm_value = ref(
        {
            username: null
        }
    )

    function button_addQues() {
        show_addUserForm.value = true;
    }

    const addUserForm_ref = ref(null);

    function submit_addUserForm(event) {

        event.preventDefault();

        addUserForm_ref.value.validate(
            (error) => {
                if(error) {
                    message.error("錯誤! 請確認輸入正確的格式");
                }
                else {



                    const selected_user = [];
                    selected_user.push(
                        {
                            username: addUserForm_value.value.username
                        }
                    );
                    
                    // 呼叫addUserToRegistry寫入所選帳號
                    axios.post(
                        addUserToRegistry, {
                            params: {

                                selected_user: selected_user,
                                registryTable_data: registryTable_data.value // 給後端判斷是否重複

                            },
                            withCredentials: true,
                        }
                    )
                    .then(
                        response => {
                            get_allRegistry();   // 成功新增後重新獲取registry_lib內容
                            show_addUserForm.value = false;
                            addUserForm_value.value.username = '';
                            message.success("匯入成功！")
                        }
                    )
                    .catch(
                        error => {
                            message.error("錯誤！匯入失敗");
                        }
                    )
                    
                    

                }
            }
        );
















        
        
    }

    function button_removeUser(row) {
        dialog.warning(
            {
                title: "確定要刪除嗎？",
                content: "此操作無法返回，確定要繼續嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    const selected_user = ref([]);
                    selected_user.value.push(row.registry_id)
                    remove_user(selected_user.value);
                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );
    }

    function remove_user(selected_user) {

        axios.post(
            removeUserFromRegistryAPI, {
                params: {
                    selected_user: selected_user
                },
                withCredentials: true,
            }
        )
        .then(
            response => {
                registryTable_value.value.selected_user = [];
                switch_normalOrBatch('normal');
                get_allRegistry();
                message.success("刪除成功！")
            }
        )
        .catch(
            error => {
                message.success("錯誤！刪除失敗")
            }
        )
        
    }

    function button_exportXLSX() {
        downloadXLSX();
    }

    function downloadXLSX() {

        let worksheet;
        let data;

        data = registryTable_data.value.map(
            ( { registry_id, ...rest} ) => rest  // 過濾掉registry_id欄位
        );
        
        // 創建工作表
        worksheet = XLSX.utils.json_to_sheet(
            data,
            {
                header: [
                    "username"
                ]
            }
        );

        const workbook = XLSX.utils.book_new();    // 創建一個新的工作簿
        const sheetName = '註冊表';

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // 把工作表加入到這個工作簿中

        // 將工作簿導出為 .xlsx
        XLSX.writeFile(workbook, `${sheetName}.xlsx`);

    }
    
    const show_addUserButton = ref(true)
    const show_buttonGroup = ref(true);
    const show_batchRemoveButton = ref(false);
    const removeButton_isDisable = ref(false);

    function switch_normalOrBatch(mode) {
        if(mode == 'normal') {
            
            show_batchRemoveButton.value = false;

            // 開啟table上方功能按鈕
            show_buttonGroup.value = true;
            show_addUserButton.value = true;
            // 開啟table中刪除按鈕
            removeButton_isDisable.value = false;

        }
        else if(mode == 'batch') {
            
            show_batchRemoveButton.value = true;

            // 關閉table上方功能按鈕
            show_buttonGroup.value = false;
            show_addUserButton.value = false;
            // 關閉table中刪除按鈕
            removeButton_isDisable.value = true;

        }
    }

    const registryTable_value = ref(
        {
            selected_user: []
        }
    )

    const registryTable_checkHandler = (rowKeys) => {

        if(rowKeys.length != 0) {
            switch_normalOrBatch('batch');
        }
        else {
            switch_normalOrBatch('normal');
        }

    }

    function button_batchRemoveUser() {
        dialog.warning(
            {
                title: "確定要刪除所選學號嗎？",
                content: "此操作無法返回，確定要繼續嗎？",
                positiveText: "確認",
                negativeText: "取消",
                
                onPositiveClick: () => {
                    remove_user(registryTable_value.value.selected_user);
                },
                onNegativeClick: () => {
                    // message.info("取消刪除");
                }
            }
        );
    }

















    const fontSize = inject('fontSize');
    watch(
        fontSize, (newSize) => {
            document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
        }
    );
    // Set up event listeners and DOM manipulations on component mount
    onMounted(
        () => {

            get_allRegistry();


            
            document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
        }
    );

</script>

<style scoped>

    .table_style {
        align-items: center;
        width: 50%;
    }
    .actionContainer_style {
        /* border: 2px solid yellow; */
        display: flex;
        margin: 10px;
        width: 50%;
        justify-content: space-between;
    }







    :root {
        --global-font-size: 16px;
    }
    .n-data-table{
        font-size: var(--global-font-size);
    }

</style>