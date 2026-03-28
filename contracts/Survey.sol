// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
struct Question {
    string question;
    string[] options;
}

struct Answer {
    address respondent;
    uint8[] answers;
}

contract Survey {
    string public title;
    string public description;
    Question[] questions;
    Answer[] answers;
    
    //primitive: int, bool, uint
    // memory, storage, calldata
    constructor(
        string memory _title, 
        string memory _description, 
        Question[] memory _questions
        ){
        title =_title;
        description = _description;
        for (uint i = 0; i < _questions.length; i++) {
            questions.push(
                Question({
                    question: _questions[i].question,
                    options: _questions[i].options
                })
            );
        // Question memory q = _questions.push();
        // q.question = _questions[i].question;
        // q.options = _questions[i].options;
        }
    }

    function submitAnswer(Answer calldata _answer) external {
        //validate the answer
        require(_answer.answers.length == questions.length, "Mismatched andswer length");

        answers.push(
            Answer({respondent: _answer.respondent, answers: _answer.answers})
            );
    }

    function getAnswers() external view returns (Answer[] memory) {
        return answers;
    }

    function getQuestions() external view returns ( Question[] memory) {
        return questions;
    }
}