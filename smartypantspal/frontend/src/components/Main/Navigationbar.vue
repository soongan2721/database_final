<template>
    <!-- Menu component with Naive UI NMenu -->
    <div>
        <div v-if="isMenuVisible" :style="{ fontSize: fontSize + 'px' }">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" responsive />
        </div>
        <div v-else-if="!isMenuVisible" :style="{ fontSize: fontSize + 'px' }">
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
            <n-dropdown trigger="click" :options="menuOptions" :show-arrow="false" placement="bottom-start">
                <n-popover trigger="hover" placement="left-start" :disabled="!isMenuDisable">
                    <template #trigger>
                        <n-button :disabled="isMenuDisable">
                            <template #icon>
                                <n-icon>
                                    <menus />
                                </n-icon>
                            </template>
                            Menu
                        </n-button>
                    </template>
                    <span v-if="isMenuDisable">載入中</span>
                </n-popover>
            </n-dropdown>
        </div>
    </div>
</template>

<script setup>
// Import necessary functions and components from Vue
import { h, onMounted, onUnmounted, ref, watch, onBeforeMount, inject } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NMenu, NIcon, useMessage } from 'naive-ui';
import {
    HomeOutline as HomeIcon,
    Build as BuildIcon,
    PersonCircleOutline as personIcon,
    LogOutOutline as LogOutIcon,
    PeopleOutline as PeopleIcon,
    PodiumOutline as Podium,
    TrendingUpSharp as TrendingUp,
    TerminalOutline as Terminal,
    LibraryOutline as Library,
    BookOutline as Book,
    Menu as menus,
    ColorPaletteOutline as ThemeIcon,
    ColorWandOutline as FontIcon,
    LockOpenOutline as PasswordIcon,
} from '@vicons/ionicons5';
import axios from 'axios';
import { logoutAPI, ChangePasswordAPI, CheckPasswordAPI } from '@/config/ApiRoutes';
// Set up router
const route = useRouter();
const message = useMessage();
const windowWidth = inject('windowWidth');
const isMenuVisible = inject('isMenuVisible');
const theme = inject('theme');
// Define reactive variables and props
const activeKey = ref('');
const props = defineProps(['NewPermissions']);
// Define function to render icons
const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) });
const isMenuDisable = inject('isMenuDisable');
const isPasswordModalVisible = ref(false);
const fontSize = inject('fontSize')
const newPassword = ref('');
const confirmPassword = ref('');


// Define menu options with links and icons
const menuOptions = ref([
  {
    label: () => h(
      RouterLink,
      { to: { name: "Home" } },
      { default: () => '首頁' }
    ),
    key: 'Home',
    show: props.NewPermissions.isboss,
    icon: renderIcon(HomeIcon)
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: "history" } },
      { default: () => '測驗系統' }
    ),
    key: 'test',
    show: false, 
    icon: renderIcon(Book)
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: "record" } },
      { default: () => '練習系統' }
    ),
    key: 'practice',
    show: true, 
    icon: renderIcon(Library)
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: "analize" } },
      { default: () => 'Data Analysis' }
    ),
    key: 'analize',
    show: false, 
    icon: renderIcon(TrendingUp)
  },
  {
    label: () => h(
      RouterLink,
      
      { to: { name: "manage" } },
      { default: () => '後臺系統' }
    ),
    key: 'manage',
    show: props.NewPermissions.isboss, 
    icon: renderIcon(Terminal)
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: "class" } },
      { default: () => '教師系統' }
    ),
    key: 'class',
    show: props.NewPermissions.isboss,
    icon: renderIcon(Podium)
  },
  {
    label:String(props.NewPermissions.name.value),
    key: 'std',
    icon: renderIcon(PeopleIcon),
    // show: false, 
    children: [
      {
        label: () => h(
          RouterLink,
          { to: { name: "UserDashbroad" } },
          { default: () => "User Dashboard" }
        ),
        key: "UserDashbroad",
        show: false, 
        icon: renderIcon(personIcon),
      },
      {
        label: () => h(
          RouterLink,
          { to: { name: "setting" } },
          { default: () => "Settings" }
        ),
        key: "setting",
        show: false, 
        icon: renderIcon(BuildIcon),
      },
      {
        label: () => h(
          'div',
          {
            onClick: changeTheme,
          },
          { default: () => "變更主題" }
        ),
        key: "changeTheme",
        icon: renderIcon(ThemeIcon),
      },
      {
        label: () => h(
          'div',
          {
            onClick: changePassword,
          },
          { default: () => "變更密碼" }
        ),
        key: "changePassword",
        icon: renderIcon(PasswordIcon),
      },
      {
        label: '字體縮放',
        key: 'font',
        icon: renderIcon(FontIcon),
        children: [
        {
          label: () => h(
            'div',
            {
              onClick: large,
            },
            { default: () => "放大" }
          ),
        },
        {
          label: () => h(
            'div',
            {
              onClick: small,
            },
            { default: () => "縮小" }
          ),
        },
        ]
    },
    {
        label: () => h(
          'div',
          {
            onClick: logout,
          },
          { default: () => "登出" }
        ),
        key: "logout",
        icon: renderIcon(LogOutIcon),
      },
    ]
  }
]);
watchEffect(() => {
    if (!isMenuVisible.value) {
        menuOptions.value[6].show = true;
    } else {
        menuOptions.value[6].show = false;
    }
});
// Define logout function
const logout = async () => {
    try {
        // Wait for Axios POST request to complete
        const response = await axios.post(logoutAPI, {}, { withCredentials: true });
        // Logic after API call completion and success
        const logstatus = false;
        route.push({ name: 'Login' }); //direct to Login page
    } catch (error) {
        // Handle error if request fails
        message.error('處理過程發生錯誤:登出失敗');
    }
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

const changeTheme = async () => {
    theme.value = !theme.value
};
const large = async () => {
  if(fontSize.value < 19){
    fontSize.value += 4;
  }
}
const small = async () => {
  if(fontSize.value >11 ){
    fontSize.value -= 4;
  }
}

onBeforeMount(() => {
    // Get the current route name and assign it to activeKey
    activeKey.value = route.currentRoute.value.name;
});

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

    const routeKeyMappings = [
        { regex: /^\/main\/home/, key: 'Home' },
        { regex: /^\/main\/test\/*/, key: 'test' },
        { regex: /^\/main\/practice\/*/, key: 'practice' },
        { regex: /^\/main\/analize/, key: 'analize' },
        { regex: /^\/main\/manage/, key: 'manage' },
        { regex: /^\/main\/class/, key: 'class' },
        { regex: /^\/main\/userdashbroad/, key: 'UserDashbroad' },
        { regex: /^\/main\/setting/, key: 'setting' },
        { regex: /^\/main\/logout/, key: 'logout' },
        { regex: /^\/main\/theme/, key: 'theme' },
    ];

    watchEffect(() => {
        const fullPath = route.currentRoute.value.fullPath;

        // Use regular expression to match fullPath
        const matchedMapping = routeKeyMappings.find((mapping) => mapping.regex.test(fullPath));
        if (matchedMapping && matchedMapping.key !== activeKey.value) {
            activeKey.value = matchedMapping.key;
        }
    });

    // watchEffect(() => {
    //   const newRouteName = route.currentRoute.value.name;

    //   if (newRouteName !== activeKey.value) {
    //     if(newRouteName == 'question' || newRouteName == 'Detail'){
    //       activeKey.value = 'history'
    //     }
    //     else if(newRouteName == 'record' || newRouteName == 'quiz'){
    //       activeKey.value = 'record'
    //     }
    //     else{
    //       activeKey.value = route.currentRoute.value.name;
    //     }
    //   }
    // });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });
});

watch(fontSize, (newSize) => {
    document.documentElement.style.setProperty('--global-font-size', `${newSize}px`);
});
// Set up event listeners and DOM manipulations on component mount
onMounted(() => {
    document.documentElement.style.setProperty('--global-font-size', `${fontSize.value}px`);
});

</script>

<style scoped>
:root {
    --global-font-size: 16px;
}
:deep().n-menu, .n-button, .n-popover, .n-icon {
    font-size: var(--global-font-size);
}
</style>
