import { expect } from "chai";    
import { network } from "hardhat";

interface Question {
    question: string;
    options: string[];
}

it("Survey init", async ()  => {
   const { ethers } = await network.connect();

   const title = "막무가내 설문조사";
   const description = "";
   const questions: Question[] = [
    {
        question: "",
        options: [
            "구글폼 운영자"
        ],
    },
   ];
   const s = await ethers.deployContract("Survey", [
    title,
    description, 
    questions
]);
   const _title = await s.title();
   const _desc = await s.description();
   const _questions = await s.getQuestions() as Question[];
   expect(_title).to.equal(title);
   expect(_desc).to.equal(description);
   expect(_questions[0].options).deep.equal(questions[0].options);

   const signers = await ethers.getSigners();
   const respondent = signers[1];
   await s.connect(respondent);
   await s.submitAnswer({
    respondent:respondent.address,
    answers: [1],
   });

   console.log(await s.getAnswers);
});


