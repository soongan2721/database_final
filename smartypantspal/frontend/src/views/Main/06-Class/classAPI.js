import axios from 'axios';
import { optionRegenerateAPI } from'@/config/ApiRoutes';
import { useMessage } from "naive-ui";

const message = useMessage();


export const option_regenerate = async (question, option) => {

    try {
        
        const response = await axios.post(
            optionRegenerateAPI,
            {
                params: {
                    question: question,
                    option: option
                },
                withCredentials: true
            }
        );

        console.log(response.data);

        return {
            revised_option: response.data.revised_option,
            revised_answer: response.data.revised_answer
        };

    }
    catch (error) {
        console.log('錯誤！重新生成失敗');
        return [];
    }
}
