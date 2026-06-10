import {Card, CardHeader, CardAction, CardContent, CardDescription, CardFooter, CardTitle} from "~/components/ui/card";
import {Form} from "react-router";
import {SendIcon, User2Icon} from "lucide-react";
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import MessageBubble from "~/features/survey/message-bubble";
import type {Route} from "./+types/survey"
import {useReadContract, useWriteContract, useAccount} from "wagmi";
import {SURVEY_ABI} from "~/features/survey/constant";
import {useState, useEffect} from "react";

export const action = async ({request}: Route.ActionArgs) => {
    const formData = await request.formData();
    const answers = Object.fromEntries(formData);
};

interface questions {
    question: string;
    options: string[];
}

const questions: questions[] = [
    {
        question: "블록체인에서 트랜잭션이 검증되는 과정을 무엇이라 하나요?",
        options: ["마이닝", "스테이킹", "커밋", "인덱싱"],
    },
    {
        question: "다음 중 대칭키 암호화 방식이 아닌 것은?",
        options: ["AES", "DES", "RSA", "ChaCha20"],
    },
    {
        question: "HTTP 프로토콜의 기본 포트 번호는 무엇인가요?",
        options: ["80", "8080", "22", "443"],
    },
    {
        question: "다음 중 파이썬의 자료형이 아닌 것은?",
        options: ["list", "tuple", "map", "set"],
    },
    {
        question: "SQL에서 데이터를 조회할 때 사용하는 명령어는?",
        options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
    },
];
export default function Survey({ params }: Route.ComponentProps) {
    const { data: questions } = useReadContract({
        address: params.surveyId as `0x{string}`,
        functionName: 'getQuestions',
        abi: SURVEY_ABI,
        args: [],
    });
    const { data: title } = useReadContract({
        address: params.surveyId as `0x{string}`,
        functionName: 'title',
        abi: SURVEY_ABI,
        args: [],
    });
    const { data: description } = useReadContract({
        address: params.surveyId as `0x{string}`,
        functionName: 'description',
        abi: SURVEY_ABI,
        args: [],
    });
    const { data: target } = useReadContract({
        address: params.surveyId as `0x{string}`,
        functionName: 'targetNumber',
        abi: SURVEY_ABI,
        args: [],
    });
    const { data: answers } = useReadContract({
        address: params.surveyId as `0x{string}`,
        functionName: 'getAnswers',
        abi: SURVEY_ABI,
        args: [],
    });
    const [counts, setCounts] = useState<Number[][]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const { address } = useAccount();
    const countAnswers = () => {
        if (!target) return;
        return questions?.map((q, i) => {
            const count = Array.from({ length: q.options.length }).fill(0) as number[];
            answers?.map((a) => count[a.answers[i]]++);
            return count.map((n) => (n / Number(target)) * 100);
        });
    };

    useEffect(() => {
        if (!answers || !questions || !address) return;
        for (const answer of answers) {
            if (answer.respondent === address) {
                setCounts(countAnswers() || []);
                setIsAnswered(true);
                return;
            }
        }
    }, [answers, address, target]);

    const { writeContract } = useWriteContract();
    const submitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
        if (!address) {
            alert('please connect before submit');
            return;
        }
        const formData = new FormData(e.currentTarget);
        const answers: number[] = [];
        for (const value of formData.values()) {
            answers.push(Number(answers));
        }

        writeContract({
            address: params.surveyId as `0x{string}`,
            functionName: 'submitAnswer',
            abi: SURVEY_ABI,
            args: [
                {
                    respondent: address,
                    answers,
                },
            ],
        });
    };
    return (
        <div className="grid grid-cols-3 w-screen gap-3">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="font-extrabold text-3xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                {isAnswered ? (
                    <CardContent className="overflow-y-auto h-[70vh]">
                        <h1 className="font-semibold text-xl pb-4">Survey Progress</h1>
                        <div className="grid grid-cols-2 gap-5 ">
                            {questions?.map((q, i) => (
                                <div className="flex flex-col">
                                    <h1 className="font-bold">{q.question}</h1>
                                    <div className="flex flex-col gap-1 pl-2 ">
                                        {q.options.map((o, j) => (
                                            <div className="flex flex-row justify-center items-center relative">
                                                <div className="left-2 absolute text-xs font-semibold">{o}</div>
                                                <div className="w-full bg-gray-200 h-5 rounded-full">
                                                    <div
                                                        className="bg-purple-400 w-14 h-5 rounded-full overflow-hidden"
                                                        style={{ width: `${counts[i][j]}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        <Form onSubmit={submitAnswer} className="grid grid-cols-2">
                            {questions?.map((q, i) => (
                                <div className="flex flex-col">
                                    <span className="mt-5 mb-1">{q.question}</span>
                                    {q.options.map((o, j) => (
                                        <label className="flex items-center gap-1">
                                            <Input
                                                className="hidden peer"
                                                type="radio"
                                                name={i.toString()}
                                                value={j.toString()}
                                            ></Input>
                                            <span className="w-4 h-4 rounded-full border-2 peer-checked:bg-primary"></span>
                                            <span className="font-semibold">{o}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                            <Button className="w-full mt-3" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </CardContent>
                )}
            </Card>
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 overflow-y-auto h-[70vh]">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <MessageBubble sender={i % 2 == 0} />
                    ))}
                </CardContent>
                <CardFooter className="w-full">
                    <Form className="flex flex-row items-center relative w-full">
                        <input
                            type="text"
                            placeholder="type a messsage.."
                            className="border-1 w-full h-8 rounded-2xl px-2 text-xs "
                        ></input>
                        <Button className="flex flex-row justify-center items-center w-6 h-5 absolute right-2">
                            <SendIcon />
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}