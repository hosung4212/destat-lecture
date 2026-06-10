import TrendCard from "../components/trend-card";
import {TrendChart} from "../components/trend-chart";
import type { Route } from './+types/dashboard';
import {supabase} from "~/postgres/supaclient";
import {DateTime} from "luxon";
import {getNumberData} from "../query";

const data = [
    { date: "2025-10-01", data: 186 },
    { date: "2025-10-02", data: 192 },
    { date: "2025-10-03", data: 178 },
    { date: "2025-10-04", data: 201 },
    { date: "2025-10-05", data: 189 },
    { date: "2025-10-06", data: 195 },
    { date: "2025-10-07", data: 183 },
    { date: "2025-10-08", data: 199 },
    { date: "2025-10-09", data: 205 },
    { date: "2025-10-10", data: 193 },
    { date: "2025-10-11", data: 187 },
    { date: "2025-10-12", data: 202 },
    { date: "2025-10-13", data: 198 },
    { date: "2025-10-14", data: 191 },
];

export const loader = async ({request}:Route.LoaderArgs) => {
    await supabase.rpc("increment_daily_visitor", {
        day:DateTime.now().startOf('day').toISO({includeOffset:false}),
    });
    const lastWeekStart = DateTime.now()
        .startOf("week")
        .minus({week: 1})
        .toISO({includeOffset:false});
    const thisWeekStart = DateTime.now()
        .startOf("week")
        .toISO({includeOffset:false});
    const thisWeekEnd = DateTime.now().toISO({includeOffset:false});
    const {data: liveSurveyCount} = await supabase
        .from("daily_live_survey")
        .select("count, created_at").order("created_at");

    let formedLivedSurveyCount = [{
        date:"",
        data:0
    }];
    if (liveSurveyCount) {
        formedLivedSurveyCount = liveSurveyCount.map((c) => {
            return {
                date: c.created_at ?? "",
                data: c.count
            };
        });
    }
    const numberCard = await getNumberData(lastWeekStart, thisWeekStart, thisWeekEnd);
    return {
        ...numberCard,
        formedLivedSurveyCount
    }
};

export default function Dashboard({loaderData}: Route.ComponentProps) {
    return (
        <div className="mt-10 flex w-full flex-col gap-8">
            <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <TrendCard
                    title={"Total Visitors"}
                    value={loaderData.value}
                    trendValue={parseInt(loaderData.trendValue, 10) + "%"}
                    trendMessage={loaderData.upAndDown ? "Trending up" : "Trending down"}
                    periodMessage={"last 7 days"}
                />
                <TrendCard
                    title={"Live Surveys"}
                    value={"123"}
                    trendValue={"200%"}
                    trendMessage={"Trending up"}
                    periodMessage={"last 6 months"}
                />
                <TrendCard
                    title={"Archived Surveys"}
                    value={"123"}
                    trendValue={"200%"}
                    trendMessage={"Trending up"}
                    periodMessage={"last 6 months"}
                />
            </div>
            <div className="grid w-full gap-5 lg:grid-cols-2">
                <TrendChart
                    title={"Live Surveys"}
                    description={"daily live survey count"}
                    trendMessage={"Trending up by 5.2% this month"}
                    periodMessage={"October 1 - October 14, 2025"}
                    chartData={loaderData.formedLivedSurveyCount}
                />
                <TrendChart
                    title={"Archived Surveys"}
                    description={"daily Archived Surveys count"}
                    trendMessage={"Holding steady compared to last week"}
                    periodMessage={"October 1 - October 14, 2025"}
                    chartData={data}
                />
            </div>
        </div>
    );
}