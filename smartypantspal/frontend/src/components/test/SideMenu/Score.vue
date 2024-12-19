<template>
    <!-- Display the total score -->
    <h1>Score: {{ totalScore }}</h1>
</template>

<script setup>
import { ref, onMounted, inject, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

// Inject the 'totalScore' value from parent component or context
let totalScore = inject('totalScore');

// Initialize the Vue Router instance (currently not used)
const router = useRouter();

// Define a model for 'totalScoreForChoiceQuestions'
let score = defineModel('totalScoreForChoiceQuestions');

// Watch effect to observe changes to the score value
watchEffect(() => {
    if (score.value !== 0) {
        // Optional: log the score value if needed
        // console.log(score.value);
    }
});

// Lifecycle hook executed when the component is mounted
onMounted(() => {
    // Initialize score value on component mount
    score.value = score.value; // Ensure the model is correctly set
});
</script>

<style>
/* Add styles here if needed */
</style>
