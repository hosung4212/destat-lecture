import { Form } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import type { Route } from './+types/create-survey';
import { useState, useEffect, type FormEvent } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SURVEY_FACTORY, SURVEY_FACTORY_ABI } from '../constant';
import { parseEther, decodeEventLog } from 'viem';
import { supabase } from "~/postgres/supaclient";

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const metadata = JSON.parse(formData.get('metadata') as string);
    const imageFile = formData.get('image') as File;
    const {data, error} = await supabase.storage.from('images').upload(metadata.id, imageFile);

    if (!error) {
        const publicUrl = await supabase.storage.from("images").getPublicUrl(data.path);
        await supabase.from("survey").insert({
            id:metadata.id,
            title:metadata.title,
            description:metadata.description,
            target_number:metadata.targetNumber,
            reward_amount:metadata.rewardAmount,
            image:publicUrl.data.publicUrl,
            questions:metadata.questions,
            owner:metadata.owner,
        });
    }
};

export default function createSurvey() {
    const [options, setOptions] = useState([1]);
    const [image, setImage] = useState('');
    const [formImage, setFormImage] = useState<File>();
    const { data:hash, writeContract } = useWriteContract();
    const { data:receipt, isFetched } = useWaitForTransactionReceipt({
        hash,
    });
    const [surveyMeta, setSurveyMeta] = useState({});
    const { address }  = useAccount();

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const addQuestion = () => {
        setOptions([...options, 1]);
    };
    const deleteQuestion = () => {
        if (options.length <= 1) return;
        setOptions(options.slice(0, options.length - 1));
    };
    const addOption = (i: number) => {
        if (options[i] < 1) return;
        setOptions(options.map((o, j) => (i == j ? o + 1 : 0)));
    };
    const deleteOption = (i: number) => {
        if (options[i] <= 1) return;
        setOptions(options.map((o, j) => (i == j ? o - 1 : 0)));
    };

    const createSurvey = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const questionsData = formData.getAll('q') as string[];
        const questions = questionsData.map((q, i) => {
            const options = formData.getAll(i.toString()) as string[];
            return {
                question: q,
                options,
            } as const;
        });
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const targetNumber = formData.get('target') as string;
        const poolSize = formData.get('pool') as string;
        const formImg = formData.get('image') as File;
        setFormImage(formImg);

        writeContract({
            address: SURVEY_FACTORY,
            abi: SURVEY_FACTORY_ABI,
            functionName: 'createSurvey',
            args: [
                {
                    title,
                    description,
                    targetNumber: BigInt(targetNumber),
                    questions,
                },
            ],
            value: parseEther(poolSize),
        });

        setSurveyMeta({
            title,
            description,
            targetNumber,
            rewardAmount: Number(poolSize) / Number(targetNumber),
            questions,
            owner: address
        });
    };

    useEffect(() => {
        if (!isFetched || !receipt || !formImage) return;
        const callAction = async () => {
            let contractAddress;
            for (const log of receipt?.logs) {
                const event = decodeEventLog({
                    abi:SURVEY_FACTORY_ABI,
                    data: log.data,
                    topics: log.topics,
                });
                if (event.eventName === 'SurveyCreated') {
                    contractAddress = event.args.surveyAddress;
                }
            }
            const formData = new FormData();
            const newSurveyMeta = {
                ...surveyMeta,
                id:contractAddress,
            }
            formData.append("metadata", JSON.stringify(newSurveyMeta))
            formData.append("image", formImage);
            await fetch(`/survey/create`, {
                method: 'POST',
                body: formData,
            });
        };
        callAction();
    }, [receipt]);

    return (
        <div className="flex w-full h-full justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Create Survey</CardTitle>
                    <CardDescription>
                        Build and publish a new survey to collect reliable reponses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form onSubmit={createSurvey} encType="multipart/form-data">
                        <label className=" flex flex-col mb-2">
                            <h1 className="font-bold">Title</h1>
                            <Input type="text" name="title"></Input>
                        </label>
                        <label className=" flex flex-col mb-2">
                            <h1 className="font-bold">Description</h1>
                            <Input type="text" name="description"></Input>
                        </label>
                        <label className=" flex flex-col mb-2">
                            <h1 className="font-bold">Target Number</h1>
                            <Input type="number" name="target"></Input>
                        </label>
                        <label className=" flex flex-col mb-2">
                            <h1 className="font-bold">Reward Pool Size</h1>
                            <Input type="number" name="pool" placeholder="50"></Input>
                        </label>
                        <h1 className="font-bold">Questions</h1>
                        {options.map((n, i) => (
                            <div className="mb-4" key={`q-${i}`}>
                                <Input type="text" placeholder="Question" name="q" />
                                <div>
                                    {Array.from({ length: n }).map((_, j) => (
                                        <div className="flex items-center" key={`q-${i}-opt-${j}`}>
                                            {j == n - 1 && j != 1 ? (
                                                <Button
                                                    type="button"
                                                    onClick={() => deleteOption(i)}
                                                    className="bg-red-200 h-8 w-8 mr-1 rounded-full"
                                                >
                                                    -
                                                </Button>
                                            ) : (
                                                <div className="h-8 w-8 mr-1.5 rounded-full"></div>
                                            )}
                                            <Input type="text" placeholder="option" name={i.toString()} />
                                            {j == n - 1 && (
                                                <Button
                                                    type="button"
                                                    onClick={() => addOption(i)}
                                                    className="bg-gray-300 h-8 w-8 ml-1 rounded-full"
                                                >
                                                    +
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center items-center mb-4">
                            <Button
                                type="button"
                                onClick={() => deleteQuestion()}
                                className="bg-red-200 h-8 w-8 mr-1 rounded-full"
                            >
                                -
                            </Button>
                            <Button
                                type="button"
                                onClick={() => addQuestion()}
                                className="bg-gray-300 h-8 w-8 mr-1 rounded-full"
                            >
                                +
                            </Button>
                        </div>
                        <h1 className="font-bold mb-2">Upload File</h1>
                        <Card className="mb-3">
                            <CardContent>
                                <div className="flex justify-center items-center relative">
                                    {image ? (
                                        <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                                            <img
                                                src={image}
                                                className="rounded-2xl object-cover w-[300px] h-[300px] "
                                            ></img>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                                            +
                                        </div>
                                    )}
                                    <label className="absolute w-[300px] h-[300px] top-0">
                                        <Input
                                            type="file"
                                            className="hidden"
                                            onChange={uploadFile}
                                            name="image"
                                        ></Input>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                        <Button type="submit" className="w-full">
                            Create
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}