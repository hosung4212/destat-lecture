import { network } from "hardhat";
import { expect } from "chai";

interface Question {
  question: string;
  options: string[];
}

describe("Survey init", () => {
  const title = "막무가내 설문조사라면";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
        "상관없음",
      ],
    },
  ];

  const getSurveyContractAndEthers = async (survey: {
    title: string;
    description: string;
    targetNumber: number;
    questions: Question[];
  }) => {
    const { ethers } = await network.connect();
    const cSurvey = await ethers.deployContract("Survey", [
      survey.title,
      survey.description,
      survey.targetNumber,
      survey.questions,
    ]);
    return { ethers, cSurvey };
  };

  describe("Deployment", () => {
    it("should store survey info correctly", async () => {
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 3,
        questions,
      });

      expect(await cSurvey.title()).to.equal(title);
      expect(await cSurvey.description()).to.equal(description);

      const q = await cSurvey.getQuestions();
      expect(q[0][0]).to.equal(questions[0].question);
      expect(q[0][1]).to.deep.equal(questions[0].options);
    });

    it("should calculate rewardAmount correctly", async () => {
      const { ethers } = await network.connect();
      const Survey = await ethers.getContractFactory("Survey");
      const totalReward = ethers.parseEther("1.0");
      const targetNumber = 5;

      const cSurvey = await Survey.deploy(
        title,
        description,
        targetNumber,
        questions,
        { value: totalReward },
      );

      expect(await cSurvey.rewardAmount()).to.equal(
        totalReward / BigInt(targetNumber),
      );
    });
  });

  describe("Questions and Answers", () => {
    it("should return questions correctly", async () => {
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 3,
        questions,
      });

      const q = await cSurvey.getQuestions();
      expect(q[0][0]).to.equal(questions[0].question);
      expect(q[0][1]).to.deep.equal(questions[0].options);
    });

    it("should allow valid answer submission", async () => {
      const { ethers } = await network.connect();
      const [_, respondent] = await ethers.getSigners();

      const Survey = await ethers.getContractFactory("Survey");
      const cSurvey = await Survey.deploy(title, description, 2, questions, {
        value: ethers.parseEther("1.0"),
      });

      const ansStruct = {
        respondent: respondent.address,
        answers: [0],
      };

      await cSurvey.connect(respondent).submitAnswer(ansStruct);
      const a = await cSurvey.getAnswers();
      expect(a[0].respondent).to.equal(respondent.address);
      expect(a[0].answers[0]).to.equal(0);
    });

    it("should revert if answer length mismatch", async () => {
      const { ethers } = await network.connect();
      const [_, respondent] = await ethers.getSigners();

      const Survey = await ethers.getContractFactory("Survey");
      const cSurvey = await Survey.deploy(title, description, 3, questions, {
        value: ethers.parseEther("3.0"),
      });

      const wrongStruct = {
        respondent: respondent.address,
        answers: [0, 1], // 질문 수보다 많다.
      };

      await expect(
        cSurvey.connect(respondent).submitAnswer(wrongStruct),
      ).to.be.revertedWith("Number of answers must match number of questions");
    });

    it("should revert if target reached", async () => {
      const { ethers } = await network.connect();
      const [_, user1, user2] = await ethers.getSigners();

      const Survey = await ethers.getContractFactory("Survey");
      const cSurvey = await Survey.deploy(title, description, 1, questions, {
        value: ethers.parseEther("1.0"),
      });

      const ans1 = { respondent: user1.address, answers: [0] };
      await cSurvey.connect(user1).submitAnswer(ans1);

      const ans2 = { respondent: user2.address, answers: [1] };
      await expect(
        cSurvey.connect(user2).submitAnswer(ans2),
      ).to.be.revertedWith("Target number of responses reached");
    });
  });

  describe("Rewards", () => {
    it("should pay correct reward to respondent", async () => {
      const { ethers } = await network.connect();
      const [_, respondent] = await ethers.getSigners();

      const Survey = await ethers.getContractFactory("Survey");
      const totalReward = ethers.parseEther("1.0");
      const cSurvey = await Survey.deploy(title, description, 1, questions, {
        value: totalReward,
      });

      const ans = { respondent: respondent.address, answers: [0] };

      const before = await ethers.provider.getBalance(respondent.address);

      // 트랜잭션 실행
      const tx = await cSurvey.connect(respondent).submitAnswer(ans);
      const receipt = await tx.wait();

      // 가스비 계산
      const gasUsed = receipt!.gasUsed;
      const gasPrice = tx.gasPrice ?? (receipt as any).effectiveGasPrice;
      const gasCost = gasUsed * gasPrice;

      const after = await ethers.provider.getBalance(respondent.address);
      const rewardAmount = await cSurvey.rewardAmount();

      console.log(`
        Before:  ${ethers.formatEther(before)} ETH
        After:   ${ethers.formatEther(after)} ETH
        GasCost: ${ethers.formatEther(gasCost)} ETH
        ΔBalance: ${ethers.formatEther(after - before + gasCost)} ETH
        Reward:  ${ethers.formatEther(rewardAmount)} ETH
      `);

      // 가스비 보정 후 rewardAmount 증가한 양 확인
      expect(after - before + gasCost).to.equal(rewardAmount);
    });
  });
});
