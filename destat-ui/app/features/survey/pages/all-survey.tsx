import SurveyCard from "~/features/survey/components/survey-card";
import {createPublicClient, getContract} from "viem";
import {hardhat} from "@wagmi/core/chains";
import {http} from "@wagmi/core";
import {SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI} from "~/features/survey/constant";
import {useEffect, useState} from "react";
import {supabase} from "~/postgres/supaclient";
import type { Route } from './+types/all-survey';

interface surveyMeta {
    title: string;
    description: string;
    count: number;
    view: number|null;
    image: string|null;
    address: string;
}

export const loader = async ({request}:Route.LoaderArgs) => {
    const {data, error} = await supabase
        .from("all_survey_overview")
        .select(("*"));

    if (!error) {
        return data.map((s) => {
            return {
                title:s.title!,
                description:s.description!,
                count:s.count!,
                view:s.view,
                image:s.image,
                address:s.id!
            }
        });
    } else {
        return [];
    }
}

export default function AllSurveys({ loaderData }: Route.ComponentProps) {
    const [surveys, setSurveys] = useState<surveyMeta[]>(loaderData);

    const onChainLoader = async () => {
        const client = createPublicClient({
            chain: hardhat,
            transport: http(),
        });
        const surveyFactoryContract = getContract({
            address: SURVEY_FACTORY,
            abi: SURVEY_FACTORY_ABI,
            client
        });
        const surveys = await surveyFactoryContract.read.getSurveys();
        const surveyMetaData = await Promise.all(
            surveys.map(async (surveyAddress) => {
                const surveyContract = getContract({
                    address: surveyAddress,
                    abi: SURVEY_ABI,
                    client
                });
                const title = await surveyContract.read.title();
                const description = await surveyContract.read.description();
                const answer = await surveyContract.read.getAnswers();
                return {
                    title,
                    description,
                    count:answer.length,
                    view:null,
                    image:null,
                    address:surveyAddress
                };
            })
        );
        return surveyMetaData;
    };

    // useEffect(() => {
    //     const onchainData = async () => {
    //         await new Promise(resolve => setTimeout(resolve, 3000));
    //         const onchainSurveys = await onChainLoader()
    //         setSurveys(onchainSurveys);
    //     };
    //     onchainData();
    // }, []);

    return (
        <div className={"grid grid-cols-4 gap-4"}>
            <div className={"flex flex-col justify-center items-center"}>
                <h1 className={"text-2xl font-extrabold"}>Live Surveys</h1>
                <span className={"font-light"}>Join the surveys!</span>
            </div>
            {surveys.map((survey) => (
                <SurveyCard
                    title={survey.title}
                    description={survey.description}
                    view={survey.view!}
                    count={survey.count}
                    image={survey.image!}
                    address={survey.address}
                />
            ))}
        </div>
    );
}