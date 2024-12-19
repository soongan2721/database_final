<template>
    <!-- Container with space and alignment settings -->
    <n-space item-style="display: flex; align-items: center;">
        <!-- Display the countdown timer within a statistic component -->
        <n-statistic tabular-nums>
            <n-countdown :render="renderCountdown" :duration="time" :active="active" @finish="handleCountdownFinish" />
        </n-statistic>
    </n-space>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue';
import { useRoute } from 'vue-router';

// Use the Vue Router to get route parameters
const route = useRoute();
const { id, class: className, sessionRange } = route.params;

// Inject 'timeData' from the parent component or context
const timeData = inject('timeData');

// Define props, specifically the 'active' boolean prop
const props = defineProps({
    active: Boolean,
});

// Create a unique index for the current class and session
const newTimeIndex = className + sessionRange;

// Find the corresponding time data entry and its index
const found = timeData.value.find((item) => item.index === newTimeIndex);
const index = timeData.value.findIndex((item) => item.index === newTimeIndex);

// Set the initial countdown duration
let time = found.time;

// Define emits for communication with parent component
const emit = defineEmits(['countdown-finished']);

// Handler for when the countdown finishes
const handleCountdownFinish = () => {
    emit('countdown-finished');
};

// Function to render the countdown display
const renderCountdown = ({ minutes, seconds }) => {
    // Update the time data with the remaining time in milliseconds
    timeData.value[index].time = 1000 * (minutes * 60 + seconds);
    // Return the formatted countdown time string
    return `Remain Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
</script>
