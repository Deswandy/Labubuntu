import { createClient } from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
    let { data: electric_consumption, error } = await supabase
    .from('electric_consumption')
    .select('*')
    console.log(electric_consumption);
  return <pre>{JSON.stringify(electric_consumption, null, 2)}</pre>
}