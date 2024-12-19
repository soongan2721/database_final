<template>
    <!-- Space component to align items in the center -->
    <n-space item-style="display: flex; align-items: center;">
        <!-- Statistic component to show countdown -->
        <n-statistic tabular-nums>
            <n-countdown :render="renderCountdown" :duration="time" :active="active" @finish="handleCountdownFinish" />
        </n-statistic>
    </n-space>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue';
import { useRoute } from 'vue-router';

// Access route parameters
const route = useRoute();
const { id, class: className, sessionRange } = route.params;

// Inject 'timeData' from parent component or context
const timeData = inject('timeData');

// Define props with a boolean 'active' for controlling the countdown
const props = defineProps({
    active: Boolean,
});

// Create a unique index for the current time entry based on class and session
const newTimeIndex = className + sessionRange;
const found = timeData.value.find((item) => item.index === newTimeIndex);
const index = timeData.value.findIndex((item) => item.index === newTimeIndex);

// Set initial countdown duration from the found time entry
let time = found.time;

// Define emits to communicate with parent component
const emit = defineEmits(['countdown-finished']);

// Function to handle countdown completion
const handleCountdownFinish = () => {
    emit('countdown-finished');
};

// Function to render countdown in the desired format
const renderCountdown = ({ minutes, seconds }) => {
    // Update time data with the remaining milliseconds
    timeData.value[index].time = 1000 * (minutes * 60 + seconds);
    // Format the countdown display
    return `Remain Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
</script>
