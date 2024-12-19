<template>
    <!-- Main component template -->
    <div class="main">
        <!-- Naive UI space with vertical alignment and content class -->
        <n-space vertical class="content">
            <!-- Naive UI card component -->
            <n-card class="card_content">
                <!-- Naive UI tabs component -->
                <n-tabs
                    :value="activeTab"
                    @update:value="handleTabChange"
                    class="card-tabs"
                    default-value="signin"
                    justify-content="space-evenly"
                    size="large"
                    animated
                    pane-wrapper-style="margin: 0 -4px"
                    pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                >
                    <!-- Login tab pane -->
                    <n-tab-pane name="signin" tab="Login">
                        <!-- Naive UI form component -->
                        <n-form ref="loginForm" :model="loginData" :rules="loginRules">
                            <n-grid :cols="8" :x-gap="24">
                                <n-form-item-gi :span="8" label="User name" path="username">
                                    <n-tooltip trigger="hover">
                                        <template #trigger>
                                            <n-input @keyup.enter="handleLogin" v-model:value="loginData.username" placeholder="學號" />
                                        </template>
                                        請輸入十位數字
                                    </n-tooltip>
                                </n-form-item-gi>
                                <!-- Form item for password -->
                                <n-form-item-gi :span="8" label="Password" path="password">
                                    <n-tooltip trigger="hover">
                                        <template #trigger>
                                            <n-input
                                                @keyup.enter="handleLogin"
                                                v-model:value="loginData.password"
                                                :type="passwordVisible ? 'text' : 'password'"
                                                placeholder="密碼"
                                            >
                                                <!-- Use suffix slot to add icon for toggling password visibility -->
                                                <template #suffix>
                                                    <n-icon @click="togglePasswordVisibility">
                                                        <!-- Conditional rendering of eye or eye-off icon -->
                                                        <template v-if="passwordVisible">
                                                            <eye-outline />
                                                        </template>
                                                        <template v-else>
                                                            <eye-off-outline />
                                                        </template>
                                                    </n-icon>
                                                </template>
                                            </n-input>
                                        </template>
                                        請輸入至少六位字元
                                    </n-tooltip>
                                </n-form-item-gi>
                            </n-grid>
                            <n-button @click="handleLogin" type="primary" block strong> Login </n-button>
                        </n-form>
                    </n-tab-pane>
                    <!-- Signup tab pane (commented out for simplicity) -->
                    <n-tab-pane name="signup" tab="Sign_up">
                        <n-form ref="signupForm" :model="signupData" :rules="signupRules">
                            <n-grid :cols="8" :x-gap="24">
                                <n-form-item-gi :span="8" label="User name" path="username">
                                    <n-tooltip trigger="hover">
                                        <template #trigger>
                                            <n-input v-model:value="signupData.username" placeholder="學號" />
                                        </template>
                                        請輸入十位數字
                                    </n-tooltip>
                                </n-form-item-gi>
                                <n-form-item-gi :span="8" label="Password" path="password">
                                    <n-tooltip trigger="hover">
                                        <template #trigger>
                                            <n-input 
                                                @input="handlePasswordInput" 
                                                v-model:value="signupData.password" 
                                                :type="passwordVisible ? 'text' : 'password'" 
                                                placeholder="密碼" 
                                            >
                                                <template #suffix>
                                                    <n-icon @click="togglePasswordVisibility">
                                                        <template v-if="passwordVisible">
                                                            <eye-outline />
                                                        </template>
                                                        <template v-else>
                                                            <eye-off-outline />
                                                        </template>
                                                    </n-icon>
                                                </template>
                                            </n-input>
                                        </template>
                                        請輸入至少六位字元
                                    </n-tooltip>
                                </n-form-item-gi>
                                <!-- Remove label from Repeat Password -->
                                <n-form-item-gi first ref="rPasswordFormItemRef" :span="8" path="Rpassword" label="Repeat Password">
                                    <n-input 
                                        @keyup.enter="handleSignUp" 
                                        :disabled="!signupData.password" 
                                        v-model:value="signupData.Rpassword" 
                                        :type="repeatPasswordVisible ? 'text' : 'password'" 
                                        placeholder="再次輸入密碼" 
                                    >
                                        <template #suffix>
                                            <n-icon @click="toggleRepeatPasswordVisibility">
                                                <!-- <template v-if="repeatPasswordVisible">
                                                    <eye-outline />
                                                </template>
                                                <template v-else>
                                                    <eye-off-outline />
                                                </template> -->
                                            </n-icon>
                                        </template>
                                    </n-input>
                                </n-form-item-gi>
                            </n-grid>
                        </n-form>
                        <n-button @click="handleSignUp" type="primary" block strong> Sign up </n-button>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-space>
    </div>
</template>

<script setup>
// Import necessary functions and components from Vue
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { loginAPI, CheckNameAPI, signupAPI, GetAllRegistryAPI } from '@/config/ApiRoutes';
import { EyeOutline as eyeOutline, EyeOffOutline as eyeOffOutline } from '@vicons/ionicons5';
import { useTerminal } from '@/utils/terminal';
const message = useMessage();
const theme = defineModel();
// Define emitted events
const emit = defineEmits(['themeChange', 'PermissionsUpdate']);
const activeTab = ref('signin');
const handleTabChange = (newValue) => {
    activeTab.value = newValue;
};
// Define reactive variables for user credentials

//sign up define
const signupForm = ref(null);
const signupData = ref({
    username: null,
    password: null,
    Rpassword: null,
    email: null,
});
const loginForm = ref(null);
const loginData = ref({
    username: null,
    password: null,
});
// Get router instance
const router = useRouter();

// Define a ref to manage password visibility
const passwordVisible = ref(false);
const repeatPasswordVisible = ref(false);

// Function to toggle password visibility
const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
    repeatPasswordVisible.value = passwordVisible.value;
};
// Setup the form rules of login and signup tabs.
const loginRules = {
    username: [
        {
            required: true,
            trigger: ['blur'],
            validator(rule, value) {
                if (!value) {
                    return new Error('請輸入帳號'); // If no username is provided
                } else if (!/^\d{10}$/.test(value)) {
                    return new Error('格式不符'); // If username is not a 10-digit number
                }
                return true;
            },
        },
        // Add more validation rules as needed
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: ['blur'] }, // If no password is provided
        { min: 6, message: '格式不符', trigger: 'blur' }, // If password is not a 6-digit number
        // Add more validation rules as needed
    ],
};
const signupRules = {
    username: [
        {
            required: true,
            trigger: ['blur'],
            validator(rule, value) {
                if (!value) {
                    return new Error('請輸入帳號');
                } else if (!/^\d{10}$/.test(value)) {
                    return new Error('格式不符');
                }
                get_allRegistry();
                if (!registryUsername.value.some(user => user.username === value)) {
                    return new Error('修課名單中沒有您的資訊，請聯繫老師');
                }
                return true;
            },
        },
        // Add more validation rules as needed
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' }, // If no password is provided
        { min: 6, message: '格式不符', trigger: 'blur' }, // If password is not a 6-digit number
    ],
    Rpassword: [
        {
            required: true,
            message: 'REPEAT Again!!!', // If Repeat Password is empty
            trigger: ['blur'],
        },
        {
            validator: validatePasswordStartWith, // Check if the password starts correctly
            message: '密碼不一致',
            trigger: 'blur',
        },
        {
            validator: validatePasswordSame, // Check if the passwords match
            message: '密碼不一致',
            trigger: ['blur'],
        },
    ],
    email: [
        { required: true, message: 'Please input your email', trigger: 'blur' },
        { type: 'email', message: 'Please input a valid email', trigger: 'blur' },
    ],
};
// Setup signup password validators
function validatePasswordStartWith(rule, value) {
    return !!signupData.value.password && signupData.value.password.startsWith(value) && signupData.value.password.length >= value.length;
}
function validatePasswordSame(rule, value) {
    return value === signupData.value.password;
}
function handlePasswordInput() {
    if (signupData.value.Rpassword) {
        rPasswordFormItemRef.value?.validate({ trigger: 'blur' });
    }
}

// Function to handle login
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const valid = await new Promise((resolve) => {
            loginForm.value?.validate((errors) => {
                resolve(!errors);
            });
        });

        if (valid) {
            const response = await axios.post(
                loginAPI,
                {
                    username: loginData.value.username,
                    password: loginData.value.password,
                },
                {
                    withCredentials: true,
                },
            );
            if (typeof response.data == 'string') {
                message.error(response.data);
            } else {
                // console.log(response)
                emit('PermissionsUpdate', response.data[2].authInfo);
                // console.log(response.data[2].authInfo)
                // message.info("登入成功，歡迎使用本系統", { duration: 1e3 })
                router.replace({
                    name: 'record',
                });
            }
        } else {
            message.error('請輸入帳號和密碼');
        }
    } catch (error) {
        console.log(error);
        message.error('處理過程發生錯誤:登入失敗');
    }
};

// Function to handle signup (commented out for simplicity)

const check_username = async (username) => {
    let usernamecheck = false;

    try {
        const response = await axios.post(CheckNameAPI, {
            username: signupData.value.username,
        });
        if (response.data !== '沒重複!') {
            message.warning('此學號已被註冊');
            usernamecheck = false;
        } else {
            usernamecheck = true;
        }
    } catch (error) {
        message.error('處理過程發生錯誤:使用者帳號檢查失敗');
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(usernamecheck);
        }, 100);
    });
};

const registryUsername = ref();

function get_allRegistry() {
    axios.get(GetAllRegistryAPI)
        .then(
            response => {
                registryUsername.value = response.data.map(
                    item => {
                        const { registry_id, ...rest } = item;
                        return rest;
                    }
                );
            }
        )
        .catch(
            error => {
                message.error("錯誤!!!!!，註冊表獲取失敗");
            }
        );
}

const handleSignUp = async () => {
    const errorText = '';
    const password = signupData.value.password;
    const password2 = signupData.value.Rpassword;
    const username = signupData.value.username;
    const valid = await new Promise((resolve) => {
        signupForm.value?.validate((errors) => {
            resolve(!errors);
        });
    });
    let checkusername = false;
    if (valid) {
        checkusername = await check_username(username);
    }

    if (checkusername && valid) {
        if (password === password2) {
            try {
                const response = await axios.post(signupAPI, {
                    password: password,
                    username: username,
                });

                message.info('註冊成功，請登入頁面');
                loginData.value.username = username;
                loginData.value.password = password;
                activeTab.value = 'signin'; // Switch to login tab
            } catch (error) {
                message.error('處理過程發生錯誤:註冊失敗');
            }
        }
    }
};
const customCommands = {
    '/mod': () => {
        message.info('working.');
    },
};
const { handleKeydown, commands } = useTerminal(customCommands);
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
// Lifecycle hook when component is mounted
onMounted(() => {
    // Add watcher for prefers-color-scheme
    const ChangeFlag = window.matchMedia('(prefers-color-scheme: dark)');
    //send ChangeFlag to APP.vue to decided weather change theme or not (initial darkTheme) this theme-change only work for Login.vue
    theme.value = !ChangeFlag.matches;
});
</script>

<style scoped>
/* 基本樣式保持不變 */
.main {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(39, 94, 107); /* Adjust background color as needed */
    /*background-image: url('../../assets/login_bk.webp');
  background-size: cover; 
  background-position: center; */
}

.content {
    text-align: center;
}

.card_content {
    max-width: 90vw; /* 限制最大寬度，避免在較大屏幕上過寬 */
    /*background-color: rgba(24,56,71,0.4);  */
    backdrop-filter: blur(10px);
}

/* Applicable to devices with width less than 1380px */
@media (max-width: 1380px) {
    .card_content {
        width: 60vw; /* More compact display on small screens */
    }
}

/* Styles for mobile phones and small screen devices */
@media (max-width: 768px) {
    .card_content {
        width: 95vw; /* More compact display on small screens */
    }
    .card_head,
    .card_body,
    .card_footer {
        font-size: 0.8rem;
    }
}

/* For high-resolution screens, such as Retina displays */
@media screen and (min-resolution: 2dppx) {
    .card_content {
        padding: 1rem; /* Increase padding to improve space for touch operations */
    }
}
</style>
