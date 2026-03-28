import { expect } from "chai";    
import { formatEther } from "ethers";
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

   const factory = await ethers.deployContract("SurveyFactory",[
    ethers.parseEther("50"),
    ethers.parseEther("0.1"),
   ]);
   const tx = await factory.createSurvey({
    title, 
    description, 
    targetNumber: 100,
    questions
   },
   {
    value: ethers.parseEther("100"),
   });
   const receipt = await tx.wait();
   let surveyAddress;
   receipt?.logs.forEach(log => {
    const event = factory.interface.parseLog(log);
    if (event?.name === "SurveyCreated") {
        surveyAddress = event.args[0];
    }
});

   //const surveys = await factory.getSurveys();

   const surveyC = await ethers.getContractFactory("Survey");
   const signers = await ethers.getSigners();
   const respondent = signers[0];
   if(surveyAddress) {
    const survey = await surveyC.attach(surveyAddress);
    await survey.connect(respondent);
    console.log(await formatEther(await ethers.provider.getBalance(respondent)));
    const submitTx = await survey.submitAnswer({
        respondent,
        answers: [1],
    });
    await submitTx.wait(0);
    console.log(await formatEther(await ethers.provider.getBalance(respondent)));  
   }
});


