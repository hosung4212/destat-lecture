import { expect } from "chai";
import { network } from "hardhat";

describe("SurveyFactory Contract", () => {
  let ethers: any;
  let factory: any, owner: any, respondent1: any, respondent2: any; 

  beforeEach(async () => {
    const context = await network.connect();
    ethers = context.ethers;
    [owner, respondent1, respondent2] = await ethers.getSigners();

    // 1. SurveyFactory 배포 (생성자 인자 전달)
    factory = await ethers.deployContract("SurveyFactory", [
        ethers.parseEther("50"), // min_pool_amount
        ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    // 컨트랙트 주소가 정상인지 확인하여 배포 성공 검증
    expect(factory.target).to.properAddress;
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const surveySchema = {
      title: "과제용 설문",
      description: "테스트 설명",
      targetNumber: 100, // 50 / 100 = 0.5 (MIN_REWARD 0.1보다 큼)
      questions: [{ question: "Q1", options: ["A", "B"] }]
    };

    // TODO: check event SurveyCreated emitted
    // TODO: check surveys array length increased
    await expect(factory.createSurvey(surveySchema, { value: ethers.parseEther("50") }))
      .to.emit(factory, "SurveyCreated");

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    const surveySchema = {
      title: "실패 테스트",
      description: "Low Pool",
      targetNumber: 10,
      questions: []
    };

    await expect(
      factory.createSurvey(surveySchema, { value: ethers.parseEther("49") })
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const surveySchema = {
      title: "실패 테스트",
      description: "Low Reward",
      targetNumber: 1000, // 50 / 1000 = 0.05 (MIN_REWARD 0.1보다 작음)
      questions: []
    };

    await expect(
      factory.createSurvey(surveySchema, { value: ethers.parseEther("50") })
    ).to.be.revertedWith("Insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    // TODO: create multiple surveys and check getSurveys output
    const schema = { title: "S1", description: "D1", targetNumber: 10, questions: [] };
    
    await factory.createSurvey(schema, { value: ethers.parseEther("50") });
    await factory.createSurvey(schema, { value: ethers.parseEther("50") });

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(2);
  });
});