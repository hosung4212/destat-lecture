import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Link} from "react-router";
import {EyeIcon, UsersIcon, ViewIcon} from "lucide-react";

/**
 * Renders a SurveyCard component that displays a sample survey card with a title, description,
 * image, and a button to join the survey.
 *
 * @return {JSX.Element} The SurveyCard component.
 */
export default function SurveyCard({
    title,
    description,
    view,
    count,
    image,
    address
}:{
    title: string;
    description: string;
    view: number;
    count: number;
    image: string;
    address: string;
}) {
    return (
        <Link to={`/survey/${address}`}>
            <Card className={"max-w-92"}>
                <CardHeader>
                    <div className={"flex flex-row justify-between items-center"}>
                        <CardTitle>{title}</CardTitle>
                        <div className={"flex flex-row gap-2"}>
                            <div className={"flex flex-row text-xs gap-0.5"}>
                                <EyeIcon size={17} /> {view}
                            </div>
                            <div className={"flex flex-row text-xs gap-0.5"}>
                                <UsersIcon size={17} /> {count}
                            </div>
                        </div>
                    </div>
                    <CardDescription className={"line-clamp-2 min-h-10"}>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <img
                        className={"rounded-2xl"}
                        src={image}
                    />
                </CardContent>
                <CardFooter>
                    <Button className={"w-full"}>
                        Join
                    </Button>
                </CardFooter>
            </Card>
       </Link>
    )
}