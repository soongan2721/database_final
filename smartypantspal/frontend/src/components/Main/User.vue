<!-- User.vue -->
<template>
    <!-- Menu component with Naive UI NMenu -->
    <div class="dropdown-container" v-if="isMenuVisible" :style="{ fontSize: fontSize + 'px' }">
        <n-dropdown trigger="click" :options="menuOptions" @select="handleSelect">
            <n-button v-model:value="activeKey" text size="large" :render-icon="renderIcon(PeopleIcon)">{{ props.NewPermissions.name.value }}</n-button>
        </n-dropdown>
        <!-- Modal for changing password -->
        <n-modal v-model:show="isPasswordModalVisible" title="變更密碼" preset="card" style="width: 600px; height: 300px">
            <template #default>
                <div>
                    <!-- <h3>請輸入您的新密碼：</h3> -->
                    <n-form ref="formRef" :model="model" :rules="rules">
                        <n-form-item path="new" label="請輸入您的新密碼：">
                            <n-input v-model:value="newPassword" type="password" placeholder="新密碼" @keyup.enter="handleInput" style="left: 150px; width: 200px; height: 40px;"/>
                        </n-form-item>
                        <n-form-item path="repeat" label="再次確認密碼：">
                            <n-input v-model:value="confirmPassword" type="password" placeholder="確認新密碼" @keyup.enter="handleInput" style="left: 150px; top: 0px; width: 200px; height: 40px;"/>
                        </n-form-item>
                        <n-button @click="confirm">確認</n-button>
                    </n-form>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>
// Import necessary functions and components from Vue
import { h, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NIcon, useMessage} from 'naive-ui';
import { Build as BuildIcon, PersonCircleOutline as personIcon, LogOutOutline as LogOutIcon, PeopleOutline as PeopleIcon, ColorPaletteOutline as ThemeIcon, LockOpenOutline as PasswordIcon, Enter } from '@vicons/ionicons5';
import axios from 'axios';
import { logoutAPI, ChangePasswordAPI, CheckPasswordAPI } from '@/config/ApiRoutes';
// Set up router
const route = useRouter();
const message = useMessage();
const windowWidth = ref(window.innerWidth);
const isMenuVisible = ref(window.innerWidth >= 1380);
const showSubMenu = ref(!isMenuVisible.value);
// Define reactive variables and props
const activeKey = ref('');
const isMobile = ref(window.innerWidth < 768);
const theme = inject('theme');
const isPasswordModalVisible = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');

const props = defineProps(['NewPermissions']);
// Define function to render icons
const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) });
// Define menu options with links and icons
const menuOptions = ref([
    {
        label: () => h(RouterLink, { to: { name: 'UserDashbroad' } }, { default: () => 'User Dashboard' }),
        key: 'UserDashbroad',
        show: false,
        icon: renderIcon(personIcon),
    },
    {
        label: () => h(RouterLink, { to: { name: 'setting' } }, { default: () => 'Settings' }),
        key: 'setting',
        show: false,
        icon: renderIcon(BuildIcon),
    },
    {
        label: '變更主題',
        key: 'changeTheme',
        icon: renderIcon(ThemeIcon),
    },
    {
        label: '變更密碼',
        key: 'changePassword',
        icon: renderIcon(PasswordIcon),
    },
    {
        label: '登出',
        key: 'logout',
        icon: renderIcon(LogOutIcon),
    },
]);

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

const logout = async () => {
    try {
        // Wait for Axios POST request to complete
        const response = await axios.post(logoutAPI, {}, { withCredentials: true });
        // Logic after API call completion and success
        route.push({ name: 'Login' }); //direct to Login page
    } catch (error) {
        message.error('處理過程發生錯誤:登出失敗');
    }
};

const changeTheme = async () => {
    theme.value = !theme.value
};
const changePassword = () => {
    isPasswordModalVisible.value = true; //show modal
};
const isFormValid = computed(() => {
    return newPassword.value.length >= 6;
});
const closePasswordModal = () => {
    isPasswordModalVisible.value = false;
    newPassword.value = '';
    confirmPassword.value = '';
};

const confirm = async () => {
    if (!isFormValid.value) {
        message.error('密碼長度至少為6個字元');
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        message.error('兩次輸入的密碼不一致');
        console.log("錯誤")
        return;
    }
    try {
        const checkPasswordResponse = await axios.post(CheckPasswordAPI, {params:{newPassword:newPassword.value}, withCredentials: true});
        
        if (checkPasswordResponse.data.isSamePassword) {
            message.warning('新密碼不能與舊密碼相同');
            return;
        }
        const response = await axios.post(ChangePasswordAPI, {params:{newPassword:newPassword.value}, withCredentials: true});
        if(response.data.result){
            message.success('密碼更改成功');
        }
        closePasswordModal();
    } 
    catch (error) {
        message.error('密碼更改失敗，請稍後再試');
    }
};
const handleInput = () => {
    confirm()
}
watch(isPasswordModalVisible, (newValue) => {
  if (!newValue) {
    newPassword.value = '';
    confirmPassword.value = '';
  }
});

const handleSelect = (key) => {
    if (key == 'logout') {
        logout();
    } else {
        activeKey.value = key;
    }
    if (key == 'changeTheme') {
        changeTheme();
    }
    if (key == 'changePassword') {
        changePassword();
    }
};

watchEffect(() => {
    const newRouteName = route.currentRoute.value.name;
    if (newRouteName !== activeKey.value) {
        activeKey.value = null;
    }
});

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
.dropdown-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
:root {
    --background-color: rgba(255, 255, 255, 1);
    --global-font-size: 16px;
}

body {
    background-color: var(--background-color);
}
.n-button, :deep().n-dropdown {
    font-size: var(--global-font-size);
}
</style>
