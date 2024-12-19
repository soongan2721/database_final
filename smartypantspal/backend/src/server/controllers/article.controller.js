var articleModule = require('../modules/article.module');
// const { exec } = require('child_process'); // product version
const { spawn } = require('child_process'); // dev version


//在給定的範圍內隨機挑選
function getRandom(question_id, freq){
  let randomQuestionArray = [];    //儲存被挑選到的question_id      
  let maxLength = 5;          //預設值

  //把太常出現的題目刪掉
  question_id = question_id.filter((question) => {
    return !freq.includes(question.question_id);
  });
  let selectLength = question_id.length;

  console.log('13' + question_id);
  //確保題目數量不會超過最大值
  if(selectLength > maxLength){
    selectLength = maxLength;
  }

  //隨機出題
  for(let i = 0; i < selectLength; i++){
    let randomNumber = Math.floor(Math.random() * (question_id.length));
    //確認不會有重複的值
    while(randomQuestionArray.includes(question_id[randomNumber].question_id)){
      randomNumber = Math.floor(Math.random() * (question_id.length));
    }
    randomQuestionArray.push(question_id[randomNumber].question_id);
  }
  return randomQuestionArray;
}

/* GET 取得題目 */
const articlGetQuestion = async (req, res) => {
  const username = req.session.username;
  const SearchValues = req.query;
  console.log(SearchValues);

  //抓出太常出現的題目id以及題目列表
  Promise.all([
    articleModule.GetQuestinFrequency(username),
    articleModule.GetQuestion(SearchValues)
  ]).then(([questionFrequency, questionList]) => {
    if(questionList){
      console.log('44: enter', questionList);
      //經過隨機挑選出來的題號
      let id_array = getRandom(questionList, questionFrequency);

      if(id_array && id_array.length > 0){
        //根據題目去抓選項
        articleModule.GetQuestionDetail(id_array).then((result) => {
          res.send(result);
        }).catch((error) => {
          console.log(error);
          res.send(error);
        });
      }
      else{
        res.send([]);
      }
    }
  }).catch((error) => {
    console.log(error);
    res.send(error);
  })
  
};


/* GET 取得 */
const articleGetStudentTable = (req, res) => {
  const SearchValues = req.query;
  // console.log(SearchValues,'@@@')
  articleModule.GetStudentTable(SearchValues).then((result) => {
    res.send(result); // 成功回傳result結果
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};
/* GET 取得 */
const articleCatchStudentTable = (req, res) => {
  const SearchValues = req.query;
  // console.log(SearchValues,'@@@')
  articleModule.CatchStudentTable(SearchValues)
  .then(
    (result) => {
      res.send(result); // 成功回傳result結果
    }
  )
  .catch(
    (err) => {
      return res.send(err);
    }
  ); // 失敗回傳錯誤訊息
};
/*改變狀態 POST */
const articleupload_student_table = (req, res) => {
  // 取得修改參數
  const insertValues = req.body;
  articleModule.upload_student_table(insertValues).then((result) => {
    res.send(result); // 回傳修改成功訊息
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

const articlGetAnswer = (req, res) => {
  const SearchValues = req.query;
  console.log(SearchValues, '@@@')
  articleModule.GetAnswer(SearchValues).then((result) => {
    res.send(result); // 成功回傳result結果
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

/*改變狀態 POST */
const gpt_response_table = (req, res) => {
  // 取得修改參數
  const insertValues = req.body.params;

  // product version
  // const pythonProcess = exec(`/usr/src/app/venv/bin/python gpt.py '${JSON.stringify(insertValues)}' `, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`Python output: ${stdout}`);
  // }); 

  // dev version
  const pythonProcess = spawn('python', ['gpt.py', JSON.stringify(insertValues)]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    res.send(JSON.parse(data));
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`subprocess exited with exit code ${code}`);
    if (code !== 0) {
      res.send(new Error(`Python 脚本执行失败，退出码 ${code}`));
    } 
  });
};


const articlGetGptJudge = (req, res) => {
  const SearchValues = req.query;
  // console.log(SearchValues,'@@@')
  articleModule.GetGptJudge(SearchValues).then((result) => {
    res.send(result); // 成功回傳result結果
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

const articlUploadPracticeTable = (req, res) => {
  const insertValues = req.body;
  articleModule.upload_practice_table(insertValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetPermission = (req, res) => {
  const SearchValues = req.query;
  articleModule.GetPermission(SearchValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetWeek = (req, res) => {
  const SearchValues = req.query;
  articleModule.GetWeek(SearchValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetClass = (req, res) => {
  articleModule.GetClass().then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleUpdatePracticeRecord = (req, res) => {
  const insertValues = req.body;
  articleModule.UpdatePracticeRecord(insertValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetPractiecRecord = (req, res) => {
  const SearchValues = req.query;
  articleModule.GetPracticeRecord(SearchValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetQuestionInformation = (req, res) => {
  let SearchValues = req.query;
  articleModule.GetQuestionInformation(SearchValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleUploadPracticeRecord = (req, res) => {
  //let insertValues = req.body;
  articleModule.UploadPracticeRecord(req).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleGetPracticeQeuestionId = (req, res) => {
  let SearchValues = req.query;
  articleModule.GetPracticeQuestionId(SearchValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}

const articleUploadPracticeQuestion = (req, res) => {
  let insertValues = req.body;
  articleModule.UplocadPracticeQuestion(insertValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}


// 辰翰 8/4 獲取question_lib所有資料
const articlGetAllQuestion = (req, res) => {

  let isVerified = req.query.isVerified;
  isVerified = isVerified=='true' ? 1 : 0;
  
  articleModule.GetAllQuestion(isVerified)
    .then(
      (result) => {
        res.send(result);
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
}

// 辰翰 8/11 獲取concept_lib所有資料
const articlGetAllConcept = (req, res) => {
  articleModule.GetAllConcept()
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
}

// 辰翰 8/13 新增概念
const articlAddConcept = (req, res) => {

  const concept_name = req.query.concept_name;

  articleModule.addConcept(concept_name)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )

}

// 辰翰 8/13 刪除概念(連帶外鍵關聯資料一起刪除)
const articlRemoveConcept = (req, res) => {

  const inputValues = req.query;

  let questionLib_question_ids
  let questionConcept_question_ids

  let remainingQueries = 3;

  const check_queryFinished = () => {

    remainingQueries--;

    if(remainingQueries == 0) {

      // 過濾出沒有概念的題目們
      const questionWithoutConcept = questionLib_question_ids.filter(
        quesLib_item => !questionConcept_question_ids.some(
          quesConcept_item => quesConcept_item.question_id == quesLib_item.question_id
        )
      );

      console.log(questionWithoutConcept);
      

      // 為沒有概念的題目加上default概念
      articleModule.addDefaultConcept(questionWithoutConcept)
        .then(
          (result) => {
            res.send(result);
          } 
        )
        .catch(
          (err) => {
            res.send(err);
          }
        )
      
    }

  }

  // 根據概念id刪除概念
  articleModule.removeConcept(inputValues)
    .then(
      (result) => {
        check_queryFinished();
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
  // 獲取question_lib中所有question_id
  articleModule.getAllQuestionIdFromQuestionLib()
    .then(
      (result) => {
        questionLib_question_ids = result;
        check_queryFinished();
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )

    // 獲取question_concept所有question_id
    articleModule.getAllQuestionIdFromQuestionConcept()
    .then(
      (result) => {
        questionConcept_question_ids = result;
        check_queryFinished();
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/13 修改概念
const articlModifyConcept = (req, res) => {

  const inputValues = req.query;

  articleModule.modifyConcept(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )

}

// 辰翰 8/16 新增題目
const articlAddQuestion = (req, res) => {

  const inputValues = req.query;

  articleModule.addQuestion(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/17 刪除概念(純刪除概念)
const articlRemoveConceptOnly = (req, res) => {

  const inputValues = req.query;

  articleModule.removeConceptOnly(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/17 刪除題目
const articlRemoveQuestion = (req, res) => {

  const inputValues = req.query;

  articleModule.removeQuestion(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/17 修改題目
const articlModifyQuestion = (req, res) => {

  const inputValues = req.query;

  articleModule.modifyQuestion(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/18 獲取所有課程
const articlGetAllClass = (req, res) => {

  const inputValues = req.query;

  articleModule.getAllClass(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/18 獲取所有週次概念
const articlGetAllWeekConcept = (req, res) => {

  const inputValues = req.query;

  articleModule.getAllWeekConcept(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/18 修改週次概念
const articlModifyWeekConcept = (req, res) => {

  const inputValues = req.query;

  articleModule.modifyWeekConcept(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/21 獲取所有學生
const articlGetAllStudent = (req, res) => {

  const inputValues = req.query;

  articleModule.getAllStudent(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/22 獲取所有課程學生
const articlGetAllClassStudent = (req, res) => {

  const inputValues = req.query;

  articleModule.getAllClassStudent(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/23 修改課程學生
const articlModifyClassStudent = (req, res) => {

  const inputValues = req.query;

  articleModule.modifyClassStudent(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 8/23 透過login_id刪除課程學生
const articlRemoveStudentByIdFromClassStudent = (req, res) => {

  const inputValues = req.query;

  articleModule.removeStudentByIdFromClassStudent(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 9/2 透過CSV檔新增題目
const articlAddQuestionByCsv = (req, res) => {

  const inputValues = req.body;

  articleModule.addQuestionByCsv(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 9/2 根據概念名稱獲取概念ID
const articlGetConceptIdByName = (req, res) => {

  let concept_names = req.body.params.concept_names;
  
  // 對每個概念都取得對應的concept_id，若沒有，則新增
  const promises = concept_names.map (

    concept_name => {
      return articleModule.getConceptIdByName(concept_name)
    }

  )

  Promise.all(promises)
    .then(
      (result) => {
        res.send(result);
      }
    )
    .catch(
      (error) => {
        res.send(error);
      }
  );

}

// 辰翰 9/10 新增使用紀錄
const articlAddRecord = (req, res) => {

  const inputValues = req.query;
  inputValues.username = req.session.username;

  articleModule.addRecord(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 9/10 獲取所有使用紀錄
const articlGetAllRecord = (req, res) => {

  articleModule.GetAllRecord()
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 羽喬 9/13 抓舊密碼
const articlCheckPassword = (req, res) => {

  const password = req.body.params.newPassword;
  const username = req.session.username; 

  // console.log('接收到的用户名: ', username);
  // console.log('接收到的密码: ', password);

  articleModule.CheckPassword(username, password)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
}

// 羽喬 9/12 更改密碼
const articlChangePassword = (req, res) => {
  const newPassword = req.body.params.newPassword;
  const username = req.session.username; 

  articleModule.ChangePassword(username, newPassword)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
}

// 辰翰 9/12 獲取註冊表資料
const articlGetAllRegistry = (req, res) => {

  articleModule.GetAllRegistry()
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 9/12 新增學號到註冊表
const articlAddUserToRegistry = (req, res) => {

  const inputValues = req.body.params;

  articleModule.addUserToRegistry(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 9/12 根據ID刪除註冊表中學號
const articlRemoveUserFromRegistry = (req, res) => {

  const inputValues = req.body.params;

  articleModule.removeUserFromRegistry(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 10/4 輸入一概念集，若其中概念沒有在資料表中則新增
const articlAddConceptIfNotExist = (req, res) => {

  const concept_names = req.body.params.concept_sets;
  let origin_concept_names;

  let remainingQueries = 1;

  const check_queryFinished = () => {

    remainingQueries--;

    if(remainingQueries == 0) {

      // 把SQL的結果整理成array
      origin_concept_names = origin_concept_names.map(item => item.concept_name);
      // 過濾出欲新增的概念
      const conceptsToBeAdd = concept_names.filter(concept => !origin_concept_names.includes(concept));

      const promises = conceptsToBeAdd.map(
        concept_name => {
          return articleModule.addConcept(concept_name)
        }
      )

      Promise.all(promises)
      .then(
        (result) => {
          res.send(result);
        }
      )
      .catch(
        (error) => {
          res.send(error);
        }
      );

    }

  }
  
  // 獲取question_lib中所有question_id
  articleModule.GetAllConcept()
    .then(
      (result) => {
        origin_concept_names = result;
        check_queryFinished();
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 10/25 輸入0或1，更改題目之驗證狀態
const articlModifyQuesVerification = (req, res) => {

  const isVerified = req.body.params.isVerified;
  const question_id = req.body.params.question_id;

  articleModule.modifyQuesVerification(isVerified, question_id)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}
// 嘉盛 11/11 上傳小幫手用戶的query
const articlUploadUserQuery = (req, res) => {
  const insertValues = req.body;
  articleModule.UploadUserQuery(insertValues).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  })
}



// 嘉盛 11/12 把用戶的query傳給gpt並得到回應
const articlGetGptResponse = (req, res) => {
  const user_id = req.body.params.user_id;
  const user_query = req.body.params.user_query;
  const user_query_time = req.body.params.user_query_time; 
  console.log(user_id)
  console.log(user_query)
  console.log(user_query_time)

  articleModule.GetGptResponse(user_id, user_query,user_query_time)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
}

//嘉盛 11/12 module未寫
const articlGetUserResponse = (req, res) => {//module未寫

  const inputValues = req.query;

  articleModule.GetUserResponse(inputValues)
    .then(
      (result) => {
        res.send(result);
      } 
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

// 辰翰 11/18 根據現有題目及選項內容重新生成選項
const articlOptionRegenerate = (req, res) => {

  const question = req.body.params.question
  const option = req.body.params.option
  

  let result_array = {
    revised_option: '測試選項',
    revised_answer: '測試答案'
  }

  // product version
  // const pythonProcess = exec(`/usr/src/app/venv/bin/python ./scripts/gpt_quesRegenerate.py '${JSON.stringify(question)}' '${option}' `, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`Python output: ${stdout}`);
  // }); 

  // dev version
  const pythonProcess = spawn('python', ['./scripts/gpt_quesRegenerate.py', JSON.stringify(question), option])

  let result = '';
  
  pythonProcess.stdout.on(
    'data',
    (data) => {
      result += data.toString(); 
    }
  );
  pythonProcess.stderr.on(
    'data',
    (data) => {
      console.error(`Python 錯誤！！或是測試！！: ${data}`);
    }
  );

  pythonProcess.on(
    'close',
    async (code) => {

      // 退出 code = 0 代表正常退出，所以如果非 0 就表示有錯誤
      if (code !== 0) {
        res.send('Python 錯誤了！');
      }

      try {

        // 解析 Python 腳本的輸出
        const responseJson = JSON.parse(result);
        let gpt_response = responseJson.response;

        // 去掉GPT回應中markdown語法的部分
        gpt_response = gpt_response.replace(/```json/g, '').replace(/```/g, '');
        // string轉json
        gpt_response = JSON.parse(gpt_response);

        result_array.revised_option = gpt_response['修改後選項內容']
        result_array.revised_answer = gpt_response['正確答案']
        console.log(result_array);
        
        res.send(result_array)
        
      }
      catch (error) {
        console.log('controller錯誤了!，錯誤訊息: ', error);
        res.send(error);
      }
      
    }
  );
  

  
  
}

module.exports.articlGetQuestion = articlGetQuestion;
module.exports.articleupload_student_table = articleupload_student_table;
module.exports.articleGetStudentTable = articleGetStudentTable;
module.exports.articleCatchStudentTable = articleCatchStudentTable;
module.exports.articlGetAnswer = articlGetAnswer;
module.exports.gpt_response_table = gpt_response_table;
module.exports.articlGetGptJudge = articlGetGptJudge;
module.exports.articlUploadPracticeTable = articlUploadPracticeTable;
module.exports.articleGetPermission = articleGetPermission;
module.exports.articleGetWeek = articleGetWeek;
module.exports.articleGetClass = articleGetClass;
module.exports.articleUpdatePracticeRecord = articleUpdatePracticeRecord;
module.exports.articleGetPractiecRecord = articleGetPractiecRecord;
module.exports.articleUploadPracticeRecord = articleUploadPracticeRecord;
module.exports.articleGetQuestionInformation = articleGetQuestionInformation;
module.exports.articleGetPracticeQeuestionId = articleGetPracticeQeuestionId;
module.exports.articleUploadPracticeQuestion = articleUploadPracticeQuestion;

// 辰翰 8/4 獲取pred_question所有資料
module.exports.articlGetAllQuestion = articlGetAllQuestion;
// 辰翰 8/11 獲取concept_lib所有資料
module.exports.articlGetAllConcept = articlGetAllConcept;
// 辰翰 8/13 新增概念
module.exports.articlAddConcept = articlAddConcept;
// 辰翰 8/13 刪除概念(連帶外鍵關聯資料一起刪除)
module.exports.articlRemoveConcept = articlRemoveConcept;
// 辰翰 8/13 修改概念
module.exports.articlModifyConcept = articlModifyConcept;
// 辰翰 8/16 新增題目
module.exports.articlAddQuestion = articlAddQuestion;
// 辰翰 8/17 刪除概念(純刪除概念)
module.exports.articlRemoveConceptOnly = articlRemoveConceptOnly;
// 辰翰 8/17 刪除題目
module.exports.articlRemoveQuestion = articlRemoveQuestion;
// 辰翰 8/17 修改題目
module.exports.articlModifyQuestion = articlModifyQuestion;
// 辰翰 8/18 獲取所有課程
module.exports.articlGetAllClass = articlGetAllClass;
// 辰翰 8/18 獲取所有週次概念
module.exports.articlGetAllWeekConcept = articlGetAllWeekConcept;
// 辰翰 8/18 修改週次概念
module.exports.articlModifyWeekConcept = articlModifyWeekConcept;
// 辰翰 8/21 獲取所有學生
module.exports.articlGetAllStudent = articlGetAllStudent;
// 辰翰 8/22 獲取所有課程學生
module.exports.articlGetAllClassStudent = articlGetAllClassStudent
// 辰翰 8/23 修改課程學生
module.exports.articlModifyClassStudent = articlModifyClassStudent
// 辰翰 8/23 透過login_id刪除課程學生
module.exports.articlRemoveStudentByIdFromClassStudent = articlRemoveStudentByIdFromClassStudent
// 辰翰 9/2 透過CSV檔新增題目
module.exports.articlAddQuestionByCsv = articlAddQuestionByCsv
// 辰翰 9/2 根據概念名稱獲取概念ID
module.exports.articlGetConceptIdByName = articlGetConceptIdByName
// 辰翰 9/10 新增使用紀錄
module.exports.articlAddRecord = articlAddRecord
// 辰翰 9/10 獲取所有使用紀錄
module.exports.articlGetAllRecord = articlGetAllRecord
// 羽喬 9/12 更改密碼
module.exports.articlChangePassword = articlChangePassword
// 羽喬 9/13 抓舊密碼
module.exports.articlCheckPassword = articlCheckPassword
// 辰翰 9/12 獲取註冊表資料
module.exports.articlGetAllRegistry = articlGetAllRegistry
// 辰翰 9/12 新增學號到註冊表
module.exports.articlAddUserToRegistry = articlAddUserToRegistry
// 辰翰 9/12 根據ID刪除註冊表中學號
module.exports.articlRemoveUserFromRegistry = articlRemoveUserFromRegistry
// 辰翰 10/4 輸入一概念集，若其中概念沒有在資料表中則新增
module.exports.articlAddConceptIfNotExist = articlAddConceptIfNotExist
// 辰翰 10/25 輸入0或1，更改題目之驗證狀態
module.exports.articlModifyQuesVerification = articlModifyQuesVerification
// 嘉盛 11/11 上傳小幫手用戶的query
module.exports.articlUploadUserQuery = articlUploadUserQuery
// 嘉盛 11/12 得到小幫手用戶的query
module.exports.articlGetUserResponse = articlGetUserResponse
// 嘉盛 11/12 把用戶的query傳給gpt並得到回應
module.exports.articlGetGptResponse = articlGetGptResponse
// 辰翰 11/18 根據現有題目及選項內容重新生成選項
module.exports.articlOptionRegenerate = articlOptionRegenerate