<template>
    <div class="actionContainer_style" :style="{ fontSize: fontSize + 'px' }">
        <n-select :options="course_options" class="selectStyle"/>
        <n-button type="primary" animated @click="addFile">
            新增教材
        </n-button>
    </div>
    
    <n-data-table
        :columns="materialTable_columns"
        :data="materialTable_data"
        :pagination="{ pageSize: 10 }"
        :style="{ fontSize: fontSize + 'px' }"
        :bordered="false"
        class="table_style"
        @update:checked-row-keys="material_checkHandler"
        :single-line="false"
    />
</template>

<script setup>

    import { h, ref } from "vue";
    import { NButton, useMessage } from "naive-ui";

    const message = useMessage();

    const course_options = [
        {
            label: "電腦視覺",
            value: "computerVision",
            disabled: false
        },
        {
            label: "自然語言處理",
            value: "NLP",
            disabled: false
        }
    ];

    function create_materialTable_columns( {download, modify, remove} ) {
        return [
            { type: 'selection' },

            {
                title: "檔名",
                key: "fileName",
                sorter: 'default',
                align: "center"
            },

            {
                title: "大小(MB)",
                key: "fileSize",
                sorter: (row1, row2) => row1.fileSize - row2.fileSize,
                align: "center"
            },

            {
                title: "上傳日期",
                key: "uploadTime",
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
                                    style: { margin: '5px'},
                                    tertiary: true,
                                    onClick: () => download(row)
                                }, 
                                { default: () => "下載" }
                            ),
                            h(
                                NButton, {
                                    style: { margin: '5px'},
                                    tertiary: true,
                                    onClick: () => modify(row)
                                },
                                { default: () => "修改" }
                            ),
                            h(
                                NButton, {
                                    style: { margin: '5px'},
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

    const materialTable_columns = create_materialTable_columns({
        download(row) {
            message.info('下載 ' + row.fileName);
        },
        modify(row) {
            message.info('修改 ' + row.fileName);
        },
        remove(row) {
            message.info('刪除 ' + row.fileName);
        }
    });

    const materialTable_data = [
        {fileName: "08 春日影.flac", fileSize: 30.86, uploadTime: "下午 06:42:10", key: 0},
        {fileName: "01 名もなき何もかも.flac", fileSize: 23.23, uploadTime: "下午 06:42:11", key: 1},
        {fileName: "05 爆ぜて咲く.flac", fileSize: 27.90, uploadTime: "下午 06:42:12", key: 2}
    ];

    const addFile = () => {
        message.info('檔案上傳!!!!!!');
    }
    
    const material_checkHandler = (rowKeys) => {
        if(rowKeys[0] != null) {
            message.info(rowKeys[0]);
        }
    };

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
        padding: 5px;
        display: flex;
        flex-direction: row;
        margin: 5px;
        align-items: center;
    }
    .selectStyle {
        margin-right: 5px; 
        width: 200px;   
        max-width: 90%;
    }
    .table_style {
        align-items: center;
        width: 1000px;
        max-width: 90%;
    }
    :root {
        --global-font-size: 16px;
    }
    .n-button, .n-data-table, .n-select {
        font-size: var(--global-font-size);
    }
</style>