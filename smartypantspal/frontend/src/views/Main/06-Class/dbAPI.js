import axios from 'axios';
import db_APIs from'@/config/db_ApiRoutes';
import { useMessage } from "naive-ui";

const message = useMessage();

// export const option_regenerate = async (question, option) => {

//     try {
        
//         const response = await axios.post(
//             optionRegenerateAPI,
//             {
//                 params: {
//                     question: question,
//                     option: option
//                 },
//                 withCredentials: true
//             }
//         );

//         console.log(response.data);

//         return {
//             revised_option: response.data.revised_option,
//             revised_answer: response.data.revised_answer
//         };

//     }
//     catch (error) {
//         console.log('錯誤！重新生成失敗');
//         return [];
//     }
// }

export const db_get_AllQuestion = async() => {
    try {

        const response = await axios.get(db_APIs.db_getAllQuestionAPI)

        // console.log('裡面: ', response.data);
        

        return response.data;
        
    }
    catch(error) {
        message.error('題目獲取錯誤');
        console.log('錯誤訊息: ', error);
        return {};
    }
}
