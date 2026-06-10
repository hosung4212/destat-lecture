import {Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {TrendingUpIcon} from "lucide-react";

export default function TrendCard({
    title,
    value,
    trendValue,
    trendMessage,
    periodMessage
} : {
    title: string;
    value: string;
    trendValue: string;
    trendMessage: string;
    periodMessage: string;
}) {
    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                    {title}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
                    {value}
                </CardTitle>
                <CardAction className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUpIcon className="h-4 w-4" />
                    <span>{trendValue}</span>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                    {trendMessage} <TrendingUpIcon className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground">
                    {periodMessage}
                </div>
            </CardFooter>
        </Card>
    )
}