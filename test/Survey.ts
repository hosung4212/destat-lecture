import { expect } from "chai";    
import { network } from "hardhat";

interface Question {
    question: string;
    options: string[];
}

it("Survey init", async ()  => {
   const { ethers } = await network.connect();
   const title = "막무가내 설문조사";
   const description = 
   "중앙화된 설문조사...";
   const questions: Question[] = [
    {
        question: "누가 내 응답을 관리할 때 ...",
        options: [
            "구글폼 운영자",
            "블록체인 네트워크 참여자",
            "상관없음",
        ],
    },
   ];

   const factory = await ethers.deployContract("SurveyFactory",[]);
   await factory.createSurvey({
    title, 
    description, 
    questions
   });

   const surveys = await factory.getSurveys();
   const surveyC = await ethers.getContractFactory("Survey");
   const survey = await surveyC.attach(surveys[0]);
   console.log(await survey.getQuestions());
});


