<!-- 00-Main.vue -->
<template>
    <n-layout class="body" :style="{ fontSize: fontSize + 'px' }"> 
      <!-- 頁面頂部導航欄 -->
      <n-layout-header position="fixed" bordered>
        <n-flex class="nav_bar" justify="space-around" size="large">
          <!-- 應用標題 -->
          <div class="title">SmartyPantsPal</div>
          <!-- 自定義導航欄組件 -->
          <n-flex vertical justify="center">
            <navigationbar :NewPermissions="props.NewPermissions" />
          </n-flex>
          <!-- 用戶功能 -->
          <n-flex class="font-adjust-buttons" align="center" v-if="isMenuVisible">
            <n-button-group>
              <n-button @click="smallFont" :disabled="fontSize <= 11">小</n-button>
              <n-button @click="largeFont" :disabled="fontSize >= 19">大</n-button>
            </n-button-group>
          </n-flex>
          <User :NewPermissions="props.NewPermissions" />
        </n-flex>
      </n-layout-header>
  
      <!-- 內容區域 -->
      <n-layout-content :style="{ overflowY: 'auto', height: 'calc(100vh - 53.4px)' }" :native-scrollbar="false">
        <div>
          <!-- 加載動畫 -->
          <loading
            v-if="theme"
            v-model:active="isLoading"
            :can-cancel="false"
            :is-full-page="false"
            background-color="rgba(255, 255, 255, 1)"
            :opacity="1"
            transition="none"
          >
            <div class="loadingio-spinner-spinner-2by998twmg8">
              <div class="ldio-yzaezf3dcmj">
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
              </div>
            </div>
            <div class="loading-text">Loading</div>
          </loading>
  
          <loading
            v-else-if="!theme"
            v-model:active="isLoading"
            :can-cancel="false"
            :is-full-page="false"
            background-color="rgba(26, 43, 52, 1)"
            :opacity="1"
            transition="none"
          >
            <div class="loadingio-spinner-spinner-2by998twmg8">
              <div class="ldio-yzaezf3dcmj">
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
                <div></div><div></div><div></div><div></div>
              </div>
            </div>
            <div class="loading-text">Loading</div>
          </loading>
  
          <!-- Router 視圖 -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in" :duration="300">
              <component :is="Component" :NewPermissions="props.NewPermissions" />
            </transition>
          </router-view>
  
          <!-- 浮動按鈕 -->
          <div class="floatingButtonWrapper">
            <n-float-button type="primary" @click="showModal = true" width="70px" height="70px" v-if="isPermitted()">
              <n-icon size="30px">
                <Icon />
              </n-icon>
            </n-float-button>
          </div>
          
          <!-- 彈出卡片 -->
          <transition name="fade">
                    <n-card
                        v-if="showModal"
                        title="小幫手"
                        closable
                        @close="handleClose"
                        :class="{ lightheme: theme, darktheme: !theme }"
                        :style="{ position: 'fixed' }"
                    >
                        <!-- 左上角可調整大小的手柄 -->
                        <div class="resize-handle" @mousedown="startResizing"></div>

                        <template #header>
                        <div class="header">
                            <n-icon @click="showModal = false" size="20px" class="close-icon">
                            <Icon name="close" />
                            </n-icon>
                            <span>小幫手</span>
                        </div>
                        </template>

                        <!-- 聊天內容區域 -->
                        <div class="chat-container">
                        <n-scrollbar ref="scrolldown" style="height: 355px" trigger="none">
                            <div class="messages">
                            <div
                                v-for="(msg, index) in messages"
                                :key="msg.id"
                                class="message"
                                :class="msg.arrowDirection"
                            >
                            <div class="message-content" v-html="renderMarkdown(msg.text)"></div>
                            </div>
                            </div>
                        </n-scrollbar>
                        <div class="input-wrapper">
                            <n-input
                            v-model:value="newMessage"
                            @keyup.enter="sendMessage"
                            :placeholder="placeholder"
                            class="input"
                            :disabled = "input_flag"
                            :loading = "input_flag"
                            />
                        </div>
                        </div>
                    </n-card>
                    </transition>

        </div>
      </n-layout-content>
    </n-layout>
  </template>
  

<script setup>
import { inject, onMounted, onUnmounted, provide, ref, nextTick } from 'vue';
import navigationbar from '@/components/Main/Navigationbar.vue';
import User from '@/components/Main/User.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useTerminal } from '@/utils/terminal';
import { useMessage, useDialog, NScrollbar } from 'naive-ui';
import { logoutAPI } from '@/config/ApiRoutes';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { ChatbubbleEllipsesSharp as Icon } from '@vicons/ionicons5';
import { UploadUserQueryAPI,GetGptResponseAPI } from '@/config/ApiRoutes';
const PermissionsRef = inject('PermissionsRef')
// Hook initialization for dialog, message, and router functionalities
const dialog = useDialog();
const message = useMessage();
const router = useRouter();

// Dynamic theming support
const theme = inject('theme');
const props = defineProps(['NewPermissions']);

const placement = inject('placement');
const ModStatus = inject('ModStatus');
const windowWidth = ref(window.innerWidth);
const isMenuVisible = ref(window.innerWidth >= 1380);
const isMenuDisable = ref(false);
const input_flag = ref(false)
const placeholder = ref('請輸入問題')
provide('isMenuDisable', isMenuDisable);

onMounted(() => {
    const handleResize = () => {
        windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    watch(windowWidth, (newWidth) => {
        if (newWidth >= 1380) {
            isMenuVisible.value = true;
        } else {
            isMenuVisible.value = false;
        }
        handleResize();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });
});
provide('windowWidth', windowWidth);
provide('isMenuVisible', isMenuVisible);

const isPermitted = () =>{
    if (!PermissionsRef.isboss.value){
        return false;
    }else{
        return true;
    }
}


const isLoading = ref(false);
// const pageOrder = [
//   { regex: /^\/main\/home/, index: 1 },
//   { regex: /^\/main\/test\/*/, index: 2 },
//   { regex: /^\/main\/practice\/*/, index: 3 }
// ]
// const transitionName = ref('slide-right')

// const currentPageIndex = computed(() => {
//   const routePath = router.currentRoute.value.path;
//   const matchingRule = pageOrder.find(rule => rule.regex.test(routePath));
//   return matchingRule ? matchingRule.index : 0;
// });
// let previousPageIndex = 0;
// watch(currentPageIndex, (newIndex) => {
//   transitionName.value = newIndex > previousPageIndex ? 'slide-left' : 'slide-right';
//   console.log({
//     currentPageIndex: currentPageIndex.value,
//     "transitionName.value":transitionName.value,
//     "previousPageIndex":previousPageIndex,
//     "newIndex":newIndex
//   })
//   previousPageIndex = newIndex;
// });

// Route guards for loading state
router.beforeEach((to, from, next) => {
    isLoading.value = true; // Start loading
    isMenuDisable.value = true;
    next();
});
router.afterEach(() => {
    setTimeout(() => {
        // Optionally add a timeout for better UX
        isLoading.value = false; // Stop loading
        isMenuDisable.value = false;
        // console.log('Stop loading')
    }, 500); // Adjust time based on your needs
});

const placementArray = [{ placement: 'top' }, { placement: 'bottom' }, { placement: 'top-left' }, { placement: 'top-right' }, { placement: 'bottom-left' }, { placement: 'bottom-right' }];
const placementMap = {
    '-t': 'top',
    '-b': 'bottom',
    '-tl': 'top-left',
    '-tr': 'top-right',
    '-bl': 'bottom-left',
    '-br': 'bottom-right',
};

// Function to change message placement
const changeMsgPlacement = (newPlacement) => {
    if (!newPlacement) {
        message.info(`Current message placement is ${placement.value}`);
        return;
    }
    const isValidPlacement = placementArray.some((p) => p.placement === newPlacement);
    if (isValidPlacement) {
        placement.value = newPlacement;
        message.info(`Message placement changed to ${newPlacement}`);
        message.info("This change won't save.");
    } else {
        message.error('Invalid placement specified');
        const availablePlacements = placementArray.map((p) => p.placement).join(', ');
        message.info(`Available placements: ${availablePlacements}`, { duration: 10e3, showIcon: false });
    }
};

const ModArray = [
    // Array of available placements for messages
    { Mod: 'test' },
    { Mod: 'normal' },
];
const ModMap = {
    '-t': 'test',
    '-n': 'normal',
};

// Function to change mod status
const changeMod = (newMod) => {
    // console.log(props)
    if (props.NewPermissions.isboss.value) {
        if (!newMod) {
            message.info(`Current mod is ${ModStatus.value}`);
            return;
        }
        const isValidMod = ModArray.some((p) => p.Mod === newMod);
        if (isValidMod) {
            try {
                ModStatus.value = newMod;
                message.info(`Access mod changed to ${newMod}`);
            } catch (error) {
                message.error('An error occurred when changing mod.');
                console.log(error);
            }
        } else {
            message.error('Invalid mod specified');
            const availableMod = ModArray.map((p) => p.Mod).join(', ');
            message.info(`Available mods: ${availableMod}`, { duration: 5e3, showIcon: false });
        }
    } else {
        message.error('Access Denied');
    }
    // console.log({
    //   mod: ModStatus.value
    // })
};

// Function to toggle the theme
const changetheme = () => {
    theme.value = !theme.value;
    message.info('Theme Changed');
    message.info("This change won't save.");
};

const clearConsole = () => {
    console.clear();
}

// Command pattern for handling special keyboard inputs
const customCommands = {
    '/clear': () => clearConsole(),

    // '/logout': () => logout(),
    // '/changetheme': () => changetheme(),
    // '/theme': () => changetheme(),
    // '/msg': (val) => {
    //     const fullPlacement = placementMap[val] || val;
    //     changeMsgPlacement(fullPlacement);
    // },
    // '/mod': (val) => {
    //     const fullMod = ModMap[val] || val;
    //     changeMod(fullMod);
    // },
};

const { handleKeydown } = useTerminal(customCommands);

// Function to handle user logout
const logout = async () => {
    try {
        const response = await axios.post(logoutAPI, {}, { withCredentials: true });
        router.push({ name: 'Login' });
    } catch (error) {
        message.error('Something went wrong during logout');
    }
};

// Event listeners for component lifecycle
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

const totalScore = ref('');
provide('totalScore', totalScore);

// Modal state
const showModal = ref(false);

// Handle close method
const handleClose = () => {
    showModal.value = false;
};

const fontSize = inject('fontSize');
const largeFont = () => {
    fontSize.value += 4;
};
const smallFont = () => {
    fontSize.value -= 4;
};

// Chat state
const messages = ref([]);
const newMessage = ref('');
const scrolldown = ref(null);
const messageRefs = ref([]);
import { marked } from "marked";
const sendMessage = async (e) => {
    e.preventDefault();
    console.log("13231")
    // if(Event.key!=='ENTER'){return}
    // 1. 檢查用戶輸入是否為空
    if (newMessage.value.trim()) {
        const messageContent = newMessage.value;
        let date = new Date()

        // 2. 將用戶訊息加入到聊天記錄中
        messages.value.push({ 
            id: Date.now(), 
            text: messageContent, 
            arrowDirection: 'right-arrow', 
            isMarkdown: false // 用戶輸入一般不需要 Markdown 渲染
        });

        // 3. 清空輸入框
        newMessage.value = '';

        try {
            // 4. 上傳用戶訊息到資料庫
            await axios.post(UploadUserQueryAPI, {
                params: {
                    user_id: props.NewPermissions.name.value,
                    user_query: messageContent,
                    user_query_time: formatDateTime(date)
                }
            });
            console.log('User message saved to database successfully');
            input_flag.value = !input_flag.value
            placeholder.value = "回應生成中，禁止輸入!"
            // 5. 調用後端 API 獲取 GPT 回應
            const response = await axios.post(GetGptResponseAPI, {
                params: {
                    user_id: props.NewPermissions.name.value,
                    user_query: messageContent,
                    user_query_time: formatDateTime(date)
                }
            });
            
            // 6. 將 GPT 回應加入聊天記錄
            const gptResponse = response.data;
            messages.value.push({ 
                id: Date.now() + 1, 
                text: renderMarkdown(gptResponse), // 將 GPT 的回應渲染為 Markdown
                arrowDirection: 'left-arrow', 
                isMarkdown: true // GPT 回應可能包含 Markdown
            });
            input_flag.value = !input_flag.value
            placeholder.value = "請輸入問題"
        } catch (error) {
            console.error('Failed to handle user message or get GPT response:', error);
            // 顯示錯誤訊息
            messages.value.push({ 
                id: Date.now() + 2, 
                text: 'Sorry, something went wrong. Please try again later.', 
                arrowDirection: 'left-arrow', 
                isMarkdown: false // 錯誤訊息不需要 Markdown 渲染
            });
        }
    }
};

// 渲染 Markdown 的方法
function renderMarkdown(text) {
    // 使用 marked 渲染 Markdown，並用 DOMPurify 清理 HTML
    return marked(text);
}



// 監聽 messages 的變化
watch(messages, async () => {
    await nextTick(); // 等待 DOM 更新
    const lastMessageElement = messageRefs.value[messageRefs.value.length - 1];
    if (lastMessageElement) {
        lastMessageElement.scrollIntoView({ behavior: 'smooth' }); // 平滑捲動到最後一個訊息
    }
}, { deep: true });

// 將訊息元素綁定到 messageRefs
const setMessageRef = (el, index) => {
    messageRefs.value[index] = el;
};

function formatDateTime(date) {
    const d = new Date(date);
    const taipeiTime = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const year = taipeiTime.getFullYear();
    const month = `0${taipeiTime.getMonth() + 1}`.slice(-2);
    const day = `0${taipeiTime.getDate()}`.slice(-2);
    const hour = `0${taipeiTime.getHours()}`.slice(-2);
    const minute = `0${taipeiTime.getMinutes()}`.slice(-2);
    const second = `0${taipeiTime.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap');
.title {
    align-self: center;
    font-weight: bold;
    font-size: 2.2em;
    font-family: 'Saira Condensed', sans-serif;
    font-weight: 700;
    font-style: normal;
}
.container {
    display: flex;
    flex-direction: column;
    height: 93vh;
}
.router {
    flex-direction: column;
    flex-grow: 1;
    display: flex;
}
.n-layout .n-layout-scroll-container {
    overflow-x: unset;
}
.nav_bar {
    /* height: 60px; */
    display: flex;
    align-items: center;
}
.font-adjust-buttons{
    margin-left: -200px; 
}

.slide-right-enter-from,
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
.slide-left-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
.slide-right-leave-from,
.slide-right-enter-to,
.slide-left-leave-from,
.slide-left-enter-to {
    opacity: 1;
}
.slide-right-leave-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-left-enter-active {
    transition: all 0.5s;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes ldio-yzaezf3dcmj {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
.ldio-yzaezf3dcmj div {
    left: 94px;
    top: 48px;
    position: absolute;
    animation: ldio-yzaezf3dcmj linear 1s infinite;
    background: #ffda78;
    width: 12px;
    height: 24px;
    border-radius: 6px / 12px;
    transform-origin: 6px 52px;
}
.ldio-yzaezf3dcmj div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -0.9166666666666666s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -0.8333333333333334s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.75s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.6666666666666666s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.5833333333333334s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.5s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.4166666666666667s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.3333333333333333s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.25s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.16666666666666666s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.08333333333333333s;
    background: #ffda78;
}
.ldio-yzaezf3dcmj div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
    background: #ffda78;
}
.loadingio-spinner-spinner-2by998twmg8 {
    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
    background: rgba(255, 255, 255, 0);
}
.ldio-yzaezf3dcmj {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
}
.ldio-yzaezf3dcmj div {
    box-sizing: content-box;
}
.loading-text {
    font-size: 25px;
    text-align: center;
    font-family: 'Saira Condensed', sans-serif;
    font-weight: 700;
    font-style: normal;
}

.floatingButtonWrapper {
    position: fixed;
    right: 20px;
    bottom: 20px;
}
.n-card{
    width:280px; 
    height: 500px;
    bottom: 110px;
    right: 10px; 
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f5f5f5;
}

.close-icon {
    cursor: pointer;
    color: #000;
}

.lightheme {
    border: 2px solid hwb(118 53% 19% / 0.548);
}

.darktheme {
    border: 2px solid hwb(192 67% 0% / 0.521);
}

@media (max-width: 1200px) {
    .body {
        font-size: 12px;
    }
    .nav_bar {
        flex-direction: column;
    }
    .floatingButtonWrapper {
        transform: scale(0.8);
        right: 10px !important;
        bottom: 10px !important;
    }
    .n-card{
        height: 350px;
        width: 200px;
        bottom: 85px;
    }
    .messages {
        font-size: 8.5px;
        /* height: 220px; */
        /* overflow: hidden; */
    }
    .chat-container {
        height: 280px !important;
        width: 165px !important;
    }
    .input{
        padding: 5px;
        width: 80%;
        margin-bottom: 15px;
        font-size: 10px;
    }
    :deep(.scrollbar){
        height: 230px;
    }
    
}
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    width: 105%;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    padding-right: 25px;
    padding-left: 0px;
    /* max-height: 345px; */
}
.message {
    margin-bottom: 10px;
    display: flex;
    width: 100%;
    overflow-y: auto;
}

.message.right-arrow .message-content {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 15px;
    position: relative;
    max-width: 100%;
    display: inline-block;
    margin-left: auto;
    text-align: right;
    overflow-y: auto;
    color: #000;
}

.message.left-arrow .message-content {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 15px;
    position: relative;
    max-width: 100%;
    display: inline-block;
    margin-right: auto;
    text-align: left;
    overflow-y: auto;
    color: #000;
}

.input-wrapper {
    border-top: 1px solid #f1f1f1;
    left: -10px;
    padding: 10px;
    display: flex;
    align-items: center;
    position: absolute; /* Fixed at the bottom of chat-container */
    bottom: -10px;
    width: 95%; /* Ensure it spans the entire width of chat-container */
}

input {
    flex: 1;
    border: none;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    background-color: #f1f1f1;
    color: #000;
}

.floatingButtonWrapper {
    right: 25px;
    bottom: 25px;
    width: 70px;
    height: 70px;
}
:root {
    --global-font-size: 16px;
}
.n-button {
    font-size: var(--global-font-size);
}
</style>
