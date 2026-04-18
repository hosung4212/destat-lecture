import { expect } from "chai";
import { formatEther, keccak256 } from "ethers";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

// it("Survey init", async ()  => {
const { ethers } = await network.connect();
const title = "막무가내 설문조사";
const description = "중앙화된 설문조사...";
const questions: Question[] = [
  {
    question: "누가 내 응답을 관리할 때 ...",
    options: ["구글폼 운영자", "블록체인 네트워크 참여자", "상관없음"],
  },
];

const factory = await ethers.deployContract("SurveyFactory", [
  ethers.parseEther("50"),
  ethers.parseEther("0.1"),
]);
const tx = await factory.createSurvey(
  {
    title,
    description,
    targetNumber: 100,
    questions,
  },
  {
    value: ethers.parseEther("100"),
  },
);
const receipt = await tx.wait();
let surveyAddress;
receipt?.logs.forEach((log) => {
  const event = factory.interface.parseLog(log);
  if (event?.name === "SurveyCreated") {
    surveyAddress = event.args[0];
  }
});

//const surveys = await factory.getSurveys();

const surveyC = await ethers.getContractFactory("Survey");
const signers = await ethers.getSigners();
const respondent = signers[0];
if (surveyAddress) {
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

it("Survey storage layout", async () => {
  const { ethers } = await network.connect();
  const title = "막무가내 설문조사";
  const description =
    "중앙화된 설문조사.......................................................................";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할 때 ...................",
      options: ["구글폼 운영자", "블록체인 네트워크 참여자", "상관없음"],
    },
    {
      question: "test2",
      options: ["구글폼 운영자"],
    },
  ];

  const survey = await ethers.deployContract(
    "Survey",
    [title, description, 100, questions],
    {
      value: ethers.parseEther("100"),
    },
  );

  const slot0Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(0, 32),
  );

  const slot1Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(1, 32),
  );
  const slot2Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(2, 32),
  );
  const slot3Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(3, 32),
  );
  const slot4Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(4, 32),
  );
  const slot5Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(5, 32),
  );
  const slot6Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(6, 32),
  );

  const decodeUni = (hex: string) =>
    Buffer.from(hex.slice(2), "hex").toString("utf-8");
  const nextHash = (hex: string, i: number) =>
    "0x" + (BigInt(hex) + BigInt(i)).toString(16);

  console.log(slot0Data);
  //primative type
  console.log("--- Primitive types ---");
  console.log(slot2Data);
  console.log(slot3Data);

  // long string
  console.log("long string");
  console.log(slot1Data); // 0x103 == 259
  // 129 * 2 +1 = 259 (0x103)

  // pDesc = hash256(pslot1), getStorage(pDesc)

  const pDesc = keccak256(ethers.toBeHex(1, 32));
  const desc0 = await ethers.provider.getStorage(
    await survey.getAddress(),
    pDesc,
  );

  const desc1 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 1),
  );

  const desc2 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 2),
  );
  const desc3 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 3),
  );

  const desc4 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 4),
  );
  const desc5 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 5),
  );
  console.log(desc0);
  console.log(desc1);
  console.log(desc2);
  console.log(desc3);
  console.log(desc4);
  console.log(desc5);

  // Array type
  // pQuestions = 0xeca491ec9599ed9994eb909c20ec84a4ebacb8eca1b0ec82ac2e2e2e00000038
  // question1 <----- pQuestions 0xeca491ec9599ed9994eb909c20ec84a4ebacb8eca1b0ec82ac2e2e2e00000039
  // question1_option <---pQuestions + 1
  // question2 < ---- pQuestions + 2
  //question2_option <--- pQuestions + 3
  console.log("\n--- Array type ---");
  console.log("slot4Data", slot4Data);
  const pQuestions = keccak256(ethers.toBeHex(4, 32));
  const question1 = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 0),
  );
  const question1_option_array = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 1),
  );
  const question2 = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 2),
  );
  const question2_option = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 3),
  );
  console.log("question1", question1);
  console.log("question1_option[]", question1_option_array);

  console.log("question2", question2, decodeUni(question2));
  console.log("question2_option[]", question2_option);

  //map
  //map [ keccak256(k, slot address)]
  console.log(slot6Data);
  const addr = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
  const mapKeyAddr = keccak256(
    ethers.toBeHex(addr, 32) + ethers.toBeHex(6, 32).slice(2),
  );
  const mapValue = await ethers.provider.getStorage(
    survey.getAddress(),
    mapKeyAddr,
  );
  console.log(mapValue);
});
