<!-- 01-Home.vue -->
<template>
    <div class="page">
        <div class="Main" :style="{ fontSize: fontSize + 'px' }">
            <n-grid cols="1 1380:4 1835:2" :x-gap="12" :y-gap="12">
                <n-gi span="2">
                    <n-card tag="div" class="section activity" style="height: 600px;">
                        <h2 style="font-size: 24px;">公告</h2>
                        <n-scrollbar style="height: 500px; position: relative; padding-right: 25px;">
                            <div v-for="(message, index) in announcement" :key="index"  
                            @mouseenter="hoverAnnouncement = index" @mouseleave="hoverAnnouncement = null"  
                            @click="announceModal(message, index)">
                                <n-badge :dot="!message.isRead" style="display: flex; margin: 10px">
                                    <n-card hoverable style="background-color: rgba(2, 172, 223, 0.045);" :bordered="false">   
                                        <!-- <n-checkbox v-model="message.selected"></n-checkbox> -->
                                        <!-- <div style="flex-grow: 1; cursor: pointer; font-size: 16px; position: relative; margin-left: 200px"> -->
                                        <span style="font-size: 18px;">{{ message.subject }}</span>
                                            <!-- <div style="font-size: 16px; color: #999; position: absolute; margin-left: 300px; bottom: 0; width: 50px;">{{ "10/18" }}</div> -->
                                        <!-- </div> -->
                                        <!-- <n-icon :component="message.important ? starred : unstar" size="20" @click.stop="toggleImportant(message)" /> -->
                                    </n-card>
                                </n-badge>
                            </div>
                        </n-scrollbar>
                    </n-card>
                </n-gi>
                <n-gi span="2">
                    <n-card tag="div" class="section activity" style="height: 600px;">
                        <h2 style="font-size: 24px;">私人訊息</h2>
                        <n-scrollbar style="height: 500px; position: relative; padding-right: 25px;">
                            <div v-for="(message, index) in messages" :key="index"
                            @mouseenter="hoverMessage = index" @mouseleave="hoverMessage = null" 
                            @click="massageModal(message, index)">
                            <n-badge :dot="!message.isRead" style="display: flex; margin: 10px">
                                    <!-- <n-checkbox v-model="message.selected"></n-checkbox> -->
                                    <n-card hoverable style="background-color: rgba(2, 172, 223, 0.045);" :bordered="false"> 
                                        <!-- <n-icon v-if="message.important" size="20"><star-icon /></n-icon> -->
                                        <span style="font-size: 18px;">{{ message.subject }}</span>
                                        <!-- <div style="font-size: 16px; color: #999; position: absolute; margin-left: 300px; bottom: 0; width: 50px;">{{ "10/18" }}</div> -->
                                    </n-card>
                                    <!-- <n-icon :component="message.important ? starred : unstar" size="20" @click.stop="toggleImportant(message)" /> -->
                            </n-badge>
                            </div>
                        </n-scrollbar>
                        <div style="position: absolute; bottom: 50px;">
                            <n-button type="info" @click="showForm = true" block>
                                問題回報
                            </n-button>
                        </div>
                    </n-card>
                </n-gi>
            </n-grid>
            <!-- Announcement Modal -->
            <n-modal v-model:show="showAnnouncementModal" class="custom-card" preset="card" style="width: 800px; height: 250px;" title="公告詳情" size="small" :bordered="false">
                <div>
                    <n-card style="margin-top: 20px;">
                        <h3>{{ selectedAnnouncement.subject }}</h3>
                        <p> {{ selectedAnnouncement.details }}</p>
                    </n-card>
                </div>
            </n-modal>

            <!-- Message Modal -->
            <n-modal v-model:show="showMessage" class="custom-card" preset="card" style="width: 800px; height: 500px;" size="small" :bordered="false">
                <div>
                    <!-- <n-card>
                        <h3>{{ "您提出的問題" }}</h3>
                    </n-card> -->
                    <n-card style="margin-top: 20px; height: 250px;">
                        <h3>{{ selectedMessageContent.subject }}</h3>
                        <p>{{ selectedMessageContent.details }}</p>
                    </n-card>
                </div>
            </n-modal>
            
            <!-- Form Modal -->
            <n-modal v-model:show="showForm" class="custom-card" preset="card" style="width: 800px; height: 600px;" title="問題回報" size="small" :bordered="false">
                <n-form ref="formRef" :model="formData" :rules="formRules">
                    <!-- <n-form-item label="收件者" path="recipient" style="margin-top: 15px; ">
                        <n-select :options="recipientOptions" v-model:value="formData.recipient" placeholder="請選擇收件者"  />
                    </n-form-item> -->
                    <n-form-item path="subject" label="主旨">
                        <n-input
                            v-model:value="formData.subject"
                            placeholder="請輸入主旨"
                            style="height: 50px; font-size: 18px; align-items: center; justify-content: center;"
                        />
                    </n-form-item>
                    <n-form-item label="問題描述" path="problemDescription">
                        <n-input
                            v-model:value="formData.problemDescription"
                            type="textarea"
                            placeholder="請輸入問題描述..."
                            rows="13"
                            style="font-size: 16px; align-items: center; justify-content: center;"
                        />
                    </n-form-item>
                </n-form>
                    <n-space justify="end">
                        <n-button type="primary" @click="submitReport" :disabled="!formData.subject || !formData.problemDescription" style="margin-bottom: 50px; right: 10px">提交</n-button>
                        <!-- <n-button @click="closeForm">取消</n-button> -->
                    </n-space>
            </n-modal>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage} from 'naive-ui';
import Mail from '@/components/Home/mail.vue';
import { addRecordAPI } from'@/config/ApiRoutes';
import { StarOutline as unstar, Star as starred } from '@vicons/ionicons5';
import axios from 'axios';
const PermissionsRef = inject('PermissionsRef')
const message = useMessage();
const router = useRouter();
if(!PermissionsRef.isboss.value){
    router.replace('/main/practice/record')
    message.warning('權限不足')
}
// Initialize refs for container and router
const container = ref(null);
const showMessage = ref(false);
const showForm = ref(false);
const selectedMessageContent = ref('');
const fontSize = inject('fontSize');
const count = ref();
const showAnnouncementModal = ref(false);
const selectedAnnouncement = ref({ subject: '', details: '' });
const formData = ref({
    recipient: null,
    subject: '',
    problemDescription: '',
});

const announcement = ref([
    { subject: '歡迎加入', details: '我們非常高興您使用本系統。', important: false, isRead: false },
    { subject: '使用注意事項', details: '由於使用不同裝置可能會導致介面跑掉，建議您利用電腦使用本系統。', important: true, isRead: false },
]);

const announceModal = (announce, index) => {
    selectedAnnouncement.value = announce;
    showAnnouncementModal.value = true;
    announcement.value[index].isRead = true;
};

const hoverAnnouncement = ref(null);
const hoverMessage = ref(null);

const messages = ref([
    // { subject: '回復您的信件', details: '我們非常高興你加入我們的團隊。', important: false, isRead: false },
]);

const massageModal = (message, index) => {
    selectedMessageContent.value = message;
    showMessage.value = true;
    messages.value[index].isRead = true;
};

const toggleImportant = (message) => {
    message.important = !message.important;
};

const recipientOptions = ref([
    { label: '楊景明 教授', value: 'professor' },
    { label: '戴嘉盛 助教', value: 'assistant' },
]);

const formRules = {
    recipient: {
        required: true,
        message: '請選擇收件人',
        trigger: ['blur', 'change'],
    },
    subject: {
        required: true,
        message: '請輸入主旨',
        trigger: ['blur', 'change'],
    },
    problemDescription: {
        required: true,
        message: '請描述問題',
        trigger: ['blur', 'change'],
    },
};

const submitReport = () => {
    showForm.value = false;
    formData.value.problemDescription = '';
    formData.value.recipient=null;
    formData.value.subject='';
};
const closeForm = () => {
    showForm.value = false;
    formData.value.problemDescription = '';
};

// Function to navigate to different routes
const goToRoute = (name) => {
    if (name == 'announce') {
        message.warning('頁面建置中');
        add_record('查看所有公告');

    }
    else if(name == 'history') {
        router.push({ name });
    }
};

function add_record(action) {
    axios.get(
        addRecordAPI, {
            params: {
                action: action
            },
            withCredentials: true,
        }
    )
    .then(
        response => {

        }
    )
    .catch(
        error => {
            console.log("紀錄錯誤");
        }
    )
}

watch(fontSize, (newSize) => {
    document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
});
// Set up event listeners and DOM manipulations on component mount
onMounted(() => {
    document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
    const containerElement = container.value;
    if (containerElement) {
        const cloneContainer = containerElement.cloneNode(true);
        cloneContainer.classList.add('duplicate');
        containerElement.append(cloneContainer);

        containerElement.addEventListener('click', () => {
            containerElement.classList.add('slide', 'no-load');
            const rows = containerElement.querySelectorAll('.row');
            const lastRow = rows[rows.length - 1];
            lastRow.addEventListener('animationend', () => {
                containerElement.classList.remove('slide');
            });
        });
    }
});
</script>

<style scoped>
:root {
    --global-font-size: 16px;
}

.item, .section, h2, p, .n-button, .n-card_content, .n-card, .n-timeline {
    font-size: var(--global-font-size);
}

.Main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 75%;
    padding: 20px;
    font-size: var(--button-font-size);
}
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* height: 93vh; */
}
.section {
    padding: 20px;
    border-radius: 10px;
}

.message-item {
    display: flex;
    transition: box-shadow 0.3s ease;
    padding: 10px;
    background-color: rgba(2, 172, 223, 0.045);
    margin-bottom: 10px;
    
}
.message-item:hover {
    cursor: pointer;
}

h2 {
    margin-top: 0;
}
.n-button {
    height: 40px;
    width: 100%;
}
.item {
    display: flex;
    align-items: center;
    height: 46px;
    justify-content: center;
    margin-bottom: 10px;
    background-color: rgba(2, 172, 223, 0.045);
}

.item:last-child {
    margin-bottom: 0;
}

@media (max-width: 1380px) {
    .page {
        display: flex;
        flex-direction: column;
    }
}
</style>
