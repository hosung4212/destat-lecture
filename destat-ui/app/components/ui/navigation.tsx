import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu"

import { Link } from "react-router";
import { Button } from "./button";
import { rabbykit } from "~/root";

export default function Navigation() {
    return (
        <nav className="fixed top-0 right-0 left-0">
            <div className="flex w-screen items-center justify-between py-5 px-5">
                <Link to="/" className="text-lg font-bold">DESTAT</Link>
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink>Dashboard</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Survey</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-2">
                                <NavigationMenuLink asChild>
                                <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col items-center justify-center rounded-md bg-gradient-to-t no-underline outline-none focus:outline-none data-[state=open]:bg-muted"
                                href="/"
                                >
                                    <div className="text-lg font-medium">
                                        shacn/ui 
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                        Beautifully designed components built with Tailwind CSS.
                                    </p>
                                </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <Link to="/survey/all">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="leading-none font-medium">All Surveys

                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">List all surveys

                                    </div>
                                    </div>
                                    </Link>
                                    </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <Link to="/survey/create">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="leading-none font-medium">
                                        Create survey

                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">
                                        List all surveys

                                    </div>
                                    </div>
                                    </Link>
                                    </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Archive</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-2">
                                <NavigationMenuLink asChild>
                                <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col items-center justify-center rounded-md bg-gradient-to-t no-underline outline-none focus:outline-none data-[state=open]:bg-muted"
                                href="/"
                                >
                                    <div className="text-lg font-medium">
                                        shacn/ui 
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                        Beautifully designed components built with Tailwind CSS.
                                    </p>
                                </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <Link to="/archive/finish">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="leading-none font-medium">
                                        Finished surveys

                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">
                                        Finished surveys

                                    </div>
                                    </div>
                                    </Link>
                                    </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>profile</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-2">
                                <NavigationMenuLink asChild>
                                <a
                                className="from-muted/50 to-muted flex h-full w-full flex-col items-center justify-center rounded-md bg-gradient-to-t no-underline outline-none focus:outline-none data-[state=open]:bg-muted"
                                href="/"
                                >
                                    <div className="text-lg font-medium">
                                        shacn/ui 
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                        Beautifully designed components built with Tailwind CSS.
                                    </p>
                                </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <Link to="/profile/survey">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="leading-none font-medium">
                                        My Surveys

                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">
                                        My Surveys

                                    </div>
                                    </div>
                                    </Link>
                                    </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <Link to="/profile/response">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="leading-none font-medium">
                                        My Responses

                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">
                                        My Responses
                                    </div>
                                    </div>
                                    </Link>
                                    </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
            </NavigationMenu>
            <Button onClick={() =>{
                rabbykit.open();}}
                >
                    Connect</Button>

            </div>
        </nav>
    )
};