import { IconBoltFilled, IconPlus } from "@tabler/icons-react"
import Link from "next/link";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client";
import { DeleteButton } from "@/components/DeleteButton";

export async function SectionCards() {
  const supabase = await createClient();
  let { data: items, error } = await supabase
    .from('items')
    .select('id,name,cost,avrg_energy,avrg_current,avrg_voltage');

  if (error) {
    console.error(error);
    return <div>Error loading data</div>;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
{items?.map((item, index) => (
  <Card key={index} className="@container/card">
    <CardHeader>
      <CardDescription className="flex flex-row items-center justify-between">{item.name}<DeleteButton id={item.id} /></CardDescription>
      <div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Rp {Number(item.cost).toLocaleString()}
        </CardTitle>
        <p className="font-poppins">per month</p>
      </div>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        <IconBoltFilled className="size-4" /> {item.avrg_energy} kWh
      </div>
      <div className="text-muted-foreground">
        {item.avrg_voltage}V / {item.avrg_current}mA
      </div>
    </CardFooter>
  </Card>
))}
      <Link href="/dashboard/add">
        <Card className="@container/card flex justify-center items-center bg-green-100 hover:bg-green-200 transition-all hover:cursor-pointer">
            <p className="font-semibold text-2xl">Add Item</p><IconPlus className=""/>
        </Card>
      </Link>
    </div>
  );
}
