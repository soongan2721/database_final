<template>
    <div class="app" >
        <!-- Configuration provider for theming and other global settings -->
        <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
            <!-- Loading bar at the top of the page -->
            <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
                <!-- Global message notification container -->
                <n-message-provider :placement="placement">
                    <!-- Dialog provider for modal windows -->
                    <n-dialog-provider>
                        <!-- Main view container, using RouterView allows for modular interface management, facilitating the reuse of components and simplifying navigation complexity.-->
                        <RouterView style="height: 100vh" v-model="newtheme" @PermissionsUpdate="UpdatePermissions" :NewPermissions="PermissionsRef"></RouterView>
                    </n-dialog-provider>
                </n-message-provider>
            </n-loading-bar-provider>
        </n-config-provider>
    </div>
</template>

<script setup>
import { provide, ref, onMounted, watchEffect } from 'vue';
import { darkTheme } from 'naive-ui';
import darkthemeOverrides from './styles/themes/naive-ui-dark-theme-overrides.json';
import lightthemeOverrides from './styles/themes/naive-ui-light-theme-overrides.json'; // Currently not using customized light, the one using is default by Naive UI
import axios from 'axios';
import { getPermissionAPI } from './config/ApiRoutes';

// Reactive references for theming and permissions
const newtheme = ref(); // Holds the new theme value
const theme = ref(darkTheme); // Default theme set to dark
const PermissionsRef = { isboss: ref(false), name: ref() }; // Holds user permissions and name
provide('PermissionsRef', PermissionsRef)
const placement = ref('top'); // Position of global message notifications
const timeobj = ref([
    {
        index: null,
        time: 60 * 1000,
        class: null,
        session: null,
    },
]); // Object holding time data
const ModStatus = ref('normal'); // Status of some modification
const loadingBarTargetRef = ref(void 0); // Reference for the loading bar
const fontSize = ref(15);
const practice_id = ref(0);
const start_time = ref(0);
const lock_commit_answer = ref(false);
const correctQuestion = ref(0);

provide('fontSize', fontSize);
// Provide these references globally
provide('theme', newtheme);
provide('timeData', timeobj);
provide('placement', placement);
provide('loadingBarTargetRef', loadingBarTargetRef);
provide('ModStatus', ModStatus);
provide('practice_id', practice_id);
provide('start_time', start_time);
provide('lock_commit_answer', lock_commit_answer);
provide('correctQuestion', correctQuestion);
//Use themeOverrides to perform customized theme
let themeOverrides = darkthemeOverrides;

// Function to update permissions based on new values, all user informatin is saved to local here.
const UpdatePermissions = (value) => {
    axios.get(getPermissionAPI, {
        params: {
            username: value.name
        }
    }).then((result) => {
        // console.log(result.data);
        let permission = result.data;
        localStorage.setItem('permissions', permission);
        localStorage.setItem('UseraName', value.name);
        PermissionsRef.isboss.value = permission;
        PermissionsRef.name.value = value.name;
    }).catch((error) => {
        console.log(error);
    });
};

// Function to switch the theme dynamically, since we have provide them gobly, we can access in ANY other components
const switchTheme = (value) => {
    if (value) {
        theme.value = null;
        themeOverrides = null;
        localStorage.setItem('theme', value);
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        theme.value = darkTheme;
        localStorage.setItem('theme', value);
        themeOverrides = darkthemeOverrides;
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
};

function handleBeforeUnload(event) {
    console.log('handleBeforeUnload triggered')
    // write code here
 
    event.preventDefault();
    event.returnValue = '';

}

// Lifecycle hook for actions on component mount
onMounted(() => {
    // window.addEventListener('beforeunload', handleBeforeUnload);//listening refresh and page leave
    
    // Retrieve saved permissions and theme from local storage
    const savedPermissions = localStorage.getItem('permissions');
    const savedName = localStorage.getItem('UseraName');
    if (savedPermissions !== null && savedName !== null) {
        PermissionsRef.isboss.value = JSON.parse(savedPermissions);
        PermissionsRef.name.value = JSON.parse(savedName);
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== undefined && savedTheme !== null) {
        newtheme.value = JSON.parse(savedTheme);
    }
    const savedTime = localStorage.getItem('savedTime');
    if (savedTime !== undefined && savedTime !== null) {
        timeobj.value = JSON.parse(savedTime);
    }
    watchEffect(() => {
        // Watch for theme changes updates
        if (newtheme.value != undefined) {
            switchTheme(newtheme.value);
        }
        //Watch for time changes update and save to local.
        if (timeobj.value != undefined && timeobj.value !== null) {
            localStorage.setItem('savedTime', JSON.stringify(timeobj.value));
        }
    });
});



</script>

<style>
.app {
    height: 100vh;
    flex-direction: column;
    display: flex;
}
</style>
