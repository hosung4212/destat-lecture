import { supabase } from "~/postgres/supaclient"

// before rendering Home react component
export async function loader() {
    const {data} = await supabase().from("destat-test").select("*");
}

export default function Dashboard() {
    return <div>
        Hello destat world
    </div>
}
