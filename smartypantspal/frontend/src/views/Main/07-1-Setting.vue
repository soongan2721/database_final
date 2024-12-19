<template>
    <div class="Main">
        <!-- Center the content with padding -->
        <n-flex justify="center" style="padding: 2%">
            <n-layout has-sider>
                <n-layout>
                    <n-card embedded style="height: 80dvh; width: 35dvw; padding: 20px">
                        <!-- ThemeSwitch component for changing themes -->
                        <ThemeSwitch v-model="theme" />
                    </n-card>
                </n-layout>
            </n-layout>
        </n-flex>
    </div>
</template>

<script setup>
import ThemeSwitch from '@/components/Main/ThemeSwitch.vue';
// Define a reactive reference for theme, but the method should be ref or reactive
const theme = defineModel(); // This should be ref('light') or ref('dark'), depending on the initial theme
</script>

<style scoped>
/* Scoped style for the Main container, can be customized further */
</style>
