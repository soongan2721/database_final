import axios from 'axios';
import db_APIs from'@/config/db_ApiRoutes';
import { useMessage } from "naive-ui";

export const db_get_AllQuestion = async() => {
    try {

        const response = await axios.get(db_APIs.db_getAllQuestionAPI)

        // console.log('裡面: ', response.data);
        

        return response.data;
        
    }
    catch(error) {
        console.log('獲取題目錯誤: ', error);
        return {};
    }
}

export const db_add_question = async(inputValues) => {
    try {

        const response = await axios.post(
            db_APIs.db_addQuestionAPI,
            {
                params: {
                    question_type: inputValues.question_type,
                    content: inputValues.content,
                    option1: inputValues.option1,
                    option2: inputValues.option2,
                    option3:inputValues.option3,
                    option4: inputValues.option4,
                    answer: inputValues.answer,
                    explain: inputValues.explain,
                    course: inputValues.course,
                    examYear: inputValues.examYear
                },
                withCredentials: true
            }
        )

    }
    catch(error) {
        console.log('題目新增錯誤: ', error);
        return(error)
    }
}

export const db_modify_question = async(inputValues) => {
    try {

        const response = await axios.post(
            db_APIs.db_modifyQuestionAPI,
            {
                params: {
                    question_id: inputValues.question_id,
                    question_type: inputValues.question_type,
                    content: inputValues.content,
                    option1: inputValues.option1,
                    option2: inputValues.option2,
                    option3: inputValues.option3,
                    option4: inputValues.option4,
                    answer: inputValues.answer,
                    explain: inputValues.explain,
                    course: inputValues.course,
                    examYear: inputValues.examYear
                },
                withCredentials: true
            }
        )

    }
    catch(error) {
        console.log('題目修改錯誤: ', error);
        return(error)
    }
}


